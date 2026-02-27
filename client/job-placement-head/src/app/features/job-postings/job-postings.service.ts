import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobPostingsService {
  private apiUrl = `${environment.apiUrl}/jp-officers/employers/job-postings`;

  constructor(private http: HttpClient) {}

  getAllJobPostings(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ''
      ) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  getJobPostingById(postingId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postingId}`);
  }

  updateJobPostingStatus(postingId: number, statusData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postingId}/status`, statusData);
  }
}
