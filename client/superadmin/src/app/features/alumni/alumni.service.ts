import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlumniService {
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
    programId: number | string = ''
  ): Observable<any> {
    const headers = this.getHeaders();

    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword);

    if (programId) {
      params = params.set('program_id', programId.toString());
    }

    return this.http.get(`${this.baseURL}/alumni`, { headers, params }).pipe(
      map((res: any) => res),
      catchError((err: Error) => {
        console.error('Error fetching alumni:', err);
        return of(null);
      })
    );
  }

  create(alumniData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post(`${this.baseURL}/alumni`, alumniData, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error creating alumni:', err);
          return of(null);
        })
      );
  }

  update(alumniId: number, alumniData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .put(`${this.baseURL}/alumni/${alumniId}`, alumniData, { headers })
      .pipe(
        map((res: any) => res),
        catchError((err: Error) => {
          console.error('Error updating alumni:', err);
          return of(null);
        })
      );
  }

  delete(alumniId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.delete(`${this.baseURL}/alumni/${alumniId}`, { headers }).pipe(
      map((res: any) => res),
      catchError((err: Error) => {
        console.error('Error deleting alumni:', err);
        return of(null);
      })
    );
  }
}
