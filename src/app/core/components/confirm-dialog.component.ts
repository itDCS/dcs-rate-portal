import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  warningOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  closeOutline
} from 'ionicons/icons';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, IonIcon, IonSpinner],
  template: `
    @if (dialogService.isOpen()) {
      <div class="dialog-overlay" (click)="onOverlayClick($event)">
        <div class="dialog-container" [class]="dialogTypeClass()">
          <!-- Header -->
          <div class="dialog-header">
            <div class="dialog-icon" [class]="iconClass()">
              <ion-icon [name]="iconName()"></ion-icon>
            </div>
            <button class="close-btn" (click)="cancel()" [disabled]="dialogService.loading()">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>

          <!-- Content -->
          <div class="dialog-content">
            <h2 class="dialog-title">{{ config()?.title }}</h2>
            <p class="dialog-message" [innerHTML]="config()?.message"></p>
          </div>

          <!-- Footer -->
          <div class="dialog-footer">
            <button class="btn btn-cancel" (click)="cancel()" [disabled]="dialogService.loading()">
              {{ config()?.cancelText }}
            </button>
            <button class="btn btn-confirm" [class]="confirmBtnClass()" (click)="confirm()" [disabled]="dialogService.loading()">
              @if (dialogService.loading()) {
                <ion-spinner name="crescent"></ion-spinner>
              } @else {
                {{ config()?.confirmText }}
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .dialog-container {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideIn 0.25s ease;
      overflow: hidden;
    }

    /* Header */
    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 24px 24px 0;
    }

    .dialog-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-icon ion-icon {
      font-size: 24px;
    }

    .dialog-icon.icon-info {
      background: #dbeafe;
      color: #1e40af;
    }

    .dialog-icon.icon-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .dialog-icon.icon-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .dialog-icon.icon-success {
      background: #dcfce7;
      color: #16a34a;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #64748b;
    }

    .close-btn:hover:not(:disabled) {
      background: #e2e8f0;
      color: #475569;
    }

    .close-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .close-btn ion-icon {
      font-size: 20px;
    }

    /* Content */
    .dialog-content {
      padding: 20px 24px;
    }

    .dialog-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin: 0 0 12px;
    }

    .dialog-message {
      font-size: 14px;
      line-height: 1.6;
      color: #64748b;
      margin: 0;
    }

    .dialog-message strong {
      color: #1e3a5f;
      font-weight: 600;
    }

    /* Footer */
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 100px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #64748b;
    }

    .btn-cancel:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-confirm {
      border: none;
      color: #ffffff;
    }

    .btn-confirm.confirm-info {
      background: #1e3a5f;
    }

    .btn-confirm.confirm-info:hover:not(:disabled) {
      background: #2d4a6f;
    }

    .btn-confirm.confirm-warning {
      background: #d97706;
    }

    .btn-confirm.confirm-warning:hover:not(:disabled) {
      background: #b45309;
    }

    .btn-confirm.confirm-danger {
      background: #dc2626;
    }

    .btn-confirm.confirm-danger:hover:not(:disabled) {
      background: #b91c1c;
    }

    .btn-confirm.confirm-success {
      background: #16a34a;
    }

    .btn-confirm.confirm-success:hover:not(:disabled) {
      background: #15803d;
    }

    .btn-confirm ion-spinner {
      width: 18px;
      height: 18px;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .dialog-container {
        max-width: 100%;
        margin: 0 10px;
      }

      .dialog-footer {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogService: ConfirmDialogService) {
    addIcons({
      alertCircleOutline,
      warningOutline,
      checkmarkCircleOutline,
      informationCircleOutline,
      closeOutline
    });
  }

  config = computed(() => this.dialogService.config());

  dialogTypeClass = computed(() => {
    return `dialog-${this.config()?.type || 'info'}`;
  });

  iconClass = computed(() => {
    return `icon-${this.config()?.type || 'info'}`;
  });

  iconName = computed(() => {
    if (this.config()?.icon) return this.config()!.icon;

    const typeIcons: Record<string, string> = {
      'info': 'information-circle-outline',
      'warning': 'warning-outline',
      'danger': 'alert-circle-outline',
      'success': 'checkmark-circle-outline'
    };
    return typeIcons[this.config()?.type || 'info'];
  });

  confirmBtnClass = computed(() => {
    return `confirm-${this.config()?.type || 'info'}`;
  });

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.dialogService.loading()) {
      this.cancel();
    }
  }

  confirm(): void {
    if (!this.dialogService.loading()) {
      this.dialogService.close(true);
    }
  }

  cancel(): void {
    if (!this.dialogService.loading()) {
      this.dialogService.close(false);
    }
  }
}
