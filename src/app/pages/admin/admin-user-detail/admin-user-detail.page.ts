import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, mailOutline, refreshOutline } from 'ionicons/icons';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models/user.model';

interface AccessLog {
  id: number;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string | null;
  success: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/admin/users"></ion-back-button>
        </ion-buttons>
        <ion-title>User Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="detail-container">
        @if (loading()) {
          <div class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
          </div>
        } @else if (!user()) {
          <div class="empty-state">
            <h3>User not found</h3>
          </div>
        } @else {
          <ion-grid>
            <ion-row>
              <ion-col size="12" sizeLg="6">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title>Profile Information</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="label">Name</span>
                        <span class="value">{{ user()!.firstName }} {{ user()!.lastName }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Email</span>
                        <span class="value">{{ user()!.email }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Company</span>
                        <span class="value">{{ user()!.company }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Country</span>
                        <span class="value">{{ user()!.country }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Phone</span>
                        <span class="value">{{ user()!.phone || '-' }}</span>
                      </div>
                    </div>
                  </ion-card-content>
                </ion-card>
              </ion-col>

              <ion-col size="12" sizeLg="6">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title>Account Status</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="label">Status</span>
                        <span class="value">
                          @if (!user()!.isActive) {
                            <span class="status-badge pending">Pending Activation</span>
                          } @else if (!user()!.isEnabled) {
                            <span class="status-badge disabled">Disabled</span>
                          } @else {
                            <span class="status-badge active">Active</span>
                          }
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="label">Role</span>
                        <span class="value">{{ user()!.role }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Registered</span>
                        <span class="value">{{ formatDate(user()!.createdAt) }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Last Login</span>
                        <span class="value">{{ formatDateTime(user()!.lastLogin) }}</span>
                      </div>
                    </div>

                    <div class="action-buttons">
                      @if (user()!.isEnabled) {
                        <ion-button color="danger" (click)="disableUser()">
                          <ion-icon name="close-circle" slot="start"></ion-icon>
                          Disable Account
                        </ion-button>
                      } @else if (user()!.isActive) {
                        <ion-button color="success" (click)="enableUser()">
                          <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                          Enable Account
                        </ion-button>
                      }
                    </div>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="12">
                <ion-card>
                  <ion-card-header>
                    <ion-card-title>Recent Activity</ion-card-title>
                  </ion-card-header>
                  <ion-card-content class="table-container">
                    @if (logs().length === 0) {
                      <p class="no-data">No activity logs found</p>
                    } @else {
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>IP Address</th>
                            <th>Status</th>
                            <th>Details</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (log of logs(); track log.id) {
                            <tr>
                              <td>{{ log.action }}</td>
                              <td>{{ log.ipAddress }}</td>
                              <td>
                                @if (log.success) {
                                  <span class="status-badge active">Success</span>
                                } @else {
                                  <span class="status-badge disabled">Failed</span>
                                }
                              </td>
                              <td>{{ log.details || '-' }}</td>
                              <td>{{ formatDateTime(log.createdAt) }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    }
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .detail-container {
      padding: 16px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 64px 24px;
    }

    .info-grid {
      display: grid;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item .label {
      font-size: 12px;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .info-item .value {
      font-size: 15px;
      color: var(--ion-color-dark);
    }

    .action-buttons {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .table-container {
      overflow-x: auto;
      padding: 0;
    }

    .no-data {
      text-align: center;
      padding: 24px;
      color: var(--ion-color-medium);
    }
  `]
})
export class AdminUserDetailPage implements OnInit {
  loading = signal(true);
  user = signal<User | null>(null);
  logs = signal<AccessLog[]>([]);

  private userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    addIcons({ checkmarkCircle, closeCircle, mailOutline, refreshOutline });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = parseInt(id, 10);
      this.loadUser();
    }
  }

  loadUser(): void {
    this.loading.set(true);
    this.api.get<{ user: User; logs: AccessLog[] }>(`admin/users/${this.userId}`).subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.logs.set(response.logs || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  enableUser(): void {
    this.api.put(`admin/users/${this.userId}/enable`).subscribe({
      next: () => {
        this.loadUser();
      }
    });
  }

  disableUser(): void {
    const reason = prompt('Reason for disabling this account:');
    if (reason === null) return;

    this.api.put(`admin/users/${this.userId}/disable`, { reason }).subscribe({
      next: () => {
        this.loadUser();
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  formatDateTime(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  }
}
