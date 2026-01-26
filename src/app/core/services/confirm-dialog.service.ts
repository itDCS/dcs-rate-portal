import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  // Dialog state
  isOpen = signal(false);
  config = signal<ConfirmDialogConfig | null>(null);
  loading = signal(false);

  // Result subject
  private resultSubject = new Subject<boolean>();

  /**
   * Open a confirmation dialog
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    this.config.set({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'info',
      ...config
    });
    this.isOpen.set(true);
    this.loading.set(false);

    return new Promise<boolean>((resolve) => {
      const subscription = this.resultSubject.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  /**
   * Close dialog and emit result
   */
  close(result: boolean): void {
    this.isOpen.set(false);
    this.resultSubject.next(result);
  }

  /**
   * Set loading state (useful for async operations)
   */
  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}
