import { Component, signal, ViewChild } from '@angular/core';
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
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from '@core/services/auth.service';
import { MaintenanceService } from '@core/services/maintenance.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RecaptchaModule,
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
              <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="logo-img">
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

              <div class="recaptcha-container">
                <re-captcha
                  (resolved)="onCaptchaResolved($event)"
                  (errored)="onCaptchaError()"
                ></re-captcha>
              </div>

              <ion-button
                expand="block"
                type="submit"
                [disabled]="form.invalid || loading() || !captchaToken()"
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
      margin-bottom: 24px;
    }

    .logo-img {
      max-width: 200px;
      height: auto;
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

    .recaptcha-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
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

      .recaptcha-container {
        transform: scale(0.85);
        transform-origin: center;
        margin-bottom: 16px;
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

      .recaptcha-container {
        transform: scale(0.77);
      }

      .auth-footer {
        margin-top: 12px;
        padding-top: 12px;
      }
    }
  `]
})
export class LoginPage {
  @ViewChild(RecaptchaComponent) captchaRef!: RecaptchaComponent;

  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  captchaToken = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private maintenanceService: MaintenanceService,
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

  onCaptchaResolved(token: string | null): void {
    this.captchaToken.set(token);
  }

  onCaptchaError(): void {
    this.captchaToken.set(null);
    this.error.set('CAPTCHA error. Please refresh and try again.');
  }

  onSubmit(): void {
    if (this.form.invalid || !this.captchaToken()) return;

    const submitStart = performance.now();
    console.log('========================================');
    console.log('[LoginPage] SUBMIT START');
    console.log('[LoginPage] Email:', this.form.value.email);
    console.log('[LoginPage] Time:', new Date().toISOString());
    console.log('========================================');

    this.loading.set(true);
    this.error.set(null);

    const loginData = { ...this.form.value, captchaToken: this.captchaToken() };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        const authTime = performance.now() - submitStart;
        console.log(`[LoginPage] Auth completed: ${authTime.toFixed(2)}ms`);

        this.loading.set(false);

        const navStart = performance.now();
        const targetRoute = response.user.isAdmin ? '/admin' : '/dashboard';
        console.log(`[LoginPage] Navigating to: ${targetRoute}`);

        this.router.navigate([targetRoute]).then(() => {
          const totalTime = performance.now() - submitStart;
          console.log('========================================');
          console.log('[LoginPage] SUBMIT SUCCESS');
          console.log(`[LoginPage] Navigation time: ${(performance.now() - navStart).toFixed(2)}ms`);
          console.log(`[LoginPage] Total time: ${totalTime.toFixed(2)}ms`);
          console.log('========================================');
        });
      },
      error: (err) => {
        const totalTime = performance.now() - submitStart;
        console.log('========================================');
        console.log('[LoginPage] SUBMIT ERROR');
        console.log('[LoginPage] Status:', err.status);
        console.log('[LoginPage] Error code:', err.error?.error?.code);
        console.log('[LoginPage] Error message:', err.error?.error?.message || err.message);
        console.log(`[LoginPage] Total time: ${totalTime.toFixed(2)}ms`);
        console.log('========================================');

        this.loading.set(false);
        this.captchaToken.set(null);
        this.captchaRef?.reset(); // Reset captcha widget after error

        // Handle maintenance mode (503)
        if (err.status === 503 && err.error?.error?.code === 'MAINTENANCE_MODE') {
          if (err.error?.maintenance) {
            this.maintenanceService.setStatus(err.error.maintenance);
          }
          this.router.navigate(['/maintenance']);
          return;
        }

        this.error.set(err.error?.error?.message || err.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
