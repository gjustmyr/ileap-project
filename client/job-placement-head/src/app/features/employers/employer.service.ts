import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private apiUrl = `${environment.apiUrl}/jp-officers/employers`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  getAllEmployers(params: any): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }

  registerSimple(formData: FormData): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {},
    );
    return this.http.post(`${this.apiUrl}`, formData, {
      headers,
    });
  }

  getByID(employerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${employerId}`, {
      headers: this.getHeaders(),
    });
  }

  searchAllEmployers(params: any): Observable<any> {
    // Search across all employers (not filtered by eligibility)
    const searchUrl = `${environment.apiUrl}/jp-officers/employers/search`;
    return this.http.get(searchUrl, {
      headers: this.getHeaders(),
      params,
    });
  }
}
