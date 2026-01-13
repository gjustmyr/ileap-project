import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {
  private apiUrl = `${environment.apiUrl}/superadmin/industries`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // Try sessionStorage first, fallback to localStorage
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(
    page: number = 1,
    perPage: number = 10,
    keyword?: string
  ): Observable<any> {
    let params: any = { page, per_page: perPage };
    if (keyword) params.keyword = keyword;

    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params,
    });
  }

  create(industryData: any): Observable<any> {
    return this.http.post(this.apiUrl, industryData, {
      headers: this.getHeaders(),
    });
  }

  update(industryId: number, industryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${industryId}`, industryData, {
      headers: this.getHeaders(),
    });
  }

  delete(industryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${industryId}`, {
      headers: this.getHeaders(),
    });
  }

  getByID(industryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${industryId}`, {
      headers: this.getHeaders(),
    });
  }
}
