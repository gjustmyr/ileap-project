import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OjtCoordinatorService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(
    pageNo: number,
    pageSize: number,
    keyword: string = '',
    campusId: string | number = '',
    departmentId: string | number = ''
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

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
      .get(`${this.baseUrl}/ojt-coordinators`, { headers, params })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching OJT Coordinators:', err);
          return of(null);
        })
      );
  }

  getCoordinatorByID(user_id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get(`${this.baseUrl}/ojt-coordinators/${user_id}`, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching OJT Coordinator:', err);
          return of(null);
        })
      );
  }

  registerCoordinator(payload: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post(`${this.baseUrl}/ojt-coordinators/register`, payload, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error registering OJT Coordinator:', err);
          return of(null);
        })
      );
  }

  updateCoordinator(userId: string, data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .patch(`${this.baseUrl}/ojt-coordinators/${userId}`, data, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error updating OJT Coordinator:', err);
          return of(null);
        })
      );
  }

  sendNewPassword(userId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post(
        `${this.baseUrl}/ojt-coordinators/${userId}/send-new-password`,
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
