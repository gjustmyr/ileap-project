import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private apiUrl = `${environment.apiUrl}/employers`;

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

  getAll(
    page: number = 1,
    perPage: number = 10,
    keyword?: string,
    industryId?: number,
    eligibility?: string,
    status?: string
  ): Observable<any> {
    let params: any = { page, per_page: perPage };
    if (keyword) params.keyword = keyword;
    if (industryId) params.industry_id = industryId;
    if (eligibility) params.eligibility = eligibility;
    if (status) params.status = status;

    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }

  getAllEmployers(params: any): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }

  register(employerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, employerData, {
      headers: this.getHeaders(),
    });
  }

  update(employerId: number, employerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${employerId}`, employerData, {
      headers: this.getHeaders(),
    });
  }

  sendNewPassword(employerId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${employerId}/send-new-password`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getByID(employerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${employerId}`, {
      headers: this.getHeaders(),
    });
  }

  registerSimple(formData: FormData): Observable<any> {
    // Do not set Content-Type header; let browser set multipart boundary
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
    // RESTful create route (server keeps /register-simple as a backward-compatible alias)
    return this.http.post(`${this.apiUrl}`, formData, {
      headers,
    });
  }
}
