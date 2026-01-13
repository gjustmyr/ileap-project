import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InternshipsService {
  private apiUrl = `${environment.apiUrl}/internships`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllInternships(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { 
      headers: this.getHeaders(),
      params 
    });
  }

  getInternshipById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateInternshipStatus(id: number, status: string, remarks?: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      { status, remarks },
      { headers: this.getHeaders() }
    );
  }

  approveInternship(id: number): Observable<any> {
    return this.updateInternshipStatus(id, 'approved');
  }

  rejectInternship(id: number, remarks: string): Observable<any> {
    return this.updateInternshipStatus(id, 'rejected', remarks);
  }
}
