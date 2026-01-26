import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, AuthResponse, RegisterData, LoginData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private tokenExpiry = signal<number | null>(null);

  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.isAdmin ?? false);

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    console.log('[AuthService] Loading stored user...');
    const loadStart = performance.now();

    const token = this.storage.getToken();
    const user = this.storage.getUser();
    const expiry = this.storage.getTokenExpiry();

    console.log('[AuthService] Token exists:', !!token);
    console.log('[AuthService] User exists:', !!user);
    console.log('[AuthService] Expiry:', expiry ? new Date(expiry).toISOString() : 'N/A');

    if (token && user && expiry) {
      if (Date.now() < expiry) {
        console.log('[AuthService] Token valid, restoring session');
        this.currentUser.set(user);
        this.tokenExpiry.set(expiry);
      } else {
        console.log('[AuthService] Token expired, clearing auth');
        this.clearAuth();
      }
    }

    console.log(`[AuthService] loadStoredUser completed: ${(performance.now() - loadStart).toFixed(2)}ms`);
  }

  register(data: RegisterData): Observable<{ message: string }> {
    console.log('[AuthService] Registering user:', data.email);
    return this.api.post<{ message: string }>('auth/register', data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    const loginStart = performance.now();
    console.log('========================================');
    console.log('[AuthService] LOGIN START');
    console.log('[AuthService] Email:', data.email);
    console.log('[AuthService] Time:', new Date().toISOString());
    console.log('========================================');

    return this.api.post<AuthResponse>('auth/login', data).pipe(
      tap(response => {
        const apiTime = performance.now() - loginStart;
        console.log(`[AuthService] API Response received: ${apiTime.toFixed(2)}ms`);
        console.log('[AuthService] User ID:', response.user.id);
        console.log('[AuthService] User Role:', response.user.role);

        const storageStart = performance.now();
        const expiry = Date.now() + (response.expiresIn * 1000);
        this.storage.setToken(response.token);
        this.storage.setUser(response.user);
        this.storage.setTokenExpiry(expiry);
        this.currentUser.set(response.user);
        this.tokenExpiry.set(expiry);
        console.log(`[AuthService] Storage operations: ${(performance.now() - storageStart).toFixed(2)}ms`);

        const totalTime = performance.now() - loginStart;
        console.log('========================================');
        console.log('[AuthService] LOGIN SUCCESS');
        console.log(`[AuthService] Total time: ${totalTime.toFixed(2)}ms`);
        console.log('========================================');
      }),
      catchError(err => {
        const totalTime = performance.now() - loginStart;
        console.log('========================================');
        console.log('[AuthService] LOGIN ERROR');
        console.log('[AuthService] Status:', err.status);
        console.log('[AuthService] Error:', err.error?.error?.code || 'UNKNOWN');
        console.log('[AuthService] Message:', err.error?.error?.message || err.message);
        console.log(`[AuthService] Total time: ${totalTime.toFixed(2)}ms`);
        console.log('[AuthService] Full error:', JSON.stringify(err.error, null, 2));
        console.log('========================================');
        return throwError(() => err);
      })
    );
  }

  activate(token: string): Observable<{ message: string; user: User }> {
    return this.api.get<{ message: string; user: User }>(`auth/activate/${token}`);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/reset-password', { token, password });
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    this.storage.clearAuth();
    this.currentUser.set(null);
    this.tokenExpiry.set(null);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  refreshUserFromStorage(): void {
    const user = this.storage.getUser();
    if (user) {
      this.currentUser.set(user);
    }
  }

  updateStoredUser(user: User): void {
    this.storage.setUser(user);
    this.currentUser.set(user);
  }
}
