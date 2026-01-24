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
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, checkmarkCircle, closeCircle, refreshOutline, peopleOutline, searchOutline } from 'ionicons/icons';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-admin-users',
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
    IonBackButton,
    IonButton,
    IonIcon,
    IonSpinner,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent
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
          <ion-button (click)="loadUsers()" class="header-btn">
            <ion-icon slot="icon-only" name="refresh-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Page Header -->
      <section class="page-header">
        <div class="page-header-content">
          <div class="page-icon">
            <ion-icon name="people-outline"></ion-icon>
          </div>
          <div class="page-info">
            <h1>Manage Users</h1>
            <p>View and manage registered user accounts</p>
          </div>
        </div>
      </section>

      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="users-container">
        <!-- Search and Filter Bar -->
        <div class="search-filter-bar">
          <div class="search-box">
            <ion-icon name="search-outline"></ion-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterUsers()"
              placeholder="Search by name, email, or company..."
            />
          </div>

          <div class="filter-tabs">
            <button
              [class.active]="filter === 'all'"
              (click)="setFilter('all')"
            >
              All
              <span class="count">{{ getCounts().all }}</span>
            </button>
            <button
              [class.active]="filter === 'active'"
              (click)="setFilter('active')"
            >
              Active
              <span class="count success">{{ getCounts().active }}</span>
            </button>
            <button
              [class.active]="filter === 'disabled'"
              (click)="setFilter('disabled')"
            >
              Disabled
              <span class="count danger">{{ getCounts().disabled }}</span>
            </button>
            <button
              [class.active]="filter === 'pending'"
              (click)="setFilter('pending')"
            >
              Pending
              <span class="count warning">{{ getCounts().pending }}</span>
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Loading users...</p>
          </div>
        } @else if (filteredUsers().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">
              <ion-icon name="people-outline"></ion-icon>
            </div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        } @else {
          <div class="table-card">
            <div class="table-wrapper">
              <table class="premium-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of filteredUsers(); track user.id) {
                    <tr>
                      <td class="name-cell">
                        <div class="user-avatar">{{ getInitials(user) }}</div>
                        <span>{{ user.firstName }} {{ user.lastName }}</span>
                      </td>
                      <td class="email-cell">{{ user.email }}</td>
                      <td>{{ user.company }}</td>
                      <td>
                        <span class="country-badge">{{ user.country }}</span>
                      </td>
                      <td>
                        @if (!user.isActive) {
                          <span class="status-badge pending">
                            <span class="status-dot"></span>
                            Pending
                          </span>
                        } @else if (!user.isEnabled) {
                          <span class="status-badge disabled">
                            <span class="status-dot"></span>
                            Disabled
                          </span>
                        } @else {
                          <span class="status-badge active">
                            <span class="status-dot"></span>
                            Active
                          </span>
                        }
                      </td>
                      <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
                      <td class="actions-cell">
                        <button class="action-btn view" [routerLink]="['/admin/users', user.id]" title="View details">
                          <ion-icon name="eye-outline"></ion-icon>
                        </button>
                        @if (user.isEnabled) {
                          <button class="action-btn disable" (click)="disableUser(user)" title="Disable user">
                            <ion-icon name="close-circle"></ion-icon>
                          </button>
                        } @else if (user.isActive) {
                          <button class="action-btn enable" (click)="enableUser(user)" title="Enable user">
                            <ion-icon name="checkmark-circle"></ion-icon>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="table-footer">
            <p>Showing {{ filteredUsers().length }} of {{ users().length }} users</p>
          </div>
        }
      </div>
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
      font-size: 26px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 4px;
    }

    .page-info p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    /* Users Container */
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Search & Filter Bar */
    .search-filter-bar {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      transition: border-color 0.2s ease;
    }

    .search-box:focus-within {
      border-color: #1e3a5f;
    }

    .search-box ion-icon {
      font-size: 20px;
      color: #94a3b8;
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

    .filter-tabs button {
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

    .filter-tabs button:hover {
      border-color: #1e3a5f;
      color: #1e3a5f;
    }

    .filter-tabs button.active {
      background: #1e3a5f;
      border-color: #1e3a5f;
      color: #ffffff;
    }

    .filter-tabs .count {
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .filter-tabs button.active .count {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .count.success { color: #16a34a; }
    .count.danger { color: #dc2626; }
    .count.warning { color: #d97706; }

    /* Loading & Empty States */
    .loading-state, .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .loading-state ion-spinner {
      width: 40px;
      height: 40px;
      color: #1e3a5f;
    }

    .loading-state p {
      margin: 16px 0 0;
      font-size: 14px;
      color: #64748b;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .empty-icon ion-icon {
      font-size: 32px;
      color: #94a3b8;
    }

    .empty-state h3 {
      font-size: 18px;
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

    .table-wrapper {
      overflow-x: auto;
    }

    .premium-table {
      width: 100%;
      min-width: 900px;
      border-collapse: collapse;
    }

    .premium-table th {
      background: #f8fafc;
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }

    .premium-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      color: #475569;
    }

    .premium-table tr:last-child td {
      border-bottom: none;
    }

    .premium-table tr:hover td {
      background: #f8fafc;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
      color: #1e3a5f;
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
      flex-shrink: 0;
    }

    .email-cell {
      color: #64748b;
    }

    .country-badge {
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #475569;
    }

    .date-cell {
      color: #64748b;
      font-size: 13px;
    }

    /* Status Badges */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.active .status-dot {
      background: #16a34a;
    }

    .status-badge.disabled {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.disabled .status-dot {
      background: #dc2626;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.pending .status-dot {
      background: #d97706;
    }

    /* Action Buttons */
    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn ion-icon {
      font-size: 18px;
    }

    .action-btn.view {
      background: #f1f5f9;
      color: #1e3a5f;
    }

    .action-btn.view:hover {
      background: #1e3a5f;
      color: #ffffff;
    }

    .action-btn.enable {
      background: #dcfce7;
      color: #16a34a;
    }

    .action-btn.enable:hover {
      background: #16a34a;
      color: #ffffff;
    }

    .action-btn.disable {
      background: #fee2e2;
      color: #dc2626;
    }

    .action-btn.disable:hover {
      background: #dc2626;
      color: #ffffff;
    }

    /* Table Footer */
    .table-footer {
      margin-top: 16px;
      text-align: center;
    }

    .table-footer p {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        padding: 24px 16px;
      }

      .page-header-content {
        flex-direction: column;
        text-align: center;
      }

      .users-container {
        padding: 16px;
      }

      .filter-tabs {
        justify-content: center;
      }
    }
  `]
})
export class AdminUsersPage implements OnInit {
  loading = signal(true);
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  searchQuery = '';
  filter = 'all';

  constructor(private api: ApiService) {
    addIcons({ eyeOutline, checkmarkCircle, closeCircle, refreshOutline, peopleOutline, searchOutline });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.api.get<{ users: User[] }>('admin/users').subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.filterUsers();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getCounts() {
    const all = this.users();
    return {
      all: all.length,
      active: all.filter(u => u.isActive && u.isEnabled).length,
      disabled: all.filter(u => u.isActive && !u.isEnabled).length,
      pending: all.filter(u => !u.isActive).length
    };
  }

  setFilter(value: string): void {
    this.filter = value;
    this.filterUsers();
  }

  filterUsers(): void {
    let result = this.users();

    // Apply status filter
    if (this.filter === 'active') {
      result = result.filter(u => u.isActive && u.isEnabled);
    } else if (this.filter === 'disabled') {
      result = result.filter(u => u.isActive && !u.isEnabled);
    } else if (this.filter === 'pending') {
      result = result.filter(u => !u.isActive);
    }

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.email.toLowerCase().includes(query) ||
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.company.toLowerCase().includes(query)
      );
    }

    this.filteredUsers.set(result);
  }

  getInitials(user: User): string {
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  }

  enableUser(user: User): void {
    this.api.put(`admin/users/${user.id}/enable`).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }

  disableUser(user: User): void {
    const reason = prompt('Reason for disabling this account:');
    if (reason === null) return;

    this.api.put(`admin/users/${user.id}/disable`, { reason }).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }

  doRefresh(event: any): void {
    this.api.get<{ users: User[] }>('admin/users').subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.filterUsers();
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
