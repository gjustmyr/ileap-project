import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobPlacementService {
  private baseURL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAll(
    pageNo: number,
    pageSize: number,
    keyword: string = ''
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token as string });

    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword);

    return this.http
      .get(`${this.baseURL}/jp-officers`, { headers, params })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching JPOs:', err);
          return of(null);
        })
      );
  }

  getJPOProfileByID(user_id: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token as string });

    return this.http
      .get(`${this.baseURL}/jp-officers/${user_id}`, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error fetching JPOs:', err);
          return of(null);
        })
      );
  }
  registerJPO(payload: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token as string });

    return this.http
      .post(`${this.baseURL}/jp-officers/register`, payload, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error registering JPO:', err);
          return of(null);
        })
      );
  }

  // Update JPO
  updateJPO(userId: string, data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token as string });

    return this.http
      .patch(`${this.baseURL}/jp-officers/${userId}`, data, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error updating JPO:', err);
          return of(null);
        })
      );
  }
}
