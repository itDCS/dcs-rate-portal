import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonMenuButton,
  IonToggle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  documentTextOutline,
  logOutOutline,
  listOutline,
  trendingUpOutline,
  personOutline,
  calendarOutline,
  settingsOutline,
  warningOutline,
  checkmarkCircleOutline,
  timeOutline,
  logInOutline
} from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { MaintenanceService } from '@core/services/maintenance.service';
import { MaintenanceStatus } from '@core/models/user.model';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  loginsToday: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonMenuButton,
    IonToggle,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonText
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="header-logo">
            <span class="logo-dcs">DCS</span>
            <span class="logo-divider"></span>
            <span class="logo-text">Admin</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()" class="header-btn">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Admin Header -->
      <section class="admin-header">
        <div class="admin-header-content">
          <p class="admin-label">Administration</p>
          <h1 class="admin-title">Portal Dashboard</h1>
          <p class="admin-subtitle">Monitor activity and manage users</p>
        </div>
      </section>

      <div class="dashboard-content">
        @if (loading()) {
          <div class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Loading statistics...</p>
          </div>
        } @else {
          <!-- Stats Grid -->
          <section class="stats-section">
            <h2 class="section-title">Overview</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon users">
                  <ion-icon name="people-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.totalUsers || 0 }}</span>
                  <span class="stat-label">Total Users</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon active">
                  <ion-icon name="person-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.activeUsers || 0 }}</span>
                  <span class="stat-label">Active Users</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon today">
                  <ion-icon name="trending-up-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.newUsersToday || 0 }}</span>
                  <span class="stat-label">New Today</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon week">
                  <ion-icon name="calendar-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.newUsersThisWeek || 0 }}</span>
                  <span class="stat-label">This Week</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon pending">
                  <ion-icon name="time-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.pendingUsers || 0 }}</span>
                  <span class="stat-label">Pending Activation</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon logins">
                  <ion-icon name="log-in-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.loginsToday || 0 }}</span>
                  <span class="stat-label">Logins Today</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
              <div class="action-card" [routerLink]="['/admin/users']">
                <div class="action-icon">
                  <ion-icon name="people-outline"></ion-icon>
                </div>
                <div class="action-info">
                  <h3>Manage Users</h3>
                  <p>View, enable, or disable user accounts</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="action-card" [routerLink]="['/admin/logs']">
                <div class="action-icon">
                  <ion-icon name="list-outline"></ion-icon>
                </div>
                <div class="action-info">
                  <h3>Access Logs</h3>
                  <p>View login attempts and user activity</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="action-card" [routerLink]="['/dashboard']">
                <div class="action-icon secondary">
                  <ion-icon name="document-text-outline"></ion-icon>
                </div>
                <div class="action-info">
                  <h3>View Portal</h3>
                  <p>Access the user-facing rate portal</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- Maintenance Mode -->
          <section class="maintenance-section">
            <h2 class="section-title">
              <ion-icon name="settings-outline"></ion-icon>
              System Maintenance
            </h2>
            <div class="maintenance-card" [class.active]="maintenanceEnabled()">
              <div class="maintenance-header">
                <div class="maintenance-status">
                  <div class="status-indicator" [class.active]="maintenanceEnabled()"></div>
                  <div class="status-text">
                    <span class="status-label">Maintenance Mode</span>
                    <span class="status-value">{{ maintenanceEnabled() ? 'Active' : 'Inactive' }}</span>
                  </div>
                </div>
                <ion-toggle
                  [checked]="maintenanceEnabled()"
                  (ionChange)="onMaintenanceToggle($event)"
                  [disabled]="maintenanceLoading()"
                  mode="ios"
                ></ion-toggle>
              </div>

              @if (maintenanceEnabled()) {
                <div class="maintenance-warning">
                  <ion-icon name="warning-outline"></ion-icon>
                  <span>Regular users cannot login while maintenance mode is active</span>
                </div>
              }

              <div class="maintenance-form">
                <div class="form-group">
                  <label>Custom Message (optional)</label>
                  <ion-textarea
                    [(ngModel)]="maintenanceMessage"
                    placeholder="Enter a message to display to users..."
                    [autoGrow]="true"
                    rows="2"
                    class="maintenance-textarea"
                  ></ion-textarea>
                </div>
                <div class="form-group">
                  <label>Estimated End Time (optional)</label>
                  <ion-input
                    type="datetime-local"
                    [(ngModel)]="maintenanceEndTime"
                    class="maintenance-input"
                  ></ion-input>
                </div>
              </div>

              @if (maintenanceEnabled() && maintenanceStatus()) {
                <div class="maintenance-info">
                  <div class="info-item">
                    <span class="info-label">Started</span>
                    <span class="info-value">{{ formatDate(maintenanceStatus()?.startedAt) }}</span>
                  </div>
                  @if (maintenanceStatus()?.estimatedEnd) {
                    <div class="info-item">
                      <span class="info-label">Estimated End</span>
                      <span class="info-value">{{ formatDate(maintenanceStatus()?.estimatedEnd) }}</span>
                    </div>
                  }
                </div>
              }

              <div class="maintenance-actions">
                <ion-button
                  fill="solid"
                  [color]="maintenanceEnabled() ? 'danger' : 'primary'"
                  (click)="toggleMaintenance()"
                  [disabled]="maintenanceLoading()"
                  class="maintenance-btn"
                >
                  @if (maintenanceLoading()) {
                    <ion-spinner name="crescent"></ion-spinner>
                  } @else if (maintenanceEnabled()) {
                    <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
                    Disable Maintenance
                  } @else {
                    <ion-icon name="warning-outline" slot="start"></ion-icon>
                    Enable Maintenance
                  }
                </ion-button>
              </div>
            </div>
          </section>
        }
      </div>

      <!-- Footer -->
      <footer class="admin-footer">
        <p>DCS Rate Portal Administration | FMC License No. 024818</p>
      </footer>
    </ion-content>
  `,
  styles: [`
    /* Premium Header */
    .premium-header ion-toolbar {
      --background: #ffffff;
      --border-color: #e2e8f0;
      --border-width: 0 0 1px 0;
    }

    .header-logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-dcs {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: 1px;
    }

    .logo-divider {
      width: 1px;
      height: 18px;
      background: linear-gradient(180deg, transparent, #b8860b, transparent);
    }

    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .header-btn {
      --color: #1e3a5f;
    }

    /* Admin Header */
    .admin-header {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      padding: 40px 24px;
    }

    .admin-header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 8px;
    }

    .admin-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 8px;
    }

    .admin-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    /* Dashboard Content */
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      gap: 16px;
    }

    .loading-state ion-spinner {
      width: 40px;
      height: 40px;
      color: #1e3a5f;
    }

    .loading-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    /* Section Title */
    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f1f5f9;
    }

    /* Stats Grid */
    .stats-section {
      margin-bottom: 40px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: #1e3a5f;
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.08);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon ion-icon {
      font-size: 24px;
      color: #ffffff;
    }

    .stat-icon.users { background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); }
    .stat-icon.active { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); }
    .stat-icon.today { background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); }
    .stat-icon.week { background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); }
    .stat-icon.pending { background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%); }
    .stat-icon.logins { background: linear-gradient(135deg, #0891b2 0%, #22d3ee 100%); }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a5f;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Actions Grid */
    .actions-section {
      margin-bottom: 32px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .action-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-card:hover {
      border-color: #1e3a5f;
      box-shadow: 0 8px 24px rgba(30, 58, 95, 0.1);
      transform: translateY(-2px);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon.secondary {
      background: linear-gradient(135deg, #b8860b 0%, #d4a017 100%);
    }

    .action-icon ion-icon {
      font-size: 26px;
      color: #ffffff;
    }

    .action-info {
      flex: 1;
    }

    .action-info h3 {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 4px;
    }

    .action-info p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }

    .action-arrow {
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .action-card:hover .action-arrow {
      transform: translateX(4px);
      color: #1e3a5f;
    }

    /* Footer */
    .admin-footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .admin-footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }

    /* Maintenance Section */
    .maintenance-section {
      margin-bottom: 32px;
    }

    .maintenance-section .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .maintenance-section .section-title ion-icon {
      font-size: 22px;
      color: #b8860b;
    }

    .maintenance-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .maintenance-card.active {
      border-color: #dc2626;
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    }

    .maintenance-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .maintenance-status {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
    }

    .status-indicator.active {
      background: #dc2626;
      box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
      animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .status-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-value {
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
    }

    .maintenance-card.active .status-value {
      color: #dc2626;
    }

    ion-toggle {
      --track-background: #e2e8f0;
      --track-background-checked: #dc2626;
      --handle-background: #ffffff;
      --handle-background-checked: #ffffff;
    }

    .maintenance-warning {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fef3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
    }

    .maintenance-warning ion-icon {
      font-size: 20px;
      color: #856404;
      flex-shrink: 0;
    }

    .maintenance-warning span {
      font-size: 14px;
      color: #856404;
    }

    .maintenance-form {
      display: grid;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: #475569;
    }

    .maintenance-textarea,
    .maintenance-input {
      --background: #f8fafc;
      --border-radius: 8px;
      --padding-start: 12px;
      --padding-end: 12px;
      --padding-top: 10px;
      --padding-bottom: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
    }

    .maintenance-textarea:focus-within,
    .maintenance-input:focus-within {
      border-color: #1e3a5f;
    }

    .maintenance-info {
      display: flex;
      gap: 24px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      font-weight: 500;
      color: #1e3a5f;
    }

    .maintenance-actions {
      display: flex;
      justify-content: flex-end;
    }

    .maintenance-btn {
      --border-radius: 8px;
      font-weight: 500;
      min-width: 180px;
    }

    .maintenance-btn ion-spinner {
      width: 20px;
      height: 20px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .admin-header {
        padding: 32px 20px;
      }

      .admin-title {
        font-size: 26px;
      }

      .dashboard-content {
        padding: 24px 16px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .maintenance-card {
        padding: 20px 16px;
      }

      .maintenance-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .maintenance-info {
        flex-direction: column;
        gap: 12px;
      }

      .maintenance-actions {
        justify-content: stretch;
      }

      .maintenance-btn {
        width: 100%;
      }
    }
  `]
})
export class AdminDashboardPage implements OnInit {
  loading = signal(true);
  stats = signal<DashboardStats | null>(null);

  // Maintenance mode
  maintenanceStatus = signal<MaintenanceStatus | null>(null);
  maintenanceEnabled = signal(false);
  maintenanceLoading = signal(false);
  maintenanceMessage = '';
  maintenanceEndTime = '';

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private maintenanceService: MaintenanceService
  ) {
    addIcons({
      peopleOutline,
      documentTextOutline,
      logOutOutline,
      listOutline,
      trendingUpOutline,
      personOutline,
      calendarOutline,
      settingsOutline,
      warningOutline,
      checkmarkCircleOutline,
      timeOutline,
      logInOutline
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadMaintenanceStatus();
  }

  loadStats(): void {
    this.api.get<DashboardStats>('admin/dashboard').subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadMaintenanceStatus(): void {
    this.maintenanceService.checkStatus().subscribe({
      next: (status) => {
        this.maintenanceStatus.set(status);
        this.maintenanceEnabled.set(status.enabled);
        this.maintenanceMessage = status.message || '';
        if (status.estimatedEnd) {
          const date = new Date(status.estimatedEnd);
          this.maintenanceEndTime = this.formatDateTimeLocal(date);
        }
      }
    });
  }

  onMaintenanceToggle(event: CustomEvent): void {
    // Prevent toggle from changing immediately - we'll handle it via the button
    event.preventDefault();
  }

  toggleMaintenance(): void {
    const newStatus = !this.maintenanceEnabled();
    this.maintenanceLoading.set(true);

    const payload: { enabled: boolean; message?: string; estimatedEnd?: string } = {
      enabled: newStatus
    };

    if (newStatus && this.maintenanceMessage.trim()) {
      payload.message = this.maintenanceMessage.trim();
    }

    if (newStatus && this.maintenanceEndTime) {
      payload.estimatedEnd = new Date(this.maintenanceEndTime).toISOString();
    }

    this.api.put<{ maintenance: MaintenanceStatus }>('admin/maintenance', payload).subscribe({
      next: (response) => {
        this.maintenanceEnabled.set(response.maintenance.enabled);
        this.maintenanceStatus.set(response.maintenance);
        this.maintenanceService.setStatus(response.maintenance);
        this.maintenanceLoading.set(false);

        if (!response.maintenance.enabled) {
          this.maintenanceMessage = '';
          this.maintenanceEndTime = '';
        }
      },
      error: () => {
        this.maintenanceLoading.set(false);
      }
    });
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  logout(): void {
    this.authService.logout();
  }
}
