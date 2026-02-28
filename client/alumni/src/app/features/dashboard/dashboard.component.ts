import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalJobs: number = 0;
  activeApplications: number = 0;
  pendingApplications: number = 0;
  acceptedApplications: number = 0;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/alumni/dashboard/stats`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.totalJobs = response.data.totalJobs || 0;
            this.activeApplications = response.data.activeApplications || 0;
            this.pendingApplications = response.data.pendingApplications || 0;
            this.acceptedApplications = response.data.acceptedApplications || 0;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load stats', err);
          this.loading = false;
        },
      });
  }
}
