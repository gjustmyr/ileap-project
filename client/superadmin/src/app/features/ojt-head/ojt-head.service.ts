import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OjtHeadService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(
    pageNo: number,
    pageSize: number,
    keyword: string = '',
    campusId: string | number = ''
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

    return this.http.get(`${this.baseURL}/ojt-heads`, { headers, params }).pipe(
      map((res: any) => res),
      catchError((err: Error) => {
        console.error('Error fetching OJT Heads:', err);
        return of(null);
      })
    );
  }

  getOjtHeadProfileByID(user_id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .get(`${this.baseURL}/ojt-heads/${user_id}`, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching OJT Head:', err);
          return of(null);
        })
      );
  }

  registerOjtHead(payload: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post(`${this.baseURL}/ojt-heads/register`, payload, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error registering OJT Head:', err);
          return of(null);
        })
      );
  }

  updateOjtHead(userId: string, data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .patch(`${this.baseURL}/ojt-heads/${userId}`, data, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error updating OJT Head:', err);
          return of(null);
        })
      );
  }

  sendNewPassword(userId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .post(`${this.baseURL}/ojt-heads/${userId}/send-new-password`, {}, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error sending new password:', err);
          return of(null);
        })
      );
  }
}
