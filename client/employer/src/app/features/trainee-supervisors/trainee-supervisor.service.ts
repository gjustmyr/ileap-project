import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraineeSupervisorService {
  private apiUrl = `${environment.apiUrl}/supervisors`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });
  }

  getAllSupervisors(pageNo: number, pageSize: number, keyword: string): Observable<any> {
    const params: any = {
      page: pageNo.toString(),
      page_size: pageSize.toString(),
    };
    if (keyword) {
      params.keyword = keyword;
    }
    return this.http.get(this.apiUrl, { 
      headers: this.getHeaders(),
      params 
    });
  }

  createSupervisor(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { 
      headers: this.getHeaders() 
    });
  }

  updateSupervisor(supervisorId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${supervisorId}`, data, { 
      headers: this.getHeaders() 
    });
  }

  deleteSupervisor(supervisorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${supervisorId}`, { 
      headers: this.getHeaders() 
    });
  }

  sendNewPassword(supervisorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${supervisorId}/reset-password`, {}, { 
      headers: this.getHeaders() 
    });
  }
}
