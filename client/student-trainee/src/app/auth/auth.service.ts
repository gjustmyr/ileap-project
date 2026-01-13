import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loginUser(email_address: string, password: string): Observable<any> {
    const payload = { email_address, password, role: 'student' };
    return this.http.post(`${this.baseURL}/auth/login`, payload);
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
}
