import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampusesService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getAllCampuses(
    pageNo: number,
    pageSize: number,
    keyword: string
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('keyword', keyword);
    return this.http.get(`${this.baseURL}/campuses`, { headers, params }).pipe(
      map((response: any) => response),
      catchError((error: Error) => {
        console.error('Error fetching campuses:', error);
        return of(null);
      })
    );
  }

  addCampus(payload: {
    campus_name: string;
    is_extension: boolean;
    parent_campus_id?: number;
  }): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    const finalPayload = { ...payload, status: 'active' };
    return this.http
      .post(`${this.baseURL}/campuses`, finalPayload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error adding campus:', error);
          return of(null);
        })
      );
  }

  // ✅ Get main campuses for dropdown
  getMainCampuses(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });
    return this.http
      .get(`${this.baseURL}/campuses/main/list`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching main campuses:', error);
          return of(null);
        })
      );
  }

  // ✅ Get campus by ID
  getCampusById(campusId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .get(`${this.baseURL}/campuses/${campusId}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching campus by ID:', error);
          return of(null);
        })
      );
  }

  // ✅ Update campus
  updateCampus(
    campusId: string,
    payload: {
      campus_name: string;
      is_extension: boolean;
      parent_campus_id?: number;
      status: string;
    }
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(`${this.baseURL}/campuses/${campusId}`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error updating campus:', error);
          return of(null);
        })
      );
  }

  toggleCampusStatus(campusId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .put(
        `${this.baseURL}/campuses/${campusId}/toggle-status`,
        {},
        { headers }
      )
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error toggling campus status:', error);
          return of(null);
        })
      );
  }
}
