import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DropdownsService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getActiveCampuses(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http.get(`${this.baseURL}/dropdown/campuses`, { headers }).pipe(
      map((res: any) => res?.data || []),
      catchError((error) => {
        console.error('Failed to fetch active campuses:', error);
        return of([]);
      })
    );
  }

  getActiveDepartments(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http
      .get(`${this.baseURL}/dropdown/departments`, { headers })
      .pipe(
        map((res: any) => res?.data || []),
        catchError((error) => {
          console.error('Failed to fetch active departments:', error);
          return of([]);
        })
      );
  }

  // OJT Head: campuses assigned to current user
  getMyCampuses(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });
    return this.http
      .get(`${this.baseURL}/ojt-heads/me/campuses`, { headers })
      .pipe(
        map((res: any) => res?.data || res?.campuses || []),
        catchError((error) => {
          console.error('Failed to fetch my campuses:', error);
          return of([]);
        })
      );
  }

  // OJT Head: departments filtered by campus
  getDepartmentsByCampus(campusId: number): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });
    return this.http
      .get(`${this.baseURL}/departments`, {
        headers,
        params: { campus_id: campusId.toString() },
      })
      .pipe(
        map((res: any) => {
          console.log('Departments response:', res);
          return res?.data?.departments || res?.data || [];
        }),
        catchError((error) => {
          console.error('Failed to fetch departments by campus:', error);
          return of([]);
        })
      );
  }

  getActiveDepartmentsByUserDropdown(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http
      .get(`${this.baseURL}/dropdown/departments-by-user`, { headers })
      .pipe(
        map((res: any) => res?.data || []),
        catchError((error) => {
          console.error('Failed to fetch active departments:', error);
          return of([]);
        })
      );
  }

  getActiveIndustries(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
    return this.http
      .get(`${this.baseURL}/industries`, {
        headers,
        params: { page: 1, per_page: 100 },
      })
      .pipe(
        map((res: any) => {
          const industries = res?.industries || res?.data || [];
          return industries.filter(
            (i: any) => (i.status || 'active') === 'active'
          );
        }),
        catchError((error) => {
          console.error('Failed to fetch active industries:', error);
          return of([]);
        })
      );
  }

  getSkills(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http.get(`${this.baseURL}/dropdown/skills`, { headers }).pipe(
      map((res: any) => res?.data || []),
      catchError((error) => {
        console.error('Failed to fetch skills:', error);
        return of([]);
      })
    );
  }

  getPrograms(departmentId: number): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .get(`${this.baseURL}/dropdown/programs?department_id=${departmentId}`, {
        headers,
      })
      .pipe(
        map((res: any) => res?.data || []),
        catchError((error) => {
          console.error('Failed to fetch programs:', error);
          return of([]);
        })
      );
  }
}
