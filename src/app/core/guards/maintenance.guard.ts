import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaintenanceService } from '../services/maintenance.service';

export const maintenanceGuard: CanActivateFn = () => {
  const maintenanceService = inject(MaintenanceService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // If not under maintenance, allow access
  if (!maintenanceService.isUnderMaintenance()) {
    return true;
  }

  // If user is admin, allow access even during maintenance
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Block non-admin users during maintenance
  router.navigate(['/maintenance']);
  return false;
};
