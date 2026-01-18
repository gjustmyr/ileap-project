import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private encryption: EncryptionService,
  ) {}

  loginUser(email_address: string, password: string): Observable<any> {
    const encryptedPassword = this.encryption.encryptPassword(password);
    const payload = { email_address, password: encryptedPassword };
    return this.http.post(`${this.baseURL}/auth/head/login`, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/forgot-password`, {
      email_address: email,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/reset-password`, {
      token,
      new_password: newPassword,
    });
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });
    return this.http.post(
      `${this.baseURL}/auth/change-password`,
      { current_password: currentPassword, new_password: newPassword },
      { headers },
    );
  }

  validateToken(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get(`${this.baseURL}/auth/validate-token`, { headers });
  }

  changePassword(
    user_id: string | null,
    current_password: string,
    new_password: string,
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = {
      Authorization: token as string,
    };

    return this.http.patch(
      `${this.baseURL}/auth/change-password`,
      {
        user_id,
        current_password,
        new_password,
      },
      { headers },
    );
  }

  logout(): void {
    const token = sessionStorage.getItem('auth_token');

    // Call backend logout endpoint to invalidate token immediately
    if (token) {
      const headers = new HttpHeaders({
        Authorization: token,
      });

      this.http.post(`${this.baseURL}/auth/logout`, {}, { headers }).subscribe({
        next: () => {
          console.log('✅ Token invalidated on server');
        },
        error: (err) => {
          console.warn(
            '⚠️ Logout API failed (continuing with client-side logout):',
            err,
          );
        },
      });
    }

    // Clear all session storage data
    sessionStorage.clear();

    // Clear any local storage data if used
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('auth_token');
    return !!token;
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  getUserInfo(): any {
    const userInfo = sessionStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }
}
