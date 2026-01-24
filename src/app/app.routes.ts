import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Public routes (guest only)
  {
    path: '',
    loadComponent: () => import('./pages/public/landing/landing.page').then(m => m.LandingPage),
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.page').then(m => m.LoginPage),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register.page').then(m => m.RegisterPage),
    canActivate: [guestGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/public/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    canActivate: [guestGuard]
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./pages/public/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
    canActivate: [guestGuard]
  },
  {
    path: 'activate/:token',
    loadComponent: () => import('./pages/public/activate/activate.page').then(m => m.ActivatePage)
  },

  // User routes (authenticated)
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/user/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'tariff',
    loadComponent: () => import('./pages/user/tariff/tariff.page').then(m => m.TariffPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/admin-users/admin-users.page').then(m => m.AdminUsersPage)
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./pages/admin/admin-user-detail/admin-user-detail.page').then(m => m.AdminUserDetailPage)
      },
      {
        path: 'logs',
        loadComponent: () => import('./pages/admin/admin-logs/admin-logs.page').then(m => m.AdminLogsPage)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
