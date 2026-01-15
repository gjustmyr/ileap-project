import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardFilters {
  campus_id?: number;
  program_id?: number;
  industry_id?: number;
  semester?: string;
  school_year?: string;
  company_id?: number;
  location?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://54.160.137.135:8000/api/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      Authorization: token,
    });
  }

  getStatistics(filters: DashboardFilters = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof DashboardFilters];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/statistics`, {
      params,
      headers: this.getHeaders(),
    });
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter-options`, {
      headers: this.getHeaders(),
    });
  }
}
