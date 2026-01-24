import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  personOutline,
  logOutOutline,
  shieldCheckmarkOutline,
  timeOutline,
  globeOutline,
  callOutline
} from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenuButton
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <div class="header-logo">
            <span class="logo-dcs">DCS</span>
            <span class="logo-divider"></span>
            <span class="logo-text">Rate Portal</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button [routerLink]="['/profile']" class="header-btn">
            <ion-icon slot="icon-only" name="person-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="logout()" class="header-btn">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-content">
          <p class="welcome-label">Welcome back</p>
          <h1 class="welcome-name">{{ firstName() }}</h1>
          <p class="welcome-subtitle">Access your shipping tariffs and manage your account</p>
        </div>
        <div class="welcome-decoration"></div>
      </section>

      <div class="dashboard-content">
        <!-- Quick Actions -->
        <section class="quick-actions">
          <div class="action-card primary" [routerLink]="['/tariff']">
            <div class="action-icon-wrapper">
              <ion-icon name="document-text-outline"></ion-icon>
            </div>
            <div class="action-info">
              <h2>View Tariff</h2>
              <p>Access our complete FMC-compliant shipping tariff</p>
            </div>
            <div class="action-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        <!-- Info Section -->
        <section class="info-section">
          <h3 class="section-title">About Our Services</h3>

          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
              </div>
              <h4>FMC Compliant</h4>
              <p>All tariffs are filed with the Federal Maritime Commission in accordance with 46 CFR Part 520</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <ion-icon name="globe-outline"></ion-icon>
              </div>
              <h4>Global Coverage</h4>
              <p>Import and export services between all U.S. ports and worldwide destinations</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <ion-icon name="time-outline"></ion-icon>
              </div>
              <h4>Current Rates</h4>
              <p>Tariff rates are kept current. Gate-In Date determines the applicable rate</p>
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section class="contact-section">
          <div class="contact-content">
            <div class="contact-info">
              <h3>Need Assistance?</h3>
              <p>Our team is ready to help with rate inquiries and shipment coordination</p>
            </div>
            <a href="mailto:operations@dcsusa.com" class="contact-btn">
              <ion-icon name="call-outline"></ion-icon>
              Contact Operations
            </a>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="dashboard-footer">
        <p>Del Corona & Scardigli U.S.A. Inc. | FMC License No. 024818</p>
      </footer>
    </ion-content>
  `,
  styles: [`
    /* Premium Header */
    .premium-header ion-toolbar {
      --background: #ffffff;
      --border-color: #e2e8f0;
      --border-width: 0 0 1px 0;
      --padding-start: 16px;
      --padding-end: 16px;
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

    /* Welcome Section */
    .welcome-section {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #1e3a5f 100%);
      padding: 48px 24px;
      position: relative;
      overflow: hidden;
    }

    .welcome-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
    }

    .welcome-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 8px;
    }

    .welcome-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 36px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px;
    }

    .welcome-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    .welcome-decoration {
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(184, 134, 11, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    /* Dashboard Content */
    .dashboard-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* Quick Actions */
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 48px;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(30, 58, 95, 0.12);
      border-color: #1e3a5f;
    }

    .action-card.primary .action-icon-wrapper {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      color: #ffffff;
    }

    .action-card.secondary .action-icon-wrapper {
      background: linear-gradient(135deg, #b8860b 0%, #d4a017 100%);
      color: #ffffff;
    }

    .action-icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-icon-wrapper ion-icon {
      font-size: 28px;
    }

    .action-info {
      flex: 1;
    }

    .action-info h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 6px;
    }

    .action-info p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    .action-arrow {
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .action-card:hover .action-arrow {
      transform: translateX(4px);
      color: #1e3a5f;
    }

    /* Info Section */
    .info-section {
      margin-bottom: 48px;
    }

    .section-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f1f5f9;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }

    .info-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .info-icon ion-icon {
      font-size: 24px;
      color: #ffffff;
    }

    .info-card h4 {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 8px;
    }

    .info-card p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    /* Contact Section */
    .contact-section {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      padding: 32px;
      border: 1px solid #e2e8f0;
    }

    .contact-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .contact-info h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 8px;
    }

    .contact-info p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .contact-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e3a5f;
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .contact-btn:hover {
      background: #2d4a6f;
      transform: translateY(-1px);
    }

    .contact-btn ion-icon {
      font-size: 18px;
    }

    /* Footer */
    .dashboard-footer {
      text-align: center;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
      margin-top: 24px;
    }

    .dashboard-footer p {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .welcome-section {
        padding: 32px 20px;
      }

      .welcome-name {
        font-size: 28px;
      }

      .dashboard-content {
        padding: 24px 16px;
      }

      .action-card {
        padding: 20px;
      }

      .action-icon-wrapper {
        width: 56px;
        height: 56px;
      }

      .contact-content {
        flex-direction: column;
        text-align: center;
      }

      .contact-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardPage {
  firstName = computed(() => this.authService.user()?.firstName || 'User');

  constructor(private authService: AuthService) {
    addIcons({
      documentTextOutline,
      personOutline,
      logOutOutline,
      shieldCheckmarkOutline,
      timeOutline,
      globeOutline,
      callOutline
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
