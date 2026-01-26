import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSpinner,
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
            <ion-card-title>Account Activation</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            @if (loading()) {
              <div class="loading-state">
                <ion-spinner name="crescent"></ion-spinner>
                <p>Activating your account...</p>
              </div>
            } @else if (success()) {
              <div class="success-message">
                <ion-icon name="checkmark-circle" color="success"></ion-icon>
                <h3>Account Activated!</h3>
                <p>Your account has been successfully activated. You can now sign in and access the rate portal.</p>
                <ion-button [routerLink]="['/login']">Sign In</ion-button>
              </div>
            } @else {
              <div class="error-state">
                <ion-icon name="close-circle" color="danger"></ion-icon>
                <h3>Activation Failed</h3>
                <p>{{ error() }}</p>
                <ion-button fill="outline" [routerLink]="['/login']">Go to Login</ion-button>
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

    .loading-state {
      text-align: center;
      padding: 48px 24px;
    }

    .loading-state ion-spinner {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .loading-state p {
      margin: 0;
      color: var(--ion-color-medium);
      font-size: 14px;
    }

    .success-message, .error-state {
      text-align: center;
      padding: 24px 0;
    }

    .success-message ion-icon, .error-state ion-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .success-message h3, .error-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--ion-color-dark);
      margin: 0 0 12px;
    }

    .success-message p, .error-state p {
      font-size: 14px;
      color: var(--ion-color-medium);
      margin: 0 0 24px;
      line-height: 1.6;
    }
  `]
})
export class ActivatePage implements OnInit {
  loading = signal(true);
  success = signal(false);
  error = signal<string>('Invalid or expired activation link.');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    addIcons({ checkmarkCircle, closeCircle });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.loading.set(false);
      return;
    }

    this.authService.activate(token).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error?.message || err.error?.message || 'Invalid or expired activation link.');
      }
    });
  }
}
