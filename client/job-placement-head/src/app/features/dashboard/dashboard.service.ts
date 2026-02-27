import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardFilters {
  industry_id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/jp-officers/dashboard`;

  constructor(private http: HttpClient) {}

  getStatistics(filters: DashboardFilters = {}): Observable<any> {
    let params = new HttpParams();

    if (filters.industry_id) {
      params = params.set('industry_id', filters.industry_id.toString());
    }

    return this.http.get(`${this.apiUrl}/statistics`, { params });
  }
}
