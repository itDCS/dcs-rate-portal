import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  documentTextOutline,
  logOutOutline,
  listOutline,
  trendingUpOutline,
  personOutline,
  downloadOutline,
  calendarOutline
} from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalDownloads: number;
  downloadsToday: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonMenuButton
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
                <div class="stat-icon downloads">
                  <ion-icon name="download-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.totalDownloads || 0 }}</span>
                  <span class="stat-label">Total Downloads</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon downloads-today">
                  <ion-icon name="document-text-outline"></ion-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stats()?.downloadsToday || 0 }}</span>
                  <span class="stat-label">Downloads Today</span>
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
    .stat-icon.downloads { background: linear-gradient(135deg, #b8860b 0%, #d4a017 100%); }
    .stat-icon.downloads-today { background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); }

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
    }
  `]
})
export class AdminDashboardPage implements OnInit {
  loading = signal(true);
  stats = signal<DashboardStats | null>(null);

  constructor(
    private authService: AuthService,
    private api: ApiService
  ) {
    addIcons({
      peopleOutline,
      documentTextOutline,
      logOutOutline,
      listOutline,
      trendingUpOutline,
      personOutline,
      downloadOutline,
      calendarOutline
    });
  }

  ngOnInit(): void {
    this.loadStats();
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

  logout(): void {
    this.authService.logout();
  }
}
