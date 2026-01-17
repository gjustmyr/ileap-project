import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService
  ) {}

  loginUser(email_address: string, password: string): Observable<any> {
    const encryptedPassword = this.encryption.encryptPassword(password);
    const payload = { email_address, password: encryptedPassword };
    return this.http.post(`${this.baseURL}/auth/supervisor/login`, payload);
  }

  validateToken(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      authorization: token,
    });
    return this.http.get(`${this.baseURL}/auth/validate-token`, { headers });
  }

  changePassword(
    user_id: string | null,
    current_password: string,
    new_password: string
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
      { headers }
    );
  }
}
