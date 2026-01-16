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
  expandedStudentId: number | null = null;
  studentDetails: Map<number, any> = new Map();

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

  toggleStudentDetails(studentId: number): void {
    if (this.expandedStudentId === studentId) {
      this.expandedStudentId = null;
    } else {
      this.expandedStudentId = studentId;
      if (!this.studentDetails.has(studentId)) {
        this.loadStudentOjtDetails(studentId);
      }
    }
  }

  loadStudentOjtDetails(studentId: number): void {
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/students/${studentId}/ojt-details`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.studentDetails.set(studentId, response.data);
          }
        },
        error: (error) => {
          console.error('Error loading student OJT details:', error);
        },
      });
  }

  getStudentDetails(studentId: number): any {
    return this.studentDetails.get(studentId);
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
}
