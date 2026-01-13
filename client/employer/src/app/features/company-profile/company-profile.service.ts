import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Get employer profile by user ID
  getEmployerProfile(): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.get<any>(`${this.baseUrl}/employers/profile`, { headers });
  }

  updateEmployerProfile(payload: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json',
    });

    return this.http.patch<any>(`${this.baseUrl}/employers/profile`, payload, {
      headers,
    });
  }
}
