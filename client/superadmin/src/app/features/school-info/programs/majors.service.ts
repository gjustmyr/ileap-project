import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MajorsService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getAllMajors(
    pageNo: number,
    pageSize: number,
    keyword: string,
    programId: number | string
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword)
      .set('program_id', programId ? programId.toString() : '');

    return this.http.get(`${this.baseURL}/majors`, { headers, params }).pipe(
      map((response: any) => response),
      catchError((error: Error) => {
        console.error('Error fetching majors:', error);
        return of(null);
      })
    );
  }

  addMajor(payload: {
    program_id: number;
    major_name: string;
    abbrev?: string;
    status: string;
  }): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .post(`${this.baseURL}/majors`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error adding major:', error);
          return of({
            success: false,
            message: 'Failed to add major',
            error,
          });
        })
      );
  }

  getMajorById(majorId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .get(`${this.baseURL}/majors/${majorId}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching major by ID:', error);
          return of(null);
        })
      );
  }

  updateMajor(
    majorId: string,
    payload: {
      major_name: string;
      program_id: number;
      abbrev?: string;
      status: string;
    }
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(`${this.baseURL}/majors/${majorId}`, payload, {
        headers,
      })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error updating major:', error);
          return of(null);
        })
      );
  }

  toggleMajorStatus(majorId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(
        `${this.baseURL}/majors/${majorId}/toggle-status`,
        {},
        { headers }
      )
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error toggling major status:', error);
          return of(null);
        })
      );
  }
}
