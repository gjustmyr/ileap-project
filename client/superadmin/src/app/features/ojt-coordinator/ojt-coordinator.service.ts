import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OjtCoordinatorService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: token as string,
    });
  }

  getAll(
    pageNo: number = 1,
    pageSize: number = 10,
    keyword: string = '',
    campusId: number | string = '',
    departmentId: number | string = ''
  ): Observable<any> {
    const headers = this.getHeaders();

    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword);

    if (campusId) {
      params = params.set('campus_id', campusId.toString());
    }

    if (departmentId) {
      params = params.set('department_id', departmentId.toString());
    }

    return this.http
      .get(`${this.baseURL}/ojt-coordinators`, { headers, params })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching OJT coordinators:', err);
          return of(null);
        })
      );
  }

  register(coordinatorData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post(`${this.baseURL}/ojt-coordinators/register`, coordinatorData, {
        headers,
      })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error registering OJT coordinator:', err);
          return of(null);
        })
      );
  }

  update(userId: number, coordinatorData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .patch(`${this.baseURL}/ojt-coordinators/${userId}`, coordinatorData, {
        headers,
      })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error updating OJT coordinator:', err);
          return of(null);
        })
      );
  }

  sendNewPassword(userId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post(
        `${this.baseURL}/ojt-coordinators/${userId}/send-new-password`,
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
