import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/my-students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.students = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.isLoading = false;
        },
      });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
}
