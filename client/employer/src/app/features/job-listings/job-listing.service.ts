import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobListingService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch all internships with optional query params
  getAllInternships(
    pageNo: number,
    pageSize: number,
    keyword: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize)
      .set('keyword', keyword || '');

    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.get<any>(`${this.baseUrl}/internships`, {
      params,
      headers,
    });
  }

  // ✅ Create a new internship
  createInternship(data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.baseUrl}/internships`, data, {
      headers,
    });
  }

  // Get employer profile
  getEmployerProfile(): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.get<any>(`${this.baseUrl}/employers/me`, {
      headers,
    });
  }

  // Get all skills for autocomplete
  getAllSkills(keyword: string = ''): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';
    
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.get<any>(`${this.baseUrl}/internships/skills`, { 
      params,
      headers 
    });
  }

  // Update an internship
  updateInternship(id: number, data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(`${this.baseUrl}/internships/${id}`, data, {
      headers,
    });
  }

  // // Get a single internship by ID
  // getInternshipById(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/${id}`);
  // }

  // // Create a new internship
  // createInternship(data: any): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, data);
  // }

  // // Update an internship
  // updateInternship(id: number, data: any): Observable<any> {
  //   return this.http.patch<any>(`${this.baseUrl}/${id}`, data);
  // }

  // // Delete an internship
  // deleteInternship(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/${id}`);
  // }
}
