import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oeams',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './oeams.component.html',
  styleUrl: './oeams.component.css',
})
export class OeamsComponent implements OnInit {
  hasOJTStarted: boolean = false;
  todayLog: any = null;
  tasks: string = '';
  accomplishments: string = '';
  isSaving: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkOJTStatus();
    this.loadTodayLog();
  }

  checkOJTStatus(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http
      .get(`${environment.apiUrl}/students/hiring-status`, { headers })
      .subscribe({
        next: (response: any) => {
          this.hasOJTStarted = response.has_ojt_started || false;
        },
        error: (error) => {
          console.error('Error checking OJT status:', error);
        },
      });
  }

  loadTodayLog(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http.get(`${environment.apiUrl}/oeams/today`, { headers }).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.todayLog = response.data;
          this.tasks = this.todayLog.tasks || '';
          this.accomplishments = this.todayLog.accomplishments || '';
        }
      },
      error: (error) => {
        console.error('Error loading today log:', error);
      },
    });
  }

  timeIn(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
      'Content-Type': 'application/json',
    });

    this.http
      .post(`${environment.apiUrl}/oeams/time-in`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Time In Recorded',
              text: response.message,
              timer: 2000,
              showConfirmButton: false,
            });
            this.loadTodayLog();
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.detail || 'Failed to record time in',
          });
        },
      });
  }

  timeOut(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
      'Content-Type': 'application/json',
    });

    this.http
      .post(`${environment.apiUrl}/oeams/time-out`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Time Out Recorded',
              text: `Total hours: ${response.data.total_hours} hrs`,
              timer: 2000,
              showConfirmButton: false,
            });
            this.loadTodayLog();
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.detail || 'Failed to record time out',
          });
        },
      });
  }

  saveAccomplishments(): void {
    if (!this.tasks && !this.accomplishments) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Fields',
        text: 'Please enter tasks or accomplishments before saving',
      });
      return;
    }

    this.isSaving = true;
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
      'Content-Type': 'application/json',
    });

    const body = {
      tasks: this.tasks,
      accomplishments: this.accomplishments,
    };

    this.http
      .post(`${environment.apiUrl}/oeams/save-accomplishments`, body, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          this.isSaving = false;
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Saved',
              text: response.message,
              timer: 2000,
              showConfirmButton: false,
            });
            this.loadTodayLog();
          }
        },
        error: (error) => {
          this.isSaving = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.detail || 'Failed to save accomplishments',
          });
        },
      });
  }
}
