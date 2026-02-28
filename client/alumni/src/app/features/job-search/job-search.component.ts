import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css'],
})
export class JobSearchComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  searchQuery = '';
  loading = true;
  showApplyDialog = false;
  selectedJob: any = null;
  coverLetter = '';
  applying = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http.get(`${environment.apiUrl}/alumni/jobs`, { headers }).subscribe({
      next: (response: any) => {
        this.jobs = response.data || [];
        this.filteredJobs = this.jobs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
        this.loading = false;
      },
    });
  }

  searchJobs(): void {
    if (!this.searchQuery.trim()) {
      this.filteredJobs = this.jobs;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.full_description.toLowerCase().includes(query),
    );
  }

  openApplyDialog(job: any): void {
    this.selectedJob = job;
    this.coverLetter = '';
    this.showApplyDialog = true;
  }

  closeApplyDialog(): void {
    this.showApplyDialog = false;
    this.selectedJob = null;
    this.coverLetter = '';
  }

  applyForJob(): void {
    if (!this.coverLetter.trim()) {
      Swal.fire({
        title: 'Required',
        text: 'Please provide a cover letter',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    this.applying = true;
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    const payload = {
      internship_id: this.selectedJob.internship_id,
      cover_letter: this.coverLetter,
    };

    this.http
      .post(`${environment.apiUrl}/alumni/jobs/apply`, payload, { headers })
      .subscribe({
        next: () => {
          this.applying = false;
          this.closeApplyDialog();
          Swal.fire({
            title: 'Success!',
            text: 'Application submitted successfully',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
        },
        error: (err) => {
          this.applying = false;
          Swal.fire({
            title: 'Error',
            text: err.error?.detail || 'Failed to submit application',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        },
      });
  }
}
