import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OjtMonitoringService {
  private apiUrl = `${environment.apiUrl}/internships`;
  private employerUrl = `${environment.apiUrl}/employers`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getOngoingOjts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employer/ongoing-ojts`, {
      headers: this.getHeaders(),
    });
  }

  getSupervisors(): Observable<any> {
    return this.http.get(`${this.employerUrl}/supervisors`, {
      headers: this.getHeaders(),
    });
  }

  assignSupervisor(
    studentId: number,
    supervisorId: number,
    applicationId: number
  ): Observable<any> {
    const formData = new FormData();
    formData.append('student_id', studentId.toString());
    formData.append('supervisor_id', supervisorId.toString());
    formData.append('application_id', applicationId.toString());

    return this.http.post(`${this.employerUrl}/assign-supervisor`, formData, {
      headers: this.getHeaders(),
    });
  }
}
