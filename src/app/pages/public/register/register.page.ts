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
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  personOutline,
  businessOutline,
  globeOutline,
  callOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircle
} from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';
import { COUNTRIES } from '@core/data/countries';

@Component({
  selector: 'app-register',
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
    IonIcon,
    IonSelect,
    IonSelectOption
  ],
  template: `
    <ion-content>
      <div class="auth-container">
        <ion-card class="auth-card">
          <ion-card-header>
            <div class="logo-container">
              <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="logo-img">
            </div>
            <ion-card-title>Create Account</ion-card-title>
            <ion-card-subtitle>Register to access our shipping tariffs</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            @if (success()) {
              <div class="success-message">
                <ion-icon name="checkmark-circle" color="success"></ion-icon>
                <h3>Registration Successful!</h3>
                <p>We've sent an activation link to your email address. Please check your inbox and click the link to activate your account.</p>
                <ion-button fill="outline" [routerLink]="['/login']">Go to Login</ion-button>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                @if (error()) {
                  <div class="error-message">
                    <ion-text color="danger">{{ error() }}</ion-text>
                  </div>
                }

                <div class="form-row">
                  <ion-item class="item-input" lines="none">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-input
                      type="text"
                      formControlName="firstName"
                      placeholder="First name"
                    ></ion-input>
                  </ion-item>

                  <ion-item class="item-input" lines="none">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-input
                      type="text"
                      formControlName="lastName"
                      placeholder="Last name"
                    ></ion-input>
                  </ion-item>
                </div>

                <ion-item class="item-input" lines="none">
                  <ion-icon name="mail-outline" slot="start"></ion-icon>
                  <ion-input
                    type="email"
                    formControlName="email"
                    placeholder="Email address"
                  ></ion-input>
                </ion-item>
                @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                  <ion-text color="danger" class="field-error">Invalid email format</ion-text>
                }

                <ion-item class="item-input" lines="none">
                  <ion-icon name="business-outline" slot="start"></ion-icon>
                  <ion-input
                    type="text"
                    formControlName="company"
                    placeholder="Company name"
                  ></ion-input>
                </ion-item>

                <ion-item class="item-input" lines="none">
                  <ion-icon name="globe-outline" slot="start"></ion-icon>
                  <ion-select formControlName="country" placeholder="Select country" interface="popover">
                    @for (country of countries; track country.code) {
                      <ion-select-option [value]="country.code">{{ country.name }}</ion-select-option>
                    }
                  </ion-select>
                </ion-item>

                <ion-item class="item-input" lines="none">
                  <ion-icon name="call-outline" slot="start"></ion-icon>
                  <ion-input
                    type="tel"
                    formControlName="phone"
                    placeholder="Phone number (optional)"
                  ></ion-input>
                </ion-item>

                <ion-item class="item-input" lines="none">
                  <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                  <ion-input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Password (min 8 characters)"
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
                    placeholder="Confirm password"
                  ></ion-input>
                </ion-item>
                @if (form.get('confirmPassword')?.touched && form.errors?.['mismatch']) {
                  <ion-text color="danger" class="field-error">Passwords do not match</ion-text>
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
                    Create Account
                  }
                </ion-button>
              </form>

              <div class="auth-footer">
                <p>Already have an account? <a [routerLink]="['/login']">Sign in</a></p>
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

    .form-row {
      display: flex;
      gap: 12px;
    }

    .form-row ion-item {
      flex: 1;
    }

    .toggle-password {
      cursor: pointer;
      color: var(--ion-color-medium);
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

    @media (max-width: 480px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

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

      .success-message {
        padding: 12px 0;
      }

      .success-message ion-icon {
        font-size: 44px;
        margin-bottom: 10px;
      }

      .success-message h3 {
        font-size: 17px;
        margin-bottom: 8px;
      }

      .success-message p {
        font-size: 13px;
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
export class RegisterPage {
  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showPassword = signal(false);
  countries = COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personOutline,
      businessOutline,
      globeOutline,
      callOutline,
      eyeOutline,
      eyeOffOutline,
      checkmarkCircle
    });

    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required]],
      country: ['', [Validators.required]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { confirmPassword, ...data } = this.form.value;

    this.authService.register(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error?.message || err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
