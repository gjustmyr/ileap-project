import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  private apiUrl = `${environment.apiUrl}/requirements`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all requirements submissions for coordinator's classes
  getStudentRequirements(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/submissions`, { 
      headers: this.getHeaders(),
      params 
    });
  }

  // Get requirements for a specific student
  getStudentRequirementById(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`, { 
      headers: this.getHeaders() 
    });
  }

  // Approve a requirement
  approveRequirement(requirementId: number, remarks?: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requirementId}/approve`,
      { remarks },
      { headers: this.getHeaders() }
    );
  }

  // Reject a requirement
  rejectRequirement(requirementId: number, remarks: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${requirementId}/reject`,
      { remarks },
      { headers: this.getHeaders() }
    );
  }

  // Approve all requirements for a student
  approveAllRequirements(studentId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/student/${studentId}/approve-all`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
