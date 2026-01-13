import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @Output() tabChange = new EventEmitter<number>();

  isLoading = false;

  stats = {
    total_students: 0,
    pending_validations: 0,
    records_with_warnings: 0,
    recent_records: 0,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/dashboard/stats`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.stats = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.isLoading = false;
        },
      });
  }

  navigateToTab(tabIndex: number): void {
    this.tabChange.emit(tabIndex);
  }
}
