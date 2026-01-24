import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  documentTextOutline,
  personOutline,
  peopleOutline,
  listOutline,
  logOutOutline,
  shieldOutline
} from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle
  ],
  template: `
    <ion-app>
      @if (isAuthenticated()) {
        <ion-menu contentId="main-content" type="overlay" class="premium-menu">
          <ion-content>
            <!-- Premium Header -->
            <div class="menu-header">
              <div class="menu-logo">
                <span class="logo-dcs">DCS</span>
                <span class="logo-divider"></span>
                <span class="logo-text">Rate Portal</span>
              </div>
              <p class="menu-subtitle">FMC License No. 024818</p>
            </div>

            <!-- User Section -->
            <div class="menu-section">
              <p class="section-label">Navigation</p>
              <ion-list lines="none">
                <ion-menu-toggle auto-hide="false">
                  <ion-item [routerLink]="['/dashboard']" detail="false" class="menu-item">
                    <ion-icon name="home-outline" slot="start"></ion-icon>
                    <ion-label>Dashboard</ion-label>
                  </ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle auto-hide="false">
                  <ion-item [routerLink]="['/tariff']" detail="false" class="menu-item">
                    <ion-icon name="document-text-outline" slot="start"></ion-icon>
                    <ion-label>View Tariff</ion-label>
                  </ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle auto-hide="false">
                  <ion-item [routerLink]="['/profile']" detail="false" class="menu-item">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-label>My Profile</ion-label>
                  </ion-item>
                </ion-menu-toggle>
              </ion-list>
            </div>

            @if (isAdmin()) {
              <!-- Admin Section -->
              <div class="menu-section">
                <p class="section-label">Administration</p>
                <ion-list lines="none">
                  <ion-menu-toggle auto-hide="false">
                    <ion-item [routerLink]="['/admin']" detail="false" class="menu-item admin-item">
                      <ion-icon name="shield-outline" slot="start"></ion-icon>
                      <ion-label>Admin Dashboard</ion-label>
                    </ion-item>
                  </ion-menu-toggle>

                  <ion-menu-toggle auto-hide="false">
                    <ion-item [routerLink]="['/admin/users']" detail="false" class="menu-item admin-item">
                      <ion-icon name="people-outline" slot="start"></ion-icon>
                      <ion-label>Manage Users</ion-label>
                    </ion-item>
                  </ion-menu-toggle>

                  <ion-menu-toggle auto-hide="false">
                    <ion-item [routerLink]="['/admin/logs']" detail="false" class="menu-item admin-item">
                      <ion-icon name="list-outline" slot="start"></ion-icon>
                      <ion-label>Access Logs</ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                </ion-list>
              </div>
            }

            <!-- Logout Section -->
            <div class="menu-footer">
              <ion-menu-toggle auto-hide="false">
                <ion-item (click)="logout()" detail="false" button class="logout-item">
                  <ion-icon name="log-out-outline" slot="start"></ion-icon>
                  <ion-label>Logout</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </div>
          </ion-content>
        </ion-menu>
      }

      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  styles: [`
    .premium-menu {
      --width: 280px;
      --background: #ffffff;
    }

    .premium-menu ion-content {
      --background: #ffffff;
    }

    /* Menu Header */
    .menu-header {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      padding: 32px 20px 24px;
      text-align: center;
    }

    .menu-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .logo-dcs {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 2px;
    }

    .logo-divider {
      width: 2px;
      height: 24px;
      background: linear-gradient(180deg, transparent, #b8860b, transparent);
    }

    .logo-text {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .menu-subtitle {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      letter-spacing: 0.5px;
    }

    /* Menu Sections */
    .menu-section {
      padding: 16px 12px 8px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 8px 8px;
    }

    .menu-section ion-list {
      padding: 0;
      background: transparent;
    }

    /* Menu Items */
    .menu-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 48px;
      --background: transparent;
      --background-hover: rgba(30, 58, 95, 0.06);
      --background-activated: rgba(30, 58, 95, 0.1);
      margin: 2px 0;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      transition: all 0.2s ease;
    }

    .menu-item:hover {
      --background: rgba(30, 58, 95, 0.06);
    }

    .menu-item ion-icon {
      color: #1e3a5f;
      font-size: 20px;
      margin-right: 14px;
    }

    .menu-item ion-label {
      font-weight: 500;
    }

    /* Admin Items */
    .admin-item ion-icon {
      color: #b8860b;
    }

    /* Menu Footer */
    .menu-footer {
      padding: 12px;
      margin-top: auto;
      border-top: 1px solid #e2e8f0;
    }

    .logout-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 48px;
      --background: transparent;
      --background-hover: rgba(220, 38, 38, 0.06);
      --background-activated: rgba(220, 38, 38, 0.1);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
    }

    .logout-item:hover {
      --background: rgba(220, 38, 38, 0.06);
      color: #dc2626;
    }

    .logout-item ion-icon {
      color: #64748b;
      font-size: 20px;
      margin-right: 14px;
    }

    .logout-item:hover ion-icon {
      color: #dc2626;
    }
  `]
})
export class AppComponent {
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  isAdmin = computed(() => this.authService.isAdmin());

  constructor(private authService: AuthService) {
    addIcons({
      homeOutline,
      documentTextOutline,
      personOutline,
      peopleOutline,
      listOutline,
      logOutOutline,
      shieldOutline
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
