import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private apiUrl = `${environment.apiUrl}/internships`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getApplications(internshipId?: number, status?: string): Observable<any> {
    let params: any = {};
    if (internshipId) params.internship_id = internshipId;
    if (status) params.status_filter = status;

    return this.http.get(`${this.apiUrl}/applications`, {
      headers: this.getHeaders(),
      params,
    });
  }

  updateApplicationStatus(
    applicationId: number,
    status: string,
    remarks?: string,
    ojtStartDate?: string | null,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('status', status);
    if (remarks) formData.append('remarks', remarks);
    if (ojtStartDate) formData.append('ojt_start_date', ojtStartDate);

    return this.http.put(
      `${this.apiUrl}/applications/${applicationId}/status`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
        }),
      },
    );
  }

  setOjtStartDate(applicationId: number, startDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('ojt_start_date', startDate);

    return this.http.put(
      `${this.apiUrl}/applications/${applicationId}/start-date`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
        }),
      },
    );
  }
}
