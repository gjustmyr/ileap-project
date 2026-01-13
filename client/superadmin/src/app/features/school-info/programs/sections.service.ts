import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  private baseURL = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getAllSections(
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

    return this.http.get(`${this.baseURL}/sections`, { headers, params }).pipe(
      map((response: any) => response),
      catchError((error: Error) => {
        console.error('Error fetching sections:', error);
        return of(null);
      })
    );
  }

  addSection(payload: {
    program_id: number;
    major_id?: number | null;
    year_level: number;
    section_name: string;
    status: string;
  }): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .post(`${this.baseURL}/sections`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error adding section:', error);
          return of({
            success: false,
            message: 'Failed to add section',
            error,
          });
        })
      );
  }

  getSectionById(sectionId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string,
    });

    return this.http
      .get(`${this.baseURL}/sections/${sectionId}`, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error: Error) => {
          console.error('Error fetching section by ID:', error);
          return of(null);
        })
      );
  }

  updateSection(
    sectionId: string,
    payload: {
      program_id: number;
      major_id?: number | null;
      year_level: number;
      section_name: string;
      status: string;
    }
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .put(`${this.baseURL}/sections/${sectionId}`, payload, { headers })
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error updating section:', error);
          return of({
            success: false,
            message: 'Failed to update section',
            error,
          });
        })
      );
  }

  toggleSectionStatus(sectionId: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    return this.http
      .put(
        `${this.baseURL}/sections/${sectionId}/toggle-status`,
        {},
        { headers }
      )
      .pipe(
        map((response: any) => response),
        catchError((error) => {
          console.error('Error toggling section status:', error);
          return of({
            success: false,
            message: 'Failed to toggle section status',
            error,
          });
        })
      );
  }
}
