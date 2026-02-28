import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css'],
})
export class JobApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading = true;
  showViewDialog = false;
  selectedApplication: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/alumni/applications`, { headers })
      .subscribe({
        next: (response: any) => {
          this.applications = response.data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load applications', err);
          this.loading = false;
        },
      });
  }

  viewApplication(application: any): void {
    this.selectedApplication = application;
    this.showViewDialog = true;
  }

  closeViewDialog(): void {
    this.showViewDialog = false;
    this.selectedApplication = null;
  }
}
