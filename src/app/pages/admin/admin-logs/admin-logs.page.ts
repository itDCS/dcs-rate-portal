import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  refreshOutline,
  listOutline,
  searchOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  personOutline,
  timeOutline,
  locationOutline
} from 'ionicons/icons';
import { ApiService } from '@core/services/api.service';

interface AccessLog {
  id: number;
  userId: number | null;
  userEmail: string | null;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string | null;
  success: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/admin" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>
          <div class="header-logo">
            <span class="logo-dcs">DCS</span>
            <span class="logo-divider"></span>
            <span class="logo-text">Admin</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="loadLogs(true)" class="header-btn">
            <ion-icon slot="icon-only" name="refresh-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Page Header -->
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-icon">
            <ion-icon name="list-outline"></ion-icon>
          </div>
          <div class="page-info">
            <h1>Access Logs</h1>
            <p>Monitor login attempts and user activity</p>
          </div>
        </div>
      </section>

      <div class="logs-content">
        <!-- Controls Bar -->
        <div class="controls-bar">
          <div class="search-box">
            <ion-icon name="search-outline"></ion-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Search by email or IP address..."
            />
          </div>

          <div class="filter-tabs">
            <button
              class="filter-tab"
              [class.active]="actionFilter === ''"
              (click)="setFilter('')"
            >
              All
              <span class="tab-count">{{ totalCount() }}</span>
            </button>
            <button
              class="filter-tab"
              [class.active]="actionFilter === 'LOGIN'"
              (click)="setFilter('LOGIN')"
            >
              Login
            </button>
            <button
              class="filter-tab"
              [class.active]="actionFilter === 'LOGIN_FAILED'"
              (click)="setFilter('LOGIN_FAILED')"
            >
              Failed
            </button>
            <button
              class="filter-tab"
              [class.active]="actionFilter === 'REGISTER'"
              (click)="setFilter('REGISTER')"
            >
              Register
            </button>
            <button
              class="filter-tab"
              [class.active]="actionFilter === 'TARIFF_DOWNLOAD'"
              (click)="setFilter('TARIFF_DOWNLOAD')"
            >
              Downloads
            </button>
          </div>
        </div>

        <!-- Logs Table -->
        @if (loading() && logs().length === 0) {
          <div class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Loading logs...</p>
          </div>
        } @else if (logs().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">
              <ion-icon name="list-outline"></ion-icon>
            </div>
            <h3>No logs found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        } @else {
          <div class="table-card">
            <div class="table-container">
              <table class="premium-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>IP Address</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  @for (log of logs(); track log.id) {
                    <tr>
                      <td>
                        <div class="datetime-cell">
                          <span class="date">{{ formatDate(log.createdAt) }}</span>
                          <span class="time">{{ formatTime(log.createdAt) }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="user-cell">
                          @if (log.userEmail) {
                            <div class="user-avatar">
                              {{ getInitials(log.userEmail) }}
                            </div>
                            <span class="user-email">{{ log.userEmail }}</span>
                          } @else {
                            <span class="anonymous">Anonymous</span>
                          }
                        </div>
                      </td>
                      <td>
                        <span class="action-badge" [class]="getActionClass(log.action)">
                          {{ formatAction(log.action) }}
                        </span>
                      </td>
                      <td>
                        <div class="ip-cell">
                          <ion-icon name="location-outline"></ion-icon>
                          <span>{{ log.ipAddress }}</span>
                        </div>
                      </td>
                      <td>
                        @if (log.success) {
                          <span class="status-badge success">
                            <span class="status-dot"></span>
                            Success
                          </span>
                        } @else {
                          <span class="status-badge failed">
                            <span class="status-dot"></span>
                            Failed
                          </span>
                        }
                      </td>
                      <td>
                        <span class="details-cell" [title]="log.details || ''">
                          {{ log.details || '-' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>

      <ion-infinite-scroll (ionInfinite)="loadMore($event)" [disabled]="!hasMore()">
        <ion-infinite-scroll-content loadingSpinner="crescent"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
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

    /* Page Header */
    .page-header {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      padding: 32px 24px;
    }

    .page-header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .page-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-icon ion-icon {
      font-size: 28px;
      color: #ffffff;
    }

    .page-info h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 4px;
    }

    .page-info p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    /* Logs Content */
    .logs-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      min-width: 300px;
      flex: 1;
      max-width: 400px;
      transition: border-color 0.2s ease;
    }

    .search-box:focus-within {
      border-color: #1e3a5f;
    }

    .search-box ion-icon {
      font-size: 20px;
      color: #64748b;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: #1e3a5f;
      background: transparent;
    }

    .search-box input::placeholder {
      color: #94a3b8;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tab:hover {
      border-color: #1e3a5f;
      color: #1e3a5f;
    }

    .filter-tab.active {
      background: #1e3a5f;
      border-color: #1e3a5f;
      color: #ffffff;
    }

    .tab-count {
      background: rgba(0, 0, 0, 0.1);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .filter-tab.active .tab-count {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Loading & Empty States */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .loading-state ion-spinner {
      width: 40px;
      height: 40px;
      color: #1e3a5f;
    }

    .loading-state p {
      font-size: 14px;
      color: #64748b;
      margin: 16px 0 0;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .empty-icon ion-icon {
      font-size: 36px;
      color: #94a3b8;
    }

    .empty-state h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 8px;
    }

    .empty-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .premium-table {
      width: 100%;
      min-width: 900px;
      border-collapse: collapse;
    }

    .premium-table thead {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .premium-table th {
      padding: 14px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .premium-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .premium-table tbody tr:last-child {
      border-bottom: none;
    }

    .premium-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .premium-table td {
      padding: 16px;
      font-size: 14px;
      color: #1e3a5f;
    }

    /* DateTime Cell */
    .datetime-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .datetime-cell .date {
      font-weight: 500;
      color: #1e3a5f;
    }

    .datetime-cell .time {
      font-size: 12px;
      color: #64748b;
    }

    /* User Cell */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .user-email {
      font-size: 14px;
      color: #1e3a5f;
    }

    .anonymous {
      font-size: 14px;
      color: #94a3b8;
      font-style: italic;
    }

    /* Action Badge */
    .action-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-badge.login {
      background: #dbeafe;
      color: #1e40af;
    }

    .action-badge.login-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .action-badge.register {
      background: #dcfce7;
      color: #166534;
    }

    .action-badge.activate {
      background: #fef3c7;
      color: #92400e;
    }

    .action-badge.password-reset {
      background: #f3e8ff;
      color: #6b21a8;
    }

    .action-badge.tariff-download {
      background: linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(212, 160, 23, 0.15) 100%);
      color: #92400e;
    }

    .action-badge.default {
      background: #f1f5f9;
      color: #475569;
    }

    /* IP Cell */
    .ip-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 13px;
    }

    .ip-cell ion-icon {
      font-size: 16px;
      color: #94a3b8;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.success {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Details Cell */
    .details-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #64748b;
      font-size: 13px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        padding: 24px 20px;
      }

      .page-info h1 {
        font-size: 24px;
      }

      .logs-content {
        padding: 16px;
      }

      .controls-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
        min-width: 0;
      }

      .filter-tabs {
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .filter-tab {
        white-space: nowrap;
      }
    }
  `]
})
export class AdminLogsPage implements OnInit {
  loading = signal(false);
  logs = signal<AccessLog[]>([]);
  hasMore = signal(true);
  totalCount = signal(0);
  searchQuery = '';
  actionFilter = '';
  private page = 1;
  private pageSize = 50;

  constructor(private api: ApiService) {
    addIcons({
      refreshOutline,
      listOutline,
      searchOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      personOutline,
      timeOutline,
      locationOutline
    });
  }

  ngOnInit(): void {
    this.loadLogs(true);
  }

  loadLogs(reset = false): void {
    if (reset) {
      this.page = 1;
      this.logs.set([]);
      this.hasMore.set(true);
    }

    this.loading.set(true);

    const params: any = {
      page: this.page,
      limit: this.pageSize
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    if (this.actionFilter) {
      params.action = this.actionFilter;
    }

    this.api.get<{ logs: AccessLog[]; total: number }>('admin/logs', params).subscribe({
      next: (response) => {
        if (reset) {
          this.logs.set(response.logs);
          this.totalCount.set(response.total);
        } else {
          this.logs.update(current => [...current, ...response.logs]);
        }
        this.hasMore.set(response.logs.length === this.pageSize);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: string): void {
    this.actionFilter = filter;
    this.loadLogs(true);
  }

  onSearch(): void {
    this.loadLogs(true);
  }

  loadMore(event: any): void {
    this.page++;
    this.api.get<{ logs: AccessLog[]; total: number }>('admin/logs', {
      page: this.page,
      limit: this.pageSize,
      search: this.searchQuery || undefined,
      action: this.actionFilter || undefined
    }).subscribe({
      next: (response) => {
        this.logs.update(current => [...current, ...response.logs]);
        this.hasMore.set(response.logs.length === this.pageSize);
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any): void {
    this.page = 1;
    this.api.get<{ logs: AccessLog[]; total: number }>('admin/logs', {
      page: 1,
      limit: this.pageSize,
      search: this.searchQuery || undefined,
      action: this.actionFilter || undefined
    }).subscribe({
      next: (response) => {
        this.logs.set(response.logs);
        this.totalCount.set(response.total);
        this.hasMore.set(response.logs.length === this.pageSize);
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAction(action: string): string {
    return action.replace(/_/g, ' ');
  }

  getActionClass(action: string): string {
    const classMap: Record<string, string> = {
      'LOGIN': 'login',
      'LOGIN_FAILED': 'login-failed',
      'REGISTER': 'register',
      'ACTIVATE': 'activate',
      'PASSWORD_RESET': 'password-reset',
      'TARIFF_DOWNLOAD': 'tariff-download'
    };
    return classMap[action] || 'default';
  }

  getInitials(email: string): string {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }
}
