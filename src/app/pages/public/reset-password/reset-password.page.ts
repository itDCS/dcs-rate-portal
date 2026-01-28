import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircle } from 'ionicons/icons';
import { RecaptchaModule } from 'ng-recaptcha';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
            <ion-card-title>Set New Password</ion-card-title>
            <ion-card-subtitle>Create a new secure password</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            @if (success()) {
              <div class="success-message">
                <ion-icon name="checkmark-circle" color="success"></ion-icon>
                <h3>Password Reset Complete</h3>
                <p>Your password has been successfully changed. You can now sign in with your new password.</p>
                <ion-button [routerLink]="['/login']">Sign In</ion-button>
              </div>
            } @else if (!token) {
              <div class="error-state">
                <ion-text color="danger">
                  <h3>Invalid Link</h3>
                  <p>This password reset link is invalid or has expired.</p>
                </ion-text>
                <ion-button fill="outline" [routerLink]="['/forgot-password']">Request New Link</ion-button>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                @if (error()) {
                  <div class="error-message">
                    <ion-text color="danger">{{ error() }}</ion-text>
                  </div>
                }

                <ion-item class="item-input" lines="none">
                  <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                  <ion-input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="New password (min 8 characters)"
                  ></ion-input>
                  <ion-icon
                    [name]="showPassword() ? 'eye-off-outline' : 'eye-outline'"
                    slot="end"
                    class="toggle-password"
                    (click)="togglePassword()"
                  ></ion-icon>
                </ion-item>
                @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
                  <ion-text color="danger" class="field-error">Password must be at least 8 characters</ion-text>
                }

                <ion-item class="item-input" lines="none">
                  <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                  <ion-input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    placeholder="Confirm new password"
                  ></ion-input>
                </ion-item>
                @if (form.get('confirmPassword')?.touched && form.errors?.['mismatch']) {
                  <ion-text color="danger" class="field-error">Passwords do not match</ion-text>
                }

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
                    Reset Password
                  }
                </ion-button>
              </form>
            }
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

    .error-message, .error-state {
      background: rgba(197, 48, 48, 0.1);
      border-radius: var(--border-radius-md);
      padding: 12px 16px;
      margin-bottom: 16px;
      text-align: center;
    }

    .error-state {
      padding: 24px;
    }

    .error-state h3 {
      margin: 0 0 8px;
      font-size: 18px;
    }

    .error-state p {
      margin: 0 0 16px;
      font-size: 14px;
    }

    .success-message {
      text-align: center;
      padding: 24px 0;
    }

    .success-message ion-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .success-message h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--ion-color-dark);
      margin: 0 0 12px;
    }

    .success-message p {
      font-size: 14px;
      color: var(--ion-color-medium);
      margin: 0 0 24px;
      line-height: 1.6;
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

    ion-item ion-icon[slot="start"] {
      margin-inline-end: 12px;
      color: var(--ion-color-medium);
    }

    .recaptcha-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    @media (max-width: 480px) {
      .recaptcha-container {
        transform: scale(0.85);
        transform-origin: center;
        margin-bottom: 16px;
      }
    }

    @media (max-width: 360px) {
      .recaptcha-container {
        transform: scale(0.77);
      }
    }
  `]
})
export class ResetPasswordPage implements OnInit {
  form: FormGroup;
  token: string | null = null;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showPassword = signal(false);
  captchaToken = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    addIcons({ lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircle });

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
    if (this.form.invalid || !this.token || !this.captchaToken()) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.resetPassword(this.token, this.form.value.password, this.captchaToken()!).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.captchaToken.set(null); // Reset captcha after error
        this.error.set(err.error?.error?.message || err.error?.message || 'Failed to reset password. The link may have expired.');
      }
    });
  }
}
