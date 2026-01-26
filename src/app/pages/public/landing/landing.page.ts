import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
  flashOutline,
  boatOutline,
  globeOutline,
  arrowForward
} from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    RouterLink
  ],
  template: `
    <ion-content [scrollEvents]="true">
      <div class="landing-page">
        <!-- Navigation -->
        <nav class="navbar">
          <div class="nav-container">
            <div class="nav-logo">
              <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="logo-img">
            </div>
            <div class="nav-actions">
              <a [routerLink]="['/login']" class="nav-link">Sign In</a>
              <ion-button fill="solid" size="small" [routerLink]="['/register']">
                Get Started
              </ion-button>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-bg">
            <div class="hero-pattern"></div>
          </div>
          <div class="hero-content">
            <span class="hero-badge">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              FMC Compliant
            </span>
            <h1>Shipping Tariffs<br/><em>Made Simple</em></h1>
            <p class="hero-subtitle">
              Access Del Corona & Scardigli's complete tariff database instantly.
              Free registration with immediate access for shipping professionals.
            </p>
            <div class="hero-actions">
              <ion-button size="large" [routerLink]="['/register']">
                Create Free Account
                <ion-icon name="arrow-forward" slot="end"></ion-icon>
              </ion-button>
              <ion-button size="large" fill="outline" color="light" [routerLink]="['/login']">
                Sign In
              </ion-button>
            </div>
            <div class="hero-trust">
              <span>Trusted by shipping professionals worldwide</span>
            </div>
          </div>
          <div class="hero-decoration">
            <ion-icon name="boat-outline"></ion-icon>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features">
          <div class="section-header">
            <span class="section-label">Why Choose Us</span>
            <h2>Everything you need to<br/>access our tariffs</h2>
          </div>

          <ion-grid class="features-grid">
            <ion-row>
              <ion-col size="12" sizeMd="6" sizeLg="4">
                <div class="feature-card">
                  <div class="feature-icon">
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                  </div>
                  <h3>Free Access</h3>
                  <p>No hidden fees. Register once and access our complete tariff database at no cost.</p>
                </div>
              </ion-col>
              <ion-col size="12" sizeMd="6" sizeLg="4">
                <div class="feature-card">
                  <div class="feature-icon">
                    <ion-icon name="flash-outline"></ion-icon>
                  </div>
                  <h3>Instant Activation</h3>
                  <p>Quick email verification. Start accessing rates within minutes of registration.</p>
                </div>
              </ion-col>
              <ion-col size="12" sizeMd="6" sizeLg="4">
                <div class="feature-card">
                  <div class="feature-icon">
                    <ion-icon name="globe-outline"></ion-icon>
                  </div>
                  <h3>Always Updated</h3>
                  <p>Access the most current rates. Our tariffs are updated regularly to reflect changes.</p>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </section>

        <!-- About Section -->
        <section class="about">
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="12" sizeLg="6">
                <div class="about-content">
                  <span class="section-label">About DCS</span>
                  <h2>A Legacy of Excellence in Maritime Shipping</h2>
                  <p>
                    Del Corona & Scardigli has been a trusted name in maritime shipping since 1875.
                    With over a century of experience, we combine traditional values with modern technology
                    to provide exceptional service to our clients worldwide.
                  </p>
                  <p>
                    Our Rate Portal represents our commitment to transparency and accessibility,
                    making it easier than ever for shipping professionals to access our tariff information.
                  </p>
                  <a href="https://delcoronascardigli.com" target="_blank" rel="noopener" class="about-link">
                    Visit our corporate website
                    <ion-icon name="arrow-forward"></ion-icon>
                  </a>
                </div>
              </ion-col>
              <ion-col size="12" sizeLg="6">
                <div class="about-stats">
                  <div class="stat-item">
                    <span class="stat-number">1875</span>
                    <span class="stat-text">Year Established</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">148+</span>
                    <span class="stat-text">Years of Experience</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">Global</span>
                    <span class="stat-text">Shipping Network</span>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </section>

        <!-- CTA Section -->
        <section class="cta">
          <div class="cta-content">
            <h2>Ready to get started?</h2>
            <p>Create your free account today and access our complete tariff database.</p>
            <ion-button size="large" color="light" [routerLink]="['/register']">
              Create Free Account
              <ion-icon name="arrow-forward" slot="end"></ion-icon>
            </ion-button>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <div class="footer-logo">
              <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="logo-img">
            </div>
            <p class="footer-text">
              &copy; {{ currentYear }} Del Corona & Scardigli USA Inc. All rights reserved.
            </p>
            <p class="footer-compliance">
              Compliant with Federal Maritime Commission (FMC) regulations
            </p>
          </div>
        </footer>
      </div>
    </ion-content>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: #ffffff;
    }

    /* Navigation */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(30, 58, 95, 0.08);
      padding: 16px 24px;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-logo {
      display: flex;
      align-items: center;
    }

    .nav-logo .logo-img {
      max-width: 160px;
      height: auto;
    }

    .footer-logo .logo-img {
      max-width: 140px;
      height: auto;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-link {
      font-size: 14px;
      font-weight: 600;
      color: var(--ion-color-primary);
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .nav-link:hover {
      opacity: 0.7;
    }

    /* Hero */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 24px 80px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #1e3a5f 100%);
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      opacity: 0.1;
    }

    .hero-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0);
      background-size: 40px 40px;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 100px;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 32px;
    }

    .hero-badge ion-icon {
      font-size: 18px;
      color: #b8860b;
    }

    .hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 24px;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .hero h1 em {
      font-style: italic;
      color: #b8860b;
    }

    .hero-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 40px;
      line-height: 1.7;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .hero-actions ion-button {
      --padding-start: 32px;
      --padding-end: 32px;
      min-width: 180px;
    }

    .hero-trust {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
      letter-spacing: 0.03em;
    }

    .hero-decoration {
      position: absolute;
      bottom: -60px;
      right: -60px;
      font-size: 300px;
      color: rgba(255, 255, 255, 0.03);
      transform: rotate(-15deg);
    }

    /* Features */
    .features {
      padding: 100px 24px;
      background: #fafbfc;
    }

    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 60px;
    }

    .section-label {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #b8860b;
      margin-bottom: 16px;
    }

    .section-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 600;
      color: var(--ion-color-primary);
      margin: 0;
      line-height: 1.2;
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: #ffffff;
      border-radius: var(--border-radius-lg);
      padding: 40px 28px;
      text-align: center;
      height: 100%;
      border: 1px solid rgba(30, 58, 95, 0.06);
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: transparent;
    }

    .feature-icon {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, rgba(30, 58, 95, 0.08) 0%, rgba(30, 58, 95, 0.04) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .feature-icon ion-icon {
      font-size: 32px;
      color: var(--ion-color-primary);
    }

    .feature-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: var(--ion-color-primary);
      margin: 0 0 12px;
    }

    .feature-card p {
      font-size: 14px;
      color: var(--text-color-secondary);
      margin: 0;
      line-height: 1.7;
    }

    /* About */
    .about {
      padding: 100px 24px;
      background: #ffffff;
    }

    .about-content {
      max-width: 480px;
    }

    .about-content h2 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 600;
      color: var(--ion-color-primary);
      margin: 0 0 24px;
      line-height: 1.2;
    }

    .about-content p {
      font-size: 15px;
      color: var(--text-color-secondary);
      margin: 0 0 20px;
      line-height: 1.8;
    }

    .about-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--ion-color-primary);
      text-decoration: none;
      margin-top: 12px;
      transition: gap 0.2s;
    }

    .about-link:hover {
      gap: 12px;
    }

    .about-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 40px;
      background: linear-gradient(135deg, #fafbfc 0%, #f4f6f8 100%);
      border-radius: var(--border-radius-xl);
    }

    .stat-item {
      text-align: center;
      padding: 24px 16px;
    }

    .stat-number {
      display: block;
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 600;
      color: var(--ion-color-primary);
      margin-bottom: 8px;
    }

    .stat-text {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-color-secondary);
    }

    /* CTA */
    .cta {
      padding: 100px 24px;
      background: var(--gradient-primary);
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta h2 {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 16px;
    }

    .cta p {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 32px;
    }

    .cta ion-button {
      --padding-start: 40px;
      --padding-end: 40px;
    }

    /* Footer */
    .footer {
      padding: 48px 24px;
      background: #1a2a3a;
      text-align: center;
    }

    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .footer .logo-dcs {
      color: #ffffff;
      font-size: 24px;
    }

    .footer .logo-text {
      color: rgba(255, 255, 255, 0.7);
    }

    .footer .logo-divider {
      background: linear-gradient(180deg, transparent, #b8860b, transparent);
    }

    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .footer-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 8px;
    }

    .footer-compliance {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero h1 {
        font-size: 48px;
      }

      .section-header h2,
      .about-content h2 {
        font-size: 32px;
      }

      .about-stats {
        margin-top: 48px;
      }
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 12px 16px;
      }

      .logo-dcs {
        font-size: 22px;
      }

      .hero {
        padding: 100px 16px 60px;
        min-height: auto;
      }

      .hero h1 {
        font-size: 36px;
      }

      .hero-subtitle {
        font-size: 16px;
      }

      .hero-decoration {
        display: none;
      }

      .features, .about, .cta {
        padding: 64px 16px;
      }

      .section-header h2 {
        font-size: 28px;
      }

      .about-stats {
        grid-template-columns: 1fr;
        padding: 24px;
      }

      .stat-number {
        font-size: 28px;
      }

      .cta h2 {
        font-size: 28px;
      }
    }
  `]
})
export class LandingPage {
  currentYear = new Date().getFullYear();

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      shieldCheckmarkOutline,
      flashOutline,
      boatOutline,
      globeOutline,
      arrowForward
    });
  }
}
