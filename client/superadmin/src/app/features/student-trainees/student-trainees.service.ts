import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentTraineesService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: token as string,
    });
  }

  getAll(
    pageNo: number,
    pageSize: number,
    keyword: string = '',
    campusId: number | string = '',
    programId: number | string = ''
  ): Observable<any> {
    const headers = this.getHeaders();

    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword);

    if (campusId) {
      params = params.set('campus_id', campusId.toString());
    }

    if (programId) {
      params = params.set('program_id', programId.toString());
    }

    return this.http
      .get(`${this.baseURL}/student-trainees`, { headers, params })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching student trainees:', err);
          return of(null);
        })
      );
  }

  sendNewPassword(userId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post(
        `${this.baseURL}/student-trainees/${userId}/send-new-password`,
        {},
        { headers }
      )
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error sending new password:', err);
          return of(null);
        })
      );
  }
}
