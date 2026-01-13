import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InternshipsService {
  getCompanies(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/companies`, {
      headers: this.getHeaders(),
    });
  }

  getIndustries(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/industries`, {
      headers: this.getHeaders(),
    });
  }
  private apiUrl = `${environment.apiUrl}/internships`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getHeadersForFileUpload(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    // Don't set Content-Type for file uploads - browser will set it automatically with boundary
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAvailableInternships(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`, {
      headers: this.getHeaders(),
      params,
    });
  }

  getInternshipById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  applyToInternship(internshipId: number, data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${internshipId}/apply`, data, {
      headers: this.getHeadersForFileUpload(),
    });
  }

  getMyApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-applications`, {
      headers: this.getHeaders(),
    });
  }

  withdrawApplication(applicationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/applications/${applicationId}`, {
      headers: this.getHeaders(),
    });
  }
}
