import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

const TOKEN_KEY = 'dcs_rate_portal_token';
const USER_KEY = 'dcs_rate_portal_user';
const TOKEN_EXPIRY_KEY = 'dcs_rate_portal_token_expiry';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  setTokenExpiry(expiry: number): void {
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  }

  removeTokenExpiry(): void {
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
    this.removeTokenExpiry();
  }

  clear(): void {
    this.clearAuth();
  }
}
