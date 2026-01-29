import { Component, computed, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, printOutline, logOutOutline, searchOutline, closeCircle } from 'ionicons/icons';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-tariff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton
  ],
  template: `
    <ion-header class="premium-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard" color="primary"></ion-back-button>
          <div class="user-info" [routerLink]="['/profile']">
            <div class="user-avatar">
              <span class="avatar-initials">{{ initials() }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ fullName() }}</span>
              <span class="user-role">{{ user()?.company }}</span>
            </div>
          </div>
        </ion-buttons>
        <ion-title>
          <span class="header-title">Public Rules Tariff</span>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="printTariff()" class="header-btn">
            <ion-icon slot="icon-only" name="print-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="downloadPdf()" class="header-btn">
            <ion-icon slot="icon-only" name="download-outline"></ion-icon>
          </ion-button>
          <div class="header-logo">
            <img src="assets/images/dcs-logo.png" alt="DCS Rate Portal" class="header-logo-img">
          </div>
          <ion-button (click)="logout()" class="header-btn logout-btn">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Premium Search & Navigation Bar -->
      <div class="search-navigation-bar">
        <div class="search-nav-container">
          <!-- Search Input -->
          <div class="search-wrapper">
            <ion-icon name="search-outline" class="search-icon"></ion-icon>
            <input
              type="text"
              class="search-input"
              placeholder="Search tariff content..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            >
            @if (searchQuery()) {
              <ion-icon
                name="close-circle"
                class="clear-icon"
                (click)="clearSearch()"
              ></ion-icon>
            }
          </div>

          <!-- Section Navigation -->
          <div class="section-nav">
            <span class="nav-label">Jump to:</span>
            <div class="section-chips">
              @for (section of sections; track section.id) {
                <button
                  class="section-chip"
                  [class.active]="activeSection() === section.id"
                  (click)="scrollToSection(section.id)"
                >
                  <span class="chip-number">{{ section.id }}</span>
                  <span class="chip-label">{{ section.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Search Results Count -->
          @if (searchQuery() && searchResultsCount() > 0) {
            <div class="search-results-info">
              <span class="results-count">{{ searchResultsCount() }} matches found</span>
            </div>
          }
          @if (searchQuery() && searchResultsCount() === 0) {
            <div class="search-results-info no-results">
              <span class="results-count">No matches found</span>
            </div>
          }
        </div>
      </div>

      <div class="tariff-document">
        <!-- Document Header -->
        <header class="document-header">
          <div class="logo-mark">
            <img src="assets/images/dcs-logo.png" alt="DCS Group" class="document-logo">
          </div>
          <h1 class="document-title">PUBLIC RULES TARIFF</h1>
          <p class="document-code">(DCST 001)</p>
          <p class="document-subtitle">Structured in Danmar style: clear, neutral, tabular, FMC-clean</p>
        </header>

        <!-- Company Info -->
        <section class="company-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Company</span>
              <span class="info-value">Del Corona & Scardigli U.S.A. Inc.</span>
            </div>
            <div class="info-item">
              <span class="info-label">FMC License / Organization No.</span>
              <span class="info-value">024818</span>
            </div>
            <div class="info-item">
              <span class="info-label">Address</span>
              <span class="info-value">3030 Cullerton Street, Franklin Park, IL 60131 USA</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contact</span>
              <span class="info-value">
                <a href="mailto:operations@dcsusa.com">operations&#64;dcsusa.com</a>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Terms & Conditions</span>
              <span class="info-value">
                <a href="https://www.delcoronascardigli.com/u-s-terms-and-conditions/" target="_blank">
                  View Terms & Conditions
                </a>
              </span>
            </div>
            <div class="info-item highlight">
              <span class="info-label">Effective Date</span>
              <span class="info-value">September 1, 2025</span>
            </div>
          </div>
        </section>

        <!-- Section 100 -->
        <section class="tariff-section" id="section-100">
          <h2 class="section-title">
            <span class="section-number">100</span>
            Scope of Service
          </h2>
          <div class="section-content">
            <p>This Tariff applies to all ocean transportation services performed by DCS USA as an FMC-licensed NVOCC on:</p>

            <div class="service-types">
              <div class="service-type">
                <span class="service-badge export">EXPORT</span>
                <span class="service-route">All U.S. ports → All foreign ports</span>
              </div>
              <div class="service-type">
                <span class="service-badge import">IMPORT</span>
                <span class="service-route">All foreign ports → All U.S. ports</span>
              </div>
            </div>

            <p>Applies to lawful, in-gauge, non-hazardous FCL cargo in standard equipment unless otherwise specified.</p>

            <p>All carriage moves under <strong>DCS USA House Bill of Lading</strong> and is subject to <strong>DCS USA Terms & Conditions of Service</strong>.</p>
          </div>
        </section>

        <!-- Section 200 -->
        <section class="tariff-section" id="section-200">
          <h2 class="section-title">
            <span class="section-number">200</span>
            Definitions
          </h2>
          <div class="section-content">
            <dl class="definitions-list">
              <div class="definition-item">
                <dt>NVOCC</dt>
                <dd>Del Corona & Scardigli U.S.A., Inc. (DCS USA), FMC 024818</dd>
              </div>
              <div class="definition-item">
                <dt>Merchant</dt>
                <dd>Shipper, Consignee, Owner of goods, or any party acting on their behalf</dd>
              </div>
              <div class="definition-item">
                <dt>FCL</dt>
                <dd>Full Container Load</dd>
              </div>
              <div class="definition-item">
                <dt>Dry Equipment</dt>
                <dd>20'DV, 40'DV, 40'HC</dd>
              </div>
              <div class="definition-item">
                <dt>Refrigerated Equipment</dt>
                <dd>20'RF, 40'RF</dd>
              </div>
              <div class="definition-item">
                <dt>NRA</dt>
                <dd>Negotiated Rate Arrangement (46 CFR 532)</dd>
              </div>
              <div class="definition-item">
                <dt>Gate-In Date</dt>
                <dd>Determines which rate applies</dd>
              </div>
              <div class="definition-item">
                <dt>All-In Rate</dt>
                <dd>Ocean freight + standard ocean surcharges, excludes accessorials</dd>
              </div>
            </dl>
          </div>
        </section>

        <!-- Section 300 -->
        <section class="tariff-section" id="section-300">
          <h2 class="section-title">
            <span class="section-number">300</span>
            Conditions of Carriage
          </h2>
          <div class="section-content">
            <ul class="conditions-list">
              <li>Subject to <strong>equipment availability</strong></li>
              <li><strong>Booking = acceptance</strong> of NRA</li>
              <li><strong>Transit times not guaranteed</strong></li>
              <li>SLAC: Shipper responsible for loading, securing, sealing</li>
              <li>Reefer temperature must be declared in writing</li>
              <li>Dangerous Goods require advance approval + IMDG compliance</li>
              <li>Carrier may stow containers <strong>on deck</strong></li>
              <li>Merchant responsible for all government exams, holds, fees</li>
              <li>Inland haulage subject to legal weight limits</li>
              <li>Gate-In Date controls rate validity</li>
            </ul>
          </div>
        </section>

        <!-- Section 400 -->
        <section class="tariff-section rates-section" id="section-400">
          <h2 class="section-title">
            <span class="section-number">400</span>
            Base All-In FCL Rates
          </h2>
          <p class="section-subtitle">Applies to standard FAK cargo, lawful, non-hazardous, in-gauge</p>

          <div class="section-content">
            <!-- Export Rates -->
            <div class="rates-block">
              <h3 class="rates-title">
                <span class="rates-code">401</span>
                Export Rates (USA → WORLD)
              </h3>
              <table class="rates-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>All-In Rate (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span class="equipment-type">20' Dry (20DV)</span>
                    </td>
                    <td class="rate-value">$15,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type">40' Dry (40DV/40HC)</span>
                    </td>
                    <td class="rate-value">$25,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type reefer">20' Reefer (20RF)</span>
                    </td>
                    <td class="rate-value">$25,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type reefer">40' Reefer (40RF)</span>
                    </td>
                    <td class="rate-value">$35,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Import Rates -->
            <div class="rates-block">
              <h3 class="rates-title">
                <span class="rates-code">402</span>
                Import Rates (WORLD → USA)
              </h3>
              <table class="rates-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>All-In Rate (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span class="equipment-type">20' Dry (20DV)</span>
                    </td>
                    <td class="rate-value">$15,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type">40' Dry (40DV/40HC)</span>
                    </td>
                    <td class="rate-value">$25,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type reefer">20' Reefer (20RF)</span>
                    </td>
                    <td class="rate-value">$25,000</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="equipment-type reefer">40' Reefer (40RF)</span>
                    </td>
                    <td class="rate-value">$35,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Section 500 -->
        <section class="tariff-section" id="section-500">
          <h2 class="section-title">
            <span class="section-number">500</span>
            Included Surcharges (In All-In Rates)
          </h2>
          <div class="section-content">
            <p>The following are included in All-In Rates:</p>
            <div class="included-items">
              <span class="included-tag">BAF / Fuel Surcharge</span>
              <span class="included-tag">CAF</span>
              <span class="included-tag">Low Sulphur Surcharge (LSS)</span>
              <span class="included-tag">Peak Season Surcharge (PSS)</span>
              <span class="included-tag">Emergency Charges (EIS)</span>
              <span class="included-tag">ISPS / Security Charges</span>
              <span class="included-tag">Carrier documentation charges</span>
            </div>
          </div>
        </section>

        <!-- Section 600 -->
        <section class="tariff-section accessorial-section" id="section-600">
          <h2 class="section-title">
            <span class="section-number">600</span>
            Accessorial Charges (Not Included)
          </h2>
          <div class="section-content">
            <div class="table-wrapper">
              <table class="accessorial-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Accessorial</th>
                    <th>Charge</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="code-cell">DCS-001</td>
                    <td>Origin THC</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">As per terminal tariff</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-002</td>
                    <td>Destination THC</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">As per POD terminal</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-003</td>
                    <td>DG Surcharge</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">Requires DG approval</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-004</td>
                    <td>Reefer Monitoring</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">Terminal monitoring</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-005</td>
                    <td>Reefer Genset</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">If required for inland legs</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-006</td>
                    <td>Pre-Pull</td>
                    <td class="charge-cell">$150 USD</td>
                    <td class="notes-cell">Storage extra if applicable</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-007</td>
                    <td>Chassis Fee</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">As per provider</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-008</td>
                    <td>Waiting Time</td>
                    <td class="charge-cell">$125 USD/hr</td>
                    <td class="notes-cell">After first free hour</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-009</td>
                    <td>Dry Run</td>
                    <td class="charge-cell">$250 USD</td>
                    <td class="notes-cell">Truck dispatched, no load</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-010</td>
                    <td>Port Storage (Demurrage)</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">Per carrier/terminal</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-011</td>
                    <td>Container Detention</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">Per carrier tariff</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-012</td>
                    <td>Documentation Amendment</td>
                    <td class="charge-cell">$75 USD</td>
                    <td class="notes-cell">B/L correction or reissue</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-013</td>
                    <td>Telex Release</td>
                    <td class="charge-cell">$50 USD</td>
                    <td class="notes-cell">Upon request</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-014</td>
                    <td>AES Filing</td>
                    <td class="charge-cell">$35 USD</td>
                    <td class="notes-cell">If DCS USA files</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-015</td>
                    <td>ISF Filing</td>
                    <td class="charge-cell">$50 USD</td>
                    <td class="notes-cell">If DCS USA files</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-016</td>
                    <td>Exam Coordination</td>
                    <td class="charge-cell">$75 USD</td>
                    <td class="notes-cell">CBP / USDA / FDA</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-017</td>
                    <td>Change of Destination (COD)</td>
                    <td class="charge-cell">$300 USD + diff. freight</td>
                    <td class="notes-cell">If accepted</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-018</td>
                    <td>Hazardous Documentation</td>
                    <td class="charge-cell">$100 USD</td>
                    <td class="notes-cell">DG paperwork</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-019</td>
                    <td>Cargo Insurance</td>
                    <td class="charge-cell">Quoted</td>
                    <td class="notes-cell">Only if written request</td>
                  </tr>
                  <tr>
                    <td class="code-cell">DCS-020</td>
                    <td>Reefer PTI</td>
                    <td class="charge-cell">At cost</td>
                    <td class="notes-cell">As required by terminal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Section 700 -->
        <section class="tariff-section" id="section-700">
          <h2 class="section-title">
            <span class="section-number">700</span>
            Liability
          </h2>
          <div class="section-content">
            <p>Consistent with DCS USA Terms & Conditions:</p>
            <ul class="liability-list">
              <li>Liability limit: <strong>USD 500 per package or CFU (COGSA)</strong></li>
              <li>No liability for delay, consequential loss, loss of market</li>
              <li>Merchant responsible for accuracy of all descriptions</li>
              <li>Merchant liable for fines, penalties, misdeclarations, DG violations</li>
              <li>Cargo insurance optional and strongly recommended</li>
            </ul>

            <div class="claims-box">
              <h4>Claims Deadlines</h4>
              <div class="claims-grid">
                <div class="claim-item">
                  <span class="claim-type">Visible damage</span>
                  <span class="claim-deadline">At delivery</span>
                </div>
                <div class="claim-item">
                  <span class="claim-type">Concealed damage</span>
                  <span class="claim-deadline">Within 3 days</span>
                </div>
                <div class="claim-item">
                  <span class="claim-type">Legal action</span>
                  <span class="claim-deadline">Within 1 year</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 800 -->
        <section class="tariff-section" id="section-800">
          <h2 class="section-title">
            <span class="section-number">800</span>
            Governing Law & Venue
          </h2>
          <div class="section-content">
            <ul class="law-list">
              <li>Governed by U.S. law and COGSA</li>
              <li>For non-maritime matters, governed by <strong>Illinois law</strong></li>
              <li>Exclusive venue: State & Federal Courts in Illinois</li>
              <li>Carrier may pursue unpaid charges in any competent jurisdiction</li>
            </ul>
          </div>
        </section>

        <!-- Section 900 -->
        <section class="tariff-section" id="section-900">
          <h2 class="section-title">
            <span class="section-number">900</span>
            Rate Conditions
          </h2>
          <div class="section-content">
            <ol class="rate-conditions">
              <li>Rates apply to lawful, in-gauge, non-hazardous FCL cargo</li>
              <li>Overweight cargo requires separate quotation</li>
              <li>Hazardous cargo requires DG approval</li>
              <li>Inland haulage not included unless stated in NRA</li>
              <li>Gate-In Date determines applicable rate</li>
              <li>NRA supersedes tariff rates for that shipment</li>
              <li>Merchant jointly & severally liable for all charges</li>
            </ol>
          </div>
        </section>

        <!-- Document Footer -->
        <footer class="document-footer">
          <div class="footer-content">
            <p class="footer-company">Del Corona & Scardigli U.S.A. Inc.</p>
            <p class="footer-fmc">FMC License No. 024818</p>
            <p class="footer-disclaimer">This tariff is filed with the Federal Maritime Commission in accordance with 46 CFR Part 520.</p>
          </div>
        </footer>
      </div>
    </ion-content>
  `,
  styles: [`
    /* Premium Header */
    .premium-header ion-toolbar {
      --background: #ffffff;
      --border-color: #e2e8f0;
      --border-width: 0 0 1px 0;
    }

    .header-logo {
      display: flex;
      align-items: center;
      margin-left: 8px;
    }

    .header-logo-img {
      height: 28px;
      width: auto;
    }

    .header-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
      margin-left: 8px;
    }

    .user-info:hover {
      background: #f1f5f9;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-initials {
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #1e3a5f;
      line-height: 1.2;
    }

    .user-role {
      font-size: 10px;
      color: #64748b;
      line-height: 1.2;
    }

    .header-btn {
      --color: #1e3a5f;
    }

    .logout-btn {
      --color: #64748b;
    }

    .logout-btn:hover {
      --color: #ef4444;
    }

    /* Premium Search & Navigation Bar */
    .search-navigation-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(30, 58, 95, 0.08);
      box-shadow: 0 4px 24px rgba(30, 58, 95, 0.06);
    }

    .search-nav-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      font-size: 20px;
      color: #94a3b8;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .search-input {
      width: 100%;
      height: 52px;
      padding: 0 48px;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      font-size: 15px;
      font-family: inherit;
      color: #1e3a5f;
      background: #ffffff;
      transition: all 0.3s ease;
      outline: none;
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .search-input:focus {
      border-color: #1e3a5f;
      box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.08), 0 4px 12px rgba(30, 58, 95, 0.12);
    }

    .search-input:focus + .search-icon,
    .search-wrapper:has(.search-input:focus) .search-icon {
      color: #1e3a5f;
    }

    .clear-icon {
      position: absolute;
      right: 16px;
      font-size: 22px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-icon:hover {
      color: #1e3a5f;
      transform: scale(1.1);
    }

    .section-nav {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .section-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 4px 0;
    }

    .section-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .section-chip:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      transform: translateY(-1px);
    }

    .section-chip.active {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
    }

    .section-chip.active .chip-number,
    .section-chip.active .chip-label {
      color: #ffffff;
    }

    .chip-number {
      font-size: 13px;
      font-weight: 700;
      color: #1e3a5f;
      transition: color 0.3s ease;
    }

    .chip-label {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      transition: color 0.3s ease;
    }

    .search-results-info {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border-radius: 8px;
      animation: fadeIn 0.3s ease;
    }

    .search-results-info.no-results {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }

    .results-count {
      font-size: 13px;
      font-weight: 600;
      color: #166534;
    }

    .search-results-info.no-results .results-count {
      color: #92400e;
    }

    /* Search Highlight */
    .search-highlight {
      background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
      padding: 2px 4px;
      border-radius: 4px;
      color: #1e3a5f;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Document Container */
    .tariff-document {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 24px;
      background: #ffffff;
    }

    /* Document Header */
    .document-header {
      text-align: center;
      padding: 40px 0;
      border-bottom: 2px solid #1e3a5f;
      margin-bottom: 32px;
    }

    .logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .document-logo {
      max-width: 200px;
      height: auto;
    }

    .document-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 8px;
      letter-spacing: 2px;
    }

    .document-code {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .document-subtitle {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
      margin: 12px 0 0;
    }

    /* Company Info */
    .company-info {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 40px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item.highlight {
      background: #1e3a5f;
      padding: 12px 16px;
      border-radius: 8px;
    }

    .info-item.highlight .info-label {
      color: rgba(255, 255, 255, 0.7);
    }

    .info-item.highlight .info-value {
      color: #ffffff;
      font-weight: 600;
    }

    .info-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      color: #1e3a5f;
      font-weight: 500;
    }

    .info-value a {
      color: #b8860b;
      text-decoration: none;
    }

    .info-value a:hover {
      text-decoration: underline;
    }

    /* Sections */
    .tariff-section {
      margin-bottom: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid #e2e8f0;
    }

    .tariff-section:last-of-type {
      border-bottom: none;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 20px;
    }

    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      border-radius: 50%;
    }

    .section-subtitle {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
      margin: -12px 0 20px 64px;
    }

    .section-content {
      padding-left: 64px;
    }

    .section-content p {
      font-size: 15px;
      line-height: 1.7;
      color: #475569;
      margin: 0 0 16px;
    }

    /* Service Types */
    .service-types {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 20px 0;
    }

    .service-type {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .service-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .service-badge.export {
      background: #1e3a5f;
      color: #ffffff;
    }

    .service-badge.import {
      background: #b8860b;
      color: #ffffff;
    }

    .service-route {
      font-size: 15px;
      color: #1e3a5f;
      font-weight: 500;
    }

    /* Notice Box */
    .notice-box {
      padding: 16px 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .notice-box.warning {
      background: #fef3c7;
      border-left: 4px solid #b8860b;
      color: #92400e;
    }

    /* Definitions */
    .definitions-list {
      margin: 0;
    }

    .definition-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .definition-item:last-child {
      border-bottom: none;
    }

    .definition-item dt {
      min-width: 180px;
      font-weight: 600;
      color: #1e3a5f;
      font-size: 14px;
    }

    .definition-item dd {
      margin: 0;
      color: #475569;
      font-size: 14px;
    }

    /* Conditions List */
    .conditions-list,
    .liability-list,
    .law-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .conditions-list li,
    .liability-list li,
    .law-list li {
      position: relative;
      padding: 10px 0 10px 24px;
      font-size: 14px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }

    .conditions-list li:last-child,
    .liability-list li:last-child,
    .law-list li:last-child {
      border-bottom: none;
    }

    .conditions-list li::before,
    .liability-list li::before,
    .law-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 18px;
      width: 8px;
      height: 8px;
      background: #b8860b;
      border-radius: 50%;
    }

    /* Rate Conditions (numbered) */
    .rate-conditions {
      counter-reset: item;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .rate-conditions li {
      counter-increment: item;
      position: relative;
      padding: 12px 0 12px 40px;
      font-size: 14px;
      color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }

    .rate-conditions li:last-child {
      border-bottom: none;
    }

    .rate-conditions li::before {
      content: counter(item);
      position: absolute;
      left: 0;
      top: 10px;
      width: 24px;
      height: 24px;
      background: #1e3a5f;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Rates Tables */
    .rates-section .section-content {
      padding-left: 0;
    }

    .rates-block {
      margin-bottom: 32px;
      margin-left: 64px;
    }

    .rates-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 16px;
    }

    .rates-code {
      background: #f1f5f9;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 13px;
      color: #64748b;
    }

    .rates-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .rates-table th {
      background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
      color: #ffffff;
      padding: 14px 20px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .rates-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .rates-table tr:last-child td {
      border-bottom: none;
    }

    .rates-table tr:hover td {
      background: #f8fafc;
    }

    .equipment-type {
      font-weight: 500;
      color: #1e3a5f;
    }

    .equipment-type.reefer {
      color: #0284c7;
    }

    .rate-value {
      font-size: 18px;
      font-weight: 700;
      color: #b8860b;
    }

    /* Included Tags */
    .included-items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }

    .included-tag {
      background: #dcfce7;
      color: #166534;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    /* Accessorial Table */
    .accessorial-section .section-content {
      padding-left: 0;
      margin-left: 64px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .accessorial-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .accessorial-table th {
      background: #f8fafc;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #1e3a5f;
      border-bottom: 2px solid #1e3a5f;
    }

    .accessorial-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #475569;
    }

    .accessorial-table tr:hover td {
      background: #f8fafc;
    }

    .code-cell {
      font-family: monospace;
      font-weight: 600;
      color: #1e3a5f;
    }

    .charge-cell {
      font-weight: 600;
      color: #b8860b;
    }

    .notes-cell {
      color: #64748b;
      font-size: 12px;
    }

    /* Claims Box */
    .claims-box {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }

    .claims-box h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 16px;
    }

    .claims-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .claim-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .claim-type {
      font-size: 12px;
      color: #64748b;
    }

    .claim-deadline {
      font-size: 14px;
      font-weight: 600;
      color: #1e3a5f;
    }

    /* Document Footer */
    .document-footer {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 2px solid #1e3a5f;
      text-align: center;
    }

    .footer-company {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 4px;
    }

    .footer-fmc {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 16px;
    }

    .footer-disclaimer {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
      font-style: italic;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .search-nav-container {
        padding: 12px 16px;
        gap: 12px;
      }

      .search-input {
        height: 46px;
        font-size: 14px;
        border-radius: 12px;
      }

      .section-nav {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .section-chips {
        gap: 6px;
      }

      .section-chip {
        padding: 6px 10px;
        border-radius: 8px;
      }

      .chip-number {
        font-size: 11px;
      }

      .chip-label {
        font-size: 10px;
      }

      .tariff-document {
        padding: 20px 16px;
      }

      .section-content,
      .rates-block,
      .accessorial-section .section-content {
        padding-left: 0;
        margin-left: 0;
      }

      .section-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .section-subtitle {
        margin-left: 0;
      }

      .definition-item {
        flex-direction: column;
        gap: 4px;
      }

      .definition-item dt {
        min-width: auto;
      }

      .claims-grid {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .document-logo {
        max-width: 160px;
      }

      .header-logo {
        display: none;
      }

      .user-details {
        display: none;
      }

      .user-info {
        padding: 4px;
        margin-left: 4px;
      }

      .user-avatar {
        width: 28px;
        height: 28px;
      }

      .avatar-initials {
        font-size: 11px;
      }
    }

    /* Print Styles */
    @media print {
      .tariff-document {
        max-width: 100%;
        padding: 0;
      }

      .premium-header,
      .search-navigation-bar {
        display: none;
      }

      .search-highlight {
        background: none;
        padding: 0;
        box-shadow: none;
        font-weight: normal;
      }
    }
  `]
})
export class TariffPage {
  user = computed(() => this.authService.user());
  fullName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'User';
  });
  initials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return (u.firstName?.[0] || '') + (u.lastName?.[0] || '');
  });

  // Search & Navigation
  searchQuery = signal('');
  activeSection = signal('100');
  searchResultsCount = signal(0);

  sections = [
    { id: '100', label: 'Scope' },
    { id: '200', label: 'Definitions' },
    { id: '300', label: 'Conditions' },
    { id: '400', label: 'Rates' },
    { id: '500', label: 'Surcharges' },
    { id: '600', label: 'Accessorial' },
    { id: '700', label: 'Liability' },
    { id: '800', label: 'Law' },
    { id: '900', label: 'Rate Cond.' }
  ];

  constructor(private authService: AuthService) {
    addIcons({ downloadOutline, printOutline, logOutOutline, searchOutline, closeCircle });
  }

  scrollToSection(sectionId: string): void {
    this.activeSection.set(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSearch(): void {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      this.clearHighlights();
      this.searchResultsCount.set(0);
      return;
    }

    // Clear previous highlights
    this.clearHighlights();

    // Search and highlight
    const tariffDoc = document.querySelector('.tariff-document');
    if (tariffDoc) {
      const count = this.highlightText(tariffDoc, query);
      this.searchResultsCount.set(count);

      // Scroll to first match
      const firstMatch = document.querySelector('.search-highlight');
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.clearHighlights();
    this.searchResultsCount.set(0);
  }

  private highlightText(element: Element, query: string): number {
    let count = 0;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    textNodes.forEach(node => {
      const text = node.textContent || '';
      const lowerText = text.toLowerCase();
      if (lowerText.includes(query)) {
        const parent = node.parentNode as Element;
        if (parent && !(parent as Element).closest?.('.search-navigation-bar')) {
          const parts = text.split(new RegExp(`(${query})`, 'gi'));
          const fragment = document.createDocumentFragment();

          parts.forEach(part => {
            if (part.toLowerCase() === query) {
              const mark = document.createElement('mark');
              mark.className = 'search-highlight';
              mark.textContent = part;
              fragment.appendChild(mark);
              count++;
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          });

          parent.replaceChild(fragment, node);
        }
      }
    });

    return count;
  }

  private clearHighlights(): void {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });
  }

  downloadPdf(): void {
    window.open('/api/rate-portal/tariff/download', '_blank');
  }

  printTariff(): void {
    window.print();
  }

  logout(): void {
    this.authService.logout();
  }
}
