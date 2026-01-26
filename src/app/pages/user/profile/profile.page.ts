import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, businessOutline, callOutline, checkmarkCircle, shieldCheckmarkOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard" color="primary"></ion-back-button>
          <div class="header-logo">
            <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="header-logo-img">
          </div>
        </ion-buttons>
        <ion-title>
          <span class="header-title">My Profile</span>
        </ion-title>
        <ion-buttons slot="end">
          <div class="header-user-info" [routerLink]="['/dashboard']">
            <div class="header-user-avatar">
              <span class="header-avatar-initials">{{ initials() }}</span>
            </div>
            <div class="header-user-details">
              <span class="header-user-name">{{ fullName() }}</span>
              <span class="header-user-role">{{ user()?.company }}</span>
            </div>
          </div>
          <ion-button (click)="logout()" class="header-btn logout-btn">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="profile-container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar">
            <span class="avatar-initials">{{ initials() }}</span>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ user()?.firstName }} {{ user()?.lastName }}</h1>
            <p class="profile-email">{{ user()?.email }}</p>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <section class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Profile Information</h2>
            <p class="section-subtitle">Update your personal details</p>
          </div>

          <div class="form-card">
            @if (success()) {
              <div class="success-message">
                <ion-icon name="checkmark-circle"></ion-icon>
                <span>Profile updated successfully</span>
              </div>
            }

            @if (error()) {
              <div class="error-message">
                <ion-text color="danger">{{ error() }}</ion-text>
              </div>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <ion-item class="form-input" lines="none">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-input
                      type="text"
                      formControlName="firstName"
                      placeholder="Enter first name"
                    ></ion-input>
                  </ion-item>
                </div>

                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <ion-item class="form-input" lines="none">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-input
                      type="text"
                      formControlName="lastName"
                      placeholder="Enter last name"
                    ></ion-input>
                  </ion-item>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <ion-item class="form-input readonly" lines="none">
                  <ion-icon name="mail-outline" slot="start"></ion-icon>
                  <ion-input
                    type="email"
                    [value]="user()?.email"
                    readonly
                    placeholder="Email"
                  ></ion-input>
                </ion-item>
                <p class="form-hint">Email cannot be changed</p>
              </div>

              <div class="form-group">
                <label class="form-label">Company</label>
                <ion-item class="form-input" lines="none">
                  <ion-icon name="business-outline" slot="start"></ion-icon>
                  <ion-input
                    type="text"
                    formControlName="company"
                    placeholder="Enter company name"
                  ></ion-input>
                </ion-item>
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number <span class="optional">(optional)</span></label>
                <ion-item class="form-input" lines="none">
                  <ion-icon name="call-outline" slot="start"></ion-icon>
                  <ion-input
                    type="tel"
                    formControlName="phone"
                    placeholder="Enter phone number"
                  ></ion-input>
                </ion-item>
              </div>

              <div class="form-actions">
                <ion-button
                  expand="block"
                  type="submit"
                  [disabled]="form.invalid || form.pristine || loading()"
                  class="save-btn"
                >
                  @if (loading()) {
                    <ion-spinner name="crescent"></ion-spinner>
                  } @else {
                    Save Changes
                  }
                </ion-button>
              </div>
            </form>
          </div>
        </section>

        <!-- Account Info -->
        <section class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Account Details</h2>
            <p class="section-subtitle">Your account information and status</p>
          </div>

          <div class="info-card">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Member Since</span>
                <span class="info-value">{{ memberSince() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Last Login</span>
                <span class="info-value">{{ lastLogin() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Account Status</span>
                <span class="status-badge active">
                  <ion-icon name="shield-checkmark-outline"></ion-icon>
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>
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
      margin-left: 8px;
    }

    .header-logo-img {
      height: 28px;
      width: auto;
    }

    .header-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
    }

    .header-user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .header-user-info:hover {
      background: #f1f5f9;
    }

    .header-user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-avatar-initials {
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
    }

    .header-user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .header-user-name {
      font-size: 13px;
      font-weight: 600;
      color: #1e3a5f;
      line-height: 1.2;
    }

    .header-user-role {
      font-size: 10px;
      color: #64748b;
      line-height: 1.2;
    }

    .header-btn {
      --color: #1e3a5f;
    }

    .logout-btn {
      --color: #64748b;
    }

    .logout-btn:hover {
      --color: #ef4444;
    }

    /* Profile Container */
    .profile-container {
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* Profile Header */
    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 16px;
      margin-bottom: 32px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-initials {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 4px;
    }

    .profile-email {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    /* Sections */
    .profile-section {
      margin-bottom: 32px;
    }

    .section-header {
      margin-bottom: 16px;
    }

    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 4px;
    }

    .section-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    /* Form Card */
    .form-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #dcfce7;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
    }

    .success-message ion-icon {
      font-size: 20px;
      color: #16a34a;
    }

    .success-message span {
      color: #166534;
      font-weight: 500;
      font-size: 14px;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      text-align: center;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-label .optional {
      font-weight: 400;
      color: #94a3b8;
      text-transform: none;
    }

    .form-input {
      --background: #f8fafc;
      --border-radius: 8px;
      --padding-start: 12px;
      --padding-end: 12px;
      --min-height: 48px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      transition: border-color 0.2s ease;
    }

    .form-input:focus-within {
      border-color: #1e3a5f;
    }

    .form-input.readonly {
      --background: #f1f5f9;
      opacity: 0.7;
    }

    .form-input ion-icon[slot="start"] {
      color: #64748b;
      margin-inline-end: 12px;
    }

    .form-hint {
      font-size: 12px;
      color: #94a3b8;
      margin: 6px 0 0 4px;
    }

    .form-actions {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .save-btn {
      --background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      --border-radius: 8px;
      --box-shadow: none;
      font-weight: 600;
      height: 48px;
    }

    .save-btn:hover {
      --background: linear-gradient(135deg, #2d4a6f 0%, #1e3a5f 100%);
    }

    /* Info Card */
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
    }

    .info-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 15px;
      font-weight: 500;
      color: #1e3a5f;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      width: fit-content;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge ion-icon {
      font-size: 16px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .profile-container {
        padding: 20px 16px;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
        padding: 24px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .info-row {
        grid-template-columns: 1fr;
      }

      .header-logo {
        display: none;
      }

      .header-user-details {
        display: none;
      }

      .header-user-info {
        padding: 4px;
      }

      .header-user-avatar {
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class ProfilePage {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  user = computed(() => this.authService.user());

  initials = computed(() => {
    const user = this.user();
    if (!user) return '?';
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  });

  fullName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'User';
  });

  memberSince = computed(() => {
    const date = this.user()?.createdAt;
    return date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  });

  lastLogin = computed(() => {
    const date = this.user()?.lastLogin;
    return date ? new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService
  ) {
    addIcons({ personOutline, mailOutline, businessOutline, callOutline, checkmarkCircle, shieldCheckmarkOutline, logOutOutline });

    const user = this.authService.user();
    this.form = this.fb.group({
      firstName: [user?.firstName || '', [Validators.required]],
      lastName: [user?.lastName || '', [Validators.required]],
      company: [user?.company || '', [Validators.required]],
      phone: [user?.phone || '']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.api.put<{ user: User }>('user/profile', this.form.value).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.success.set(true);
        this.authService.updateStoredUser(response.user);
        this.form.markAsPristine();

        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error?.message || err.error?.message || 'Failed to update profile. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
