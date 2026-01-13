import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: this.getHeaders() });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiUrl}/profile/picture`, formData, { headers });
  }

  getAllSkills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/skills`);
  }

  addSkill(skillName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/skills`, { skill_name: skillName }, { headers: this.getHeaders() });
  }

  removeSkill(skillId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/skills/${skillId}`, { headers: this.getHeaders() });
  }

  getClassInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/class-info`, { headers: this.getHeaders() });
  }
}
