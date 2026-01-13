import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getAllPrograms(
    pageNo: number,
    pageSize: number,
    keyword: string,
    departmentId: number | string
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword)
      .set('department_id', departmentId ? departmentId.toString() : '');

    return this.http.get(`${this.baseURL}/programs`, { headers, params }).pipe(
      map((response: any) => response),
      catchError((error: Error) => {
        console.error('Error fetching programs:', error);
        return of(null);
      })
    );
  }

  addProgram(payload: {
    department_id: number;
    program_name: string;
    abbrev?: string;
    status: string;
  }): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .post(`${this.baseURL}/programs`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error adding program:', error);
          return of({
            success: false,
            message: 'Failed to add program',
            error,
          });
        })
      );
  }

  getProgramById(programId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .get(`${this.baseURL}/programs/${programId}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching program by ID:', error);
          return of(null);
        })
      );
  }

  updateProgram(
    programId: string,
    payload: {
      program_name: string;
      department_id: number;
      abbrev?: string;
      status: string;
    }
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(`${this.baseURL}/programs/${programId}`, payload, {
        headers,
      })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error updating program:', error);
          return of(null);
        })
      );
  }

  toggleProgramStatus(programId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(
        `${this.baseURL}/programs/${programId}/toggle-status`,
        {},
        { headers }
      )
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error toggling program status:', error);
          return of(null);
        })
      );
  }
}
