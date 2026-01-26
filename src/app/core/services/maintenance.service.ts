import { Injectable, computed, signal } from '@angular/core';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { MaintenanceStatus } from '../models/user.model';

interface MaintenanceResponse {
  success: boolean;
  maintenance: MaintenanceStatus;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private maintenanceStatus = signal<MaintenanceStatus | null>(null);

  status = computed(() => this.maintenanceStatus());
  isUnderMaintenance = computed(() => this.maintenanceStatus()?.enabled ?? false);
  message = computed(() => this.maintenanceStatus()?.message ?? '');
  estimatedEnd = computed(() => this.maintenanceStatus()?.estimatedEnd ?? null);

  constructor(private api: ApiService) {}

  checkStatus(): Observable<MaintenanceStatus> {
    return this.api.get<MaintenanceResponse>('maintenance/status').pipe(
      tap(response => {
        if (response.success && response.maintenance) {
          this.maintenanceStatus.set(response.maintenance);
        }
      }),
      map(response => response.maintenance || { enabled: false, message: '' }),
      catchError(() => {
        return of({ enabled: false, message: '' } as MaintenanceStatus);
      })
    );
  }

  setStatus(status: MaintenanceStatus): void {
    this.maintenanceStatus.set(status);
  }

  clearStatus(): void {
    this.maintenanceStatus.set(null);
  }
}
