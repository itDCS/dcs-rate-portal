import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, mailOutline, arrowBackOutline } from 'ionicons/icons';
import { MaintenanceService } from '../../../core/services/maintenance.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterLink],
  template: `
    <ion-content [scrollEvents]="false">
      <div class="maintenance-page">
        <!-- Background Effects -->
        <div class="bg-effects">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="grid-pattern"></div>
        </div>

        <!-- Main Content -->
        <div class="maintenance-container">
          <!-- Logo -->
          <div class="logo-section">
            <div class="logo">
              <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="logo-img">
            </div>
          </div>

          <!-- Icon -->
          <div class="icon-container">
            <div class="icon-ring">
              <div class="icon-inner">
                <ion-icon name="settings-outline" class="gear-icon"></ion-icon>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="content-section">
            <h1>Scheduled Maintenance</h1>
            <div class="divider"></div>
            <p class="main-message">
              We're currently performing system upgrades to enhance your experience.
            </p>
            @if (message()) {
              <p class="custom-message">{{ message() }}</p>
            }
            @if (formattedEndTime()) {
              <div class="estimated-time">
                <span class="label">Estimated completion</span>
                <span class="time">{{ formattedEndTime() }}</span>
              </div>
            }
          </div>

          <!-- Action -->
          <div class="action-section">
            <ion-button fill="outline" color="light" [routerLink]="['/login']">
              <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
              Return to Login
            </ion-button>
          </div>

          <!-- Contact -->
          <div class="contact-section">
            <div class="contact-divider"></div>
            <p class="contact-label">For urgent inquiries</p>
            <a href="mailto:operations@dcsusa.com" class="contact-email">
              <ion-icon name="mail-outline"></ion-icon>
              operations&#64;dcsusa.com
            </a>
          </div>

          <!-- Footer -->
          <footer class="footer">
            <p>&copy; {{ currentYear }} Del Corona & Scardigli. FMC Licensed NVOCC.</p>
          </footer>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .maintenance-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #152a45 50%, #0d1f33 100%);
      position: relative;
      overflow: hidden;
    }

    /* Background Effects */
    .bg-effects {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, #b8860b 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation: float 20s ease-in-out infinite;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation: float 15s ease-in-out infinite reverse;
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, 30px); }
    }

    /* Container */
    .maintenance-container {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 48px 24px;
      max-width: 560px;
      width: 100%;
    }

    /* Logo */
    .logo-section {
      margin-bottom: 48px;
    }

    .logo {
      display: inline-flex;
      align-items: center;
    }

    .logo-img {
      max-width: 200px;
      height: auto;
      filter: brightness(0) invert(1);
    }

    /* Icon */
    .icon-container {
      margin-bottom: 40px;
    }

    .icon-ring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(184, 134, 11, 0.2) 0%, rgba(184, 134, 11, 0.05) 100%);
      border: 1px solid rgba(184, 134, 11, 0.3);
      animation: pulse 3s ease-in-out infinite;
    }

    .icon-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(184, 134, 11, 0.3) 0%, rgba(184, 134, 11, 0.1) 100%);
    }

    .gear-icon {
      font-size: 40px;
      color: #b8860b;
      animation: rotate 8s linear infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Content */
    .content-section {
      margin-bottom: 40px;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 16px 0;
      letter-spacing: 0.5px;
    }

    .divider {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #b8860b, transparent);
      margin: 0 auto 24px auto;
    }

    .main-message {
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 16px 0;
    }

    .custom-message {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 24px 0;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border-left: 3px solid #b8860b;
    }

    .estimated-time {
      display: inline-flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 32px;
      background: rgba(184, 134, 11, 0.1);
      border: 1px solid rgba(184, 134, 11, 0.2);
      border-radius: 12px;
    }

    .estimated-time .label {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
    }

    .estimated-time .time {
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #b8860b;
    }

    /* Action */
    .action-section {
      margin-bottom: 48px;
    }

    .action-section ion-button {
      --border-radius: 8px;
      --padding-start: 24px;
      --padding-end: 24px;
      --border-color: rgba(255, 255, 255, 0.3);
      --color: rgba(255, 255, 255, 0.9);
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .action-section ion-button:hover {
      --border-color: #b8860b;
      --color: #b8860b;
    }

    /* Contact */
    .contact-section {
      margin-bottom: 32px;
    }

    .contact-divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      margin-bottom: 24px;
    }

    .contact-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .contact-email {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      color: #b8860b;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .contact-email:hover {
      color: #d4a00a;
      transform: translateY(-1px);
    }

    .contact-email ion-icon {
      font-size: 18px;
    }

    /* Footer */
    .footer {
      padding-top: 16px;
    }

    .footer p {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .maintenance-container {
        padding: 32px 16px;
      }

      .logo-dcs {
        font-size: 28px;
      }

      h1 {
        font-size: 28px;
      }

      .main-message {
        font-size: 16px;
      }

      .icon-ring {
        width: 100px;
        height: 100px;
      }

      .icon-inner {
        width: 68px;
        height: 68px;
      }

      .gear-icon {
        font-size: 32px;
      }
    }
  `]
})
export class MaintenancePage implements OnInit {
  currentYear = new Date().getFullYear();

  message = computed(() => this.maintenanceService.message());
  estimatedEnd = computed(() => this.maintenanceService.estimatedEnd());

  formattedEndTime = computed(() => {
    const end = this.estimatedEnd();
    if (!end) return null;
    try {
      const date = new Date(end);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return end;
    }
  });

  constructor(private maintenanceService: MaintenanceService) {
    addIcons({ settingsOutline, mailOutline, arrowBackOutline });
  }

  ngOnInit(): void {
    this.maintenanceService.checkStatus().subscribe();
  }
}
