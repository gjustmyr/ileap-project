import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  baseUrl = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getAllEmployers(
    pageNo = 1,
    pageSize = 10,
    keyword = '',
    industryId: number | null = null
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    const params: any = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      keyword: keyword.trim(),
    };

    // Only add industry_id if it has a value
    if (industryId !== null && industryId !== undefined) {
      params.industry_id = industryId.toString();
    }

    return this.http.get(`${this.baseUrl}/employers`, { headers, params });
  }

  addEmployer(payload: {
    company_name: string;
    email: string;
    password: string;
    industry_id: number;
  }): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/employers`, payload, { headers });
  }
}
