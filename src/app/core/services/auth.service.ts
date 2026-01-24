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
    const token = this.storage.getToken();
    const user = this.storage.getUser();
    const expiry = this.storage.getTokenExpiry();

    if (token && user && expiry) {
      if (Date.now() < expiry) {
        this.currentUser.set(user);
        this.tokenExpiry.set(expiry);
      } else {
        this.clearAuth();
      }
    }
  }

  register(data: RegisterData): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('auth/register', data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', data).pipe(
      tap(response => {
        const expiry = Date.now() + (response.expiresIn * 1000);
        this.storage.setToken(response.token);
        this.storage.setUser(response.user);
        this.storage.setTokenExpiry(expiry);
        this.currentUser.set(response.user);
        this.tokenExpiry.set(expiry);
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
