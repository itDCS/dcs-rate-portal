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
                    <th class="th-datetime">Timestamp</th>
                    <th class="th-user">User</th>
                    <th class="th-action">Action</th>
                    <th class="th-status">Status</th>
                    <th class="th-details">Details</th>
                  </tr>
                </thead>
                <tbody>
                  @for (log of logs(); track log.id) {
                    <tr [class.row-failed]="!log.success">
                      <td>
                        <div class="datetime-cell">
                          <span class="date">{{ formatDate(log.createdAt) }}</span>
                          <span class="time">{{ formatTime(log.createdAt) }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="user-cell">
                          @if (log.userEmail) {
                            <div class="user-avatar" [class]="getAvatarClass(log.action)">
                              {{ getInitials(log.userEmail) }}
                            </div>
                            <div class="user-info">
                              <span class="user-email">{{ log.userEmail }}</span>
                              <span class="user-ip">{{ log.ipAddress }}</span>
                            </div>
                          } @else {
                            <div class="user-avatar anonymous-avatar">?</div>
                            <div class="user-info">
                              <span class="anonymous">Anonymous</span>
                              <span class="user-ip">{{ log.ipAddress }}</span>
                            </div>
                          }
                        </div>
                      </td>
                      <td>
                        <div class="action-cell">
                          <span class="action-badge" [class]="getActionClass(log.action)">
                            <span class="action-icon">{{ getActionIcon(log.action) }}</span>
                            {{ formatAction(log.action) }}
                          </span>
                        </div>
                      </td>
                      <td>
                        @if (log.success) {
                          <span class="status-pill success">
                            <span class="status-indicator"></span>
                            Success
                          </span>
                        } @else {
                          <span class="status-pill failed">
                            <span class="status-indicator"></span>
                            Failed
                          </span>
                        }
                      </td>
                      <td>
                        @if (log.details) {
                          <div class="details-cell" [title]="log.details">
                            {{ log.details }}
                          </div>
                        } @else {
                          <span class="no-details">—</span>
                        }
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
      min-width: 850px;
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

    /* Table Headers */
    .th-datetime { width: 140px; }
    .th-user { min-width: 280px; }
    .th-action { width: 180px; }
    .th-status { width: 100px; }
    .th-details { min-width: 200px; }

    /* Row States */
    .row-failed {
      background-color: #fef2f2 !important;
    }

    .row-failed:hover {
      background-color: #fee2e2 !important;
    }

    /* DateTime Cell */
    .datetime-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .datetime-cell .date {
      font-weight: 600;
      font-size: 13px;
      color: #1e3a5f;
    }

    .datetime-cell .time {
      font-size: 12px;
      color: #64748b;
      font-family: 'SF Mono', Consolas, monospace;
    }

    /* User Cell */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .user-avatar.avatar-login { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); }
    .user-avatar.avatar-failed { background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%); }
    .user-avatar.avatar-register { background: linear-gradient(135deg, #166534 0%, #22c55e 100%); }
    .user-avatar.avatar-admin { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); }
    .user-avatar.avatar-download { background: linear-gradient(135deg, #b8860b 0%, #d4a846 100%); }
    .user-avatar.anonymous-avatar { background: #94a3b8; }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .user-email {
      font-size: 14px;
      font-weight: 500;
      color: #1e3a5f;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-ip {
      font-size: 11px;
      color: #94a3b8;
      font-family: 'SF Mono', Consolas, monospace;
    }

    .anonymous {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
    }

    /* Action Cell */
    .action-cell {
      display: flex;
      align-items: center;
    }

    .action-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .action-icon {
      font-size: 12px;
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
      background: #d1fae5;
      color: #065f46;
    }

    .action-badge.activate {
      background: #fef3c7;
      color: #92400e;
    }

    .action-badge.password-reset,
    .action-badge.password-reset-request {
      background: #f3e8ff;
      color: #6b21a8;
    }

    .action-badge.send-credentials {
      background: #fef3c7;
      color: #b45309;
    }

    .action-badge.tariff-download,
    .action-badge.tariff-view {
      background: #fef9c3;
      color: #a16207;
    }

    .action-badge.disable,
    .action-badge.enable {
      background: #e0e7ff;
      color: #3730a3;
    }

    .action-badge.default {
      background: #f1f5f9;
      color: #475569;
    }

    /* Status Pill */
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .status-pill.success {
      background: #dcfce7;
      color: #166534;
    }

    .status-pill.failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s infinite;
    }

    .status-pill.success .status-indicator {
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Details Cell */
    .details-cell {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #64748b;
      font-size: 12px;
      cursor: help;
    }

    .no-details {
      color: #cbd5e1;
      font-size: 14px;
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
      'PASSWORD_RESET_REQUEST': 'password-reset-request',
      'SEND_CREDENTIALS': 'send-credentials',
      'TARIFF_DOWNLOAD': 'tariff-download',
      'TARIFF_VIEW': 'tariff-view',
      'DISABLE': 'disable',
      'ENABLE': 'enable'
    };
    return classMap[action] || 'default';
  }

  getActionIcon(action: string): string {
    const iconMap: Record<string, string> = {
      'LOGIN': '🔓',
      'LOGIN_FAILED': '🚫',
      'REGISTER': '📝',
      'ACTIVATE': '✅',
      'PASSWORD_RESET': '🔑',
      'PASSWORD_RESET_REQUEST': '📧',
      'SEND_CREDENTIALS': '📨',
      'TARIFF_DOWNLOAD': '📥',
      'TARIFF_VIEW': '👁️',
      'DISABLE': '🔒',
      'ENABLE': '🔓'
    };
    return iconMap[action] || '📋';
  }

  getAvatarClass(action: string): string {
    if (action === 'LOGIN_FAILED') return 'avatar-failed';
    if (action === 'LOGIN') return 'avatar-login';
    if (action === 'REGISTER' || action === 'ACTIVATE') return 'avatar-register';
    if (action.includes('TARIFF')) return 'avatar-download';
    if (action.includes('ADMIN') || action === 'SEND_CREDENTIALS' || action === 'DISABLE' || action === 'ENABLE') return 'avatar-admin';
    return '';
  }

  getInitials(email: string): string {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }
}
