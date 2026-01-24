import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon
  ],
  template: `
    <ion-content>
      <div class="auth-container">
        <ion-card class="auth-card">
          <ion-card-header>
            <div class="logo-container">
              <span class="logo-dcs">DCS</span>
              <span class="logo-divider"></span>
              <span class="logo-text">Rate Portal</span>
            </div>
            <ion-card-title>Welcome Back</ion-card-title>
            <ion-card-subtitle>Sign in to access your rate portal</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              @if (error()) {
                <div class="error-message">
                  <ion-text color="danger">{{ error() }}</ion-text>
                </div>
              }

              <ion-item class="item-input" lines="none">
                <ion-icon name="mail-outline" slot="start"></ion-icon>
                <ion-input
                  type="email"
                  formControlName="email"
                  placeholder="Email address"
                  autocomplete="email"
                ></ion-input>
              </ion-item>
              @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
                <ion-text color="danger" class="field-error">Email is required</ion-text>
              }
              @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                <ion-text color="danger" class="field-error">Invalid email format</ion-text>
              }

              <ion-item class="item-input" lines="none">
                <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                <ion-input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Password"
                  autocomplete="current-password"
                ></ion-input>
                <ion-icon
                  [name]="showPassword() ? 'eye-off-outline' : 'eye-outline'"
                  slot="end"
                  class="toggle-password"
                  (click)="togglePassword()"
                ></ion-icon>
              </ion-item>
              @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
                <ion-text color="danger" class="field-error">Password is required</ion-text>
              }

              <div class="forgot-link">
                <a [routerLink]="['/forgot-password']">Forgot your password?</a>
              </div>

              <ion-button
                expand="block"
                type="submit"
                [disabled]="form.invalid || loading()"
                class="button-large"
              >
                @if (loading()) {
                  <ion-spinner name="crescent"></ion-spinner>
                } @else {
                  Sign In
                }
              </ion-button>
            </form>

            <div class="auth-footer">
              <p>Don't have an account? <a [routerLink]="['/register']">Register now</a></p>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo-dcs {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: 2px;
    }

    .logo-divider {
      width: 2px;
      height: 28px;
      background: linear-gradient(180deg, transparent, #b8860b, transparent);
    }

    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .error-message {
      background: rgba(197, 48, 48, 0.1);
      border-radius: var(--border-radius-md);
      padding: 12px 16px;
      margin-bottom: 16px;
      text-align: center;
    }

    .field-error {
      display: block;
      font-size: 12px;
      margin: -8px 0 12px 16px;
    }

    .toggle-password {
      cursor: pointer;
      color: var(--ion-color-medium);
    }

    .forgot-link {
      text-align: right;
      margin: -4px 0 20px;
    }

    .forgot-link a {
      color: var(--ion-color-primary);
      font-size: 14px;
      text-decoration: none;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .auth-footer p {
      margin: 0;
      color: var(--ion-color-medium);
      font-size: 14px;
    }

    .auth-footer a {
      color: var(--ion-color-primary);
      font-weight: 600;
      text-decoration: none;
    }

    ion-item ion-icon[slot="start"] {
      margin-inline-end: 12px;
      color: var(--ion-color-medium);
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .logo-container {
        gap: 8px;
        margin-bottom: 16px;
      }

      .logo-dcs {
        font-size: 24px;
        letter-spacing: 1px;
      }

      .logo-divider {
        height: 20px;
      }

      .logo-text {
        font-size: 10px;
        letter-spacing: 2px;
      }

      .error-message {
        padding: 8px 12px;
        font-size: 13px;
        margin-bottom: 12px;
      }

      .field-error {
        margin: -6px 0 10px 12px;
        font-size: 11px;
      }

      .forgot-link {
        margin: -2px 0 14px;
      }

      .forgot-link a {
        font-size: 13px;
      }

      .auth-footer {
        margin-top: 16px;
        padding-top: 16px;
      }

      .auth-footer p {
        font-size: 13px;
      }

      ion-item ion-icon[slot="start"] {
        margin-inline-end: 8px;
        font-size: 18px;
      }
    }

    @media (max-width: 360px) {
      .logo-container {
        margin-bottom: 12px;
      }

      .logo-dcs {
        font-size: 22px;
      }

      .logo-divider {
        height: 16px;
      }

      .logo-text {
        font-size: 9px;
        letter-spacing: 1.5px;
      }

      .auth-footer {
        margin-top: 12px;
        padding-top: 12px;
      }
    }
  `]
})
export class LoginPage {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.user.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
