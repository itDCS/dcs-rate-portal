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
import { eyeOutline, checkmarkCircle, closeCircle, refreshOutline, peopleOutline, searchOutline, copyOutline, addOutline, closeOutline, mailOutline, sendOutline } from 'ionicons/icons';
import { ApiService } from '@core/services/api.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
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
          <ion-button (click)="openNewUserModal()" class="header-btn add-btn">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
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
                        <button class="action-btn clone" (click)="openCloneModal(user)" title="Clone user">
                          <ion-icon name="copy-outline"></ion-icon>
                        </button>
                        <button class="action-btn send-creds" (click)="openSendCredentialsModal(user)" title="Send credentials">
                          <ion-icon name="mail-outline"></ion-icon>
                        </button>
                        @if (!user.isActive) {
                          <button class="action-btn resend-activation" (click)="resendActivation(user)" title="Resend activation email">
                            <ion-icon name="send-outline"></ion-icon>
                          </button>
                        }
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

      <!-- Create/Clone User Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isCloning() ? 'Clone User' : 'New User' }}</h2>
              <button class="close-btn" (click)="closeModal()">
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name *</label>
                  <input type="text" [(ngModel)]="newUser.firstName" placeholder="First name" />
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input type="text" [(ngModel)]="newUser.lastName" placeholder="Last name" />
                </div>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" [(ngModel)]="newUser.email" placeholder="email@example.com" />
              </div>
              <div class="form-group">
                <label>Password *</label>
                <input type="password" [(ngModel)]="newUser.password" placeholder="Minimum 8 characters" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Company *</label>
                  <input type="text" [(ngModel)]="newUser.company" placeholder="Company name" />
                </div>
                <div class="form-group">
                  <label>Country *</label>
                  <input type="text" [(ngModel)]="newUser.country" placeholder="Country" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Phone</label>
                  <input type="text" [(ngModel)]="newUser.phone" placeholder="Phone number" />
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <select [(ngModel)]="newUser.role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" [(ngModel)]="newUser.skipActivation" />
                  Skip email activation (activate immediately)
                </label>
              </div>
              @if (modalError()) {
                <div class="error-message">{{ modalError() }}</div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button class="btn-create" (click)="createUser()" [disabled]="saving()">
                @if (saving()) {
                  <ion-spinner name="crescent"></ion-spinner>
                } @else {
                  {{ isCloning() ? 'Clone User' : 'Create User' }}
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Send Credentials Modal -->
      @if (showSendCredsModal()) {
        <div class="modal-overlay" (click)="closeSendCredsModal()">
          <div class="modal-content send-creds-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Send Credentials</h2>
              <button class="close-btn" (click)="closeSendCredsModal()">
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div class="modal-body">
              <p class="send-creds-info">
                Send login credentials to <strong>{{ sendCredsUser()?.email }}</strong>
              </p>
              <p class="send-creds-note">
                A new random password will be generated and sent to the user's email address.
              </p>
              @if (sendCredsError()) {
                <div class="error-message">{{ sendCredsError() }}</div>
              }
              @if (sendCredsSuccess()) {
                <div class="success-message">Credentials sent successfully!</div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeSendCredsModal()">Cancel</button>
              <button class="btn-create btn-send" (click)="sendCredentials()" [disabled]="sendingCreds()">
                @if (sendingCreds()) {
                  <ion-spinner name="crescent"></ion-spinner>
                } @else {
                  <ion-icon name="mail-outline"></ion-icon>
                  Send Credentials
                }
              </button>
            </div>
          </div>
        </div>
      }
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

    .action-btn.clone {
      background: #e0f2fe;
      color: #0284c7;
    }

    .action-btn.clone:hover {
      background: #0284c7;
      color: #ffffff;
    }

    .action-btn.send-creds {
      background: #fef3c7;
      color: #d97706;
    }

    .action-btn.send-creds:hover {
      background: #d97706;
      color: #ffffff;
    }

    .action-btn.resend-activation {
      background: #dbeafe;
      color: #2563eb;
    }

    .action-btn.resend-activation:hover {
      background: #2563eb;
      color: #ffffff;
    }

    .add-btn {
      --color: #16a34a;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #e2e8f0;
    }

    .close-btn ion-icon {
      font-size: 20px;
      color: #64748b;
    }

    .modal-body {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #1e3a5f;
      background: #ffffff;
      transition: border-color 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #1e3a5f;
    }

    .form-group input::placeholder {
      color: #94a3b8;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 8px;
    }

    .success-message {
      background: #dcfce7;
      color: #166534;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 8px;
    }

    .send-creds-info {
      font-size: 14px;
      color: #475569;
      margin: 0 0 20px;
    }

    .send-creds-info strong {
      color: #1e3a5f;
    }

    .send-creds-note {
      font-size: 12px;
      color: #94a3b8;
      margin: 8px 0 0;
      font-style: italic;
    }

    .btn-send {
      background: #d97706 !important;
    }

    .btn-send:hover:not(:disabled) {
      background: #b45309 !important;
    }

    .btn-send ion-icon {
      font-size: 18px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 0 0 16px 16px;
    }

    .btn-cancel, .btn-create {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #64748b;
    }

    .btn-cancel:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-create {
      background: #1e3a5f;
      border: none;
      color: #ffffff;
      min-width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-create:hover:not(:disabled) {
      background: #2d4a6f;
    }

    .btn-create:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-create ion-spinner {
      width: 18px;
      height: 18px;
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

  // Modal state
  showModal = signal(false);
  isCloning = signal(false);
  saving = signal(false);
  modalError = signal('');

  // Send credentials modal state
  showSendCredsModal = signal(false);
  sendCredsUser = signal<User | null>(null);
  sendingCreds = signal(false);
  sendCredsError = signal('');
  sendCredsSuccess = signal(false);

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    country: '',
    phone: '',
    role: 'user',
    skipActivation: true
  };

  constructor(
    private api: ApiService,
    private confirmDialog: ConfirmDialogService
  ) {
    addIcons({ eyeOutline, checkmarkCircle, closeCircle, refreshOutline, peopleOutline, searchOutline, copyOutline, addOutline, closeOutline, mailOutline, sendOutline });
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

  openNewUserModal(): void {
    this.isCloning.set(false);
    this.resetForm();
    this.showModal.set(true);
  }

  openCloneModal(user: User): void {
    this.isCloning.set(true);
    this.newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: '', // Must be unique
      password: '',
      company: user.company,
      country: user.country,
      phone: user.phone || '',
      role: user.role || 'user',
      skipActivation: true
    };
    this.modalError.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.modalError.set('');
  }

  resetForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      company: '',
      country: '',
      phone: '',
      role: 'user',
      skipActivation: true
    };
    this.modalError.set('');
  }

  createUser(): void {
    // Validation
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email ||
        !this.newUser.password || !this.newUser.company || !this.newUser.country) {
      this.modalError.set('Please fill in all required fields');
      return;
    }

    if (this.newUser.password.length < 8) {
      this.modalError.set('Password must be at least 8 characters');
      return;
    }

    this.saving.set(true);
    this.modalError.set('');

    this.api.post<{ user: User }>('admin/users', this.newUser).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.saving.set(false);
        this.modalError.set(err.error?.error?.message || 'Failed to create user');
      }
    });
  }

  openSendCredentialsModal(user: User): void {
    this.sendCredsUser.set(user);
    this.sendCredsError.set('');
    this.sendCredsSuccess.set(false);
    this.showSendCredsModal.set(true);
  }

  closeSendCredsModal(): void {
    this.showSendCredsModal.set(false);
    this.sendCredsUser.set(null);
    this.sendCredsError.set('');
    this.sendCredsSuccess.set(false);
  }

  sendCredentials(): void {
    const user = this.sendCredsUser();
    if (!user) return;

    this.sendingCreds.set(true);
    this.sendCredsError.set('');
    this.sendCredsSuccess.set(false);

    this.api.post(`admin/users/${user.id}/send-credentials`, {}).subscribe({
      next: () => {
        this.sendingCreds.set(false);
        this.sendCredsSuccess.set(true);
        // Close modal after a brief delay to show success
        setTimeout(() => {
          this.closeSendCredsModal();
        }, 1500);
      },
      error: (err) => {
        this.sendingCreds.set(false);
        this.sendCredsError.set(err.error?.error?.message || 'Failed to send credentials');
      }
    });
  }

  async resendActivation(user: User): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Resend Activation Email',
      message: `Send a new activation email to <strong>${user.email}</strong>?<br><br>The previous activation link will be invalidated.`,
      confirmText: 'Send Email',
      cancelText: 'Cancel',
      type: 'info',
      icon: 'send-outline'
    });

    if (confirmed) {
      this.confirmDialog.setLoading(true);
      this.api.post(`admin/users/${user.id}/resend-activation`, {}).subscribe({
        next: async () => {
          this.confirmDialog.setLoading(false);
          await this.confirmDialog.confirm({
            title: 'Email Sent',
            message: `Activation email has been sent to <strong>${user.email}</strong>`,
            confirmText: 'OK',
            cancelText: 'Close',
            type: 'success'
          });
        },
        error: async (err) => {
          this.confirmDialog.setLoading(false);
          await this.confirmDialog.confirm({
            title: 'Error',
            message: err.error?.error?.message || 'Failed to resend activation email',
            confirmText: 'OK',
            cancelText: 'Close',
            type: 'danger'
          });
        }
      });
    }
  }
}
