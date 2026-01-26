import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { mailOutline, arrowBackOutline, checkmarkCircle } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
            <ion-card-title>Reset Password</ion-card-title>
            <ion-card-subtitle>Enter your email to receive a reset link</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            @if (success()) {
              <div class="success-message">
                <ion-icon name="checkmark-circle" color="success"></ion-icon>
                <h3>Check Your Email</h3>
                <p>If an account exists with that email, we've sent password reset instructions.</p>
                <ion-button fill="outline" [routerLink]="['/login']">
                  <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
                  Back to Login
                </ion-button>
              </div>
            } @else {
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

                <ion-button
                  expand="block"
                  type="submit"
                  [disabled]="form.invalid || loading()"
                  class="button-large"
                >
                  @if (loading()) {
                    <ion-spinner name="crescent"></ion-spinner>
                  } @else {
                    Send Reset Link
                  }
                </ion-button>
              </form>

              <div class="auth-footer">
                <p><a [routerLink]="['/login']"><ion-icon name="arrow-back-outline"></ion-icon> Back to Login</a></p>
              </div>
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

    .error-message {
      background: rgba(197, 48, 48, 0.1);
      border-radius: var(--border-radius-md);
      padding: 12px 16px;
      margin-bottom: 16px;
      text-align: center;
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

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .auth-footer p {
      margin: 0;
    }

    .auth-footer a {
      color: var(--ion-color-primary);
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    ion-item ion-icon[slot="start"] {
      margin-inline-end: 12px;
      color: var(--ion-color-medium);
    }
  `]
})
export class ForgotPasswordPage {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    addIcons({ mailOutline, arrowBackOutline, checkmarkCircle });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error?.message || err.error?.message || 'Failed to send reset email. Please try again.');
      }
    });
  }
}
