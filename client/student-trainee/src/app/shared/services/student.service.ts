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

  updateProfile(data: any, profilePicture?: File): Observable<any> {
    const formData = new FormData();
    
    // Add profile data as JSON string
    if (data) {
      formData.append('profile_data', JSON.stringify(data));
    }
    
    // Add profile picture if provided
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type, let browser set it with boundary for multipart/form-data
    });
    
    return this.http.put(`${this.apiUrl}/profile`, formData, { headers });
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
