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
    return this.http.post(`${this.baseURL}/auth/superadmin/login`, payload);
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

  logout(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      return new Observable(observer => {
        observer.next({ success: true });
        observer.complete();
      });
    }
    const headers = new HttpHeaders({
      Authorization: token,
    });
    return this.http.post(`${this.baseURL}/auth/logout`, {}, { headers });
  }
}
