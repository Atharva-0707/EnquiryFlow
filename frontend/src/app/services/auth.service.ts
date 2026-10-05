import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ILoginResponse, IUser } from '../model/interface/master.Model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'enquiry_jwt_token';
  private readonly USER_KEY = 'enquiry_current_user';
  private readonly LEGACY_KEY = 'enquiryApp';

  private currentUserSubject = new BehaviorSubject<IUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getStoredUser(): IUser | null {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  get currentUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  get username(): string {
    return this.currentUser?.name || this.currentUser?.email || localStorage.getItem(this.LEGACY_KEY) || 'Admin';
  }

  get role(): string {
    return this.currentUser?.role || 'employee';
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: { email?: string; username?: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        if (response?.success && response?.token) {
          this.saveSession(response.token, response.user);
        }
      })
    );
  }

  register(userData: { name: string; email: string; password: string; role?: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${environment.apiBaseUrl}/auth/register`, userData).pipe(
      tap((response) => {
        if (response?.success && response?.token) {
          this.saveSession(response.token, response.user);
        }
      })
    );
  }

  private saveSession(token: string, user: IUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.LEGACY_KEY, user.name || user.email);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.LEGACY_KEY);
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login');
  }

  hasRole(requiredRole: string): boolean {
    return this.role === requiredRole;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return true;
      const payload = JSON.parse(atob(payloadBase64));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return false;
    }
  }
}
