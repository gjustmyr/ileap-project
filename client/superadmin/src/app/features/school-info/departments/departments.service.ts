import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getCampuses(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http.get(`${this.baseURL}/campuses`, { headers });
  }

  getCampusById(campusId: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http.get(`${this.baseURL}/campuses/${campusId}`, { headers });
  }

  getAllDepartments(
    pageNo: number,
    pageSize: number,
    keyword: string,
    campusId: number | string
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword)
      .set('campus_id', campusId ? campusId.toString() : '');

    return this.http
      .get(`${this.baseURL}/departments`, { headers, params })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching departments:', error);
          return of(null);
        })
      );
  }

  addDepartment(payload: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .post(`${this.baseURL}/departments`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error adding department:', error);
          return of({
            success: false,
            message: 'Failed to add department',
            error,
          });
        })
      );
  }

  getDepartmentById(departmentId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .get(`${this.baseURL}/departments/${departmentId}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching department by ID:', error);
          return of(null);
        })
      );
  }

  updateDepartment(
    departmentId: string,
    payload: {
      department_name: string;
      campus_id: number;
      status: string;
    }
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(`${this.baseURL}/departments/${departmentId}`, payload, {
        headers,
      })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error updating department:', error);
          return of(null);
        })
      );
  }

  toggleDepartmentStatus(departmentId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(
        `${this.baseURL}/departments/${departmentId}/toggle-status`,
        {},
        { headers }
      )
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error toggling department status:', error);
          return of(null);
        })
      );
  }
}
