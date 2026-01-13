import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

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
  getActiveIndustries(): Observable<any[]> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http
      .get(`${this.baseURL}/dropdown/industries`, { headers })
      .pipe(
        map((res: any) => res?.data || []),
        catchError((error) => {
          console.error('Failed to fetch active departments:', error);
          return of([]);
        })
      );
  }

  /**
   * 🆕 Optional: Get departments by campus ID
   */
}
