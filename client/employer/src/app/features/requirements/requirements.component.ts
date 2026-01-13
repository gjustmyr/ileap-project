import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
})
export class RequirementsComponent implements OnInit {
  environment = environment;
  requirements: any[] = [];
  filteredRequirements: any[] = [];
  filterType: string = 'all'; // 'all', 'pre', 'post'
  searchKeyword: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/requirement-templates`, { headers })
      .subscribe({
        next: (response: any) => {
          // Employer only sees templates accessible to them
          this.requirements = response.data || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading requirements:', error);
          this.isLoading = false;
          Swal.fire('Error', 'Failed to load requirements', 'error');
        },
      });
  }

  applyFilters(): void {
    this.filteredRequirements = this.requirements.filter((req) => {
      const matchesType =
        this.filterType === 'all' || req.type === this.filterType;
      const matchesSearch =
        !this.searchKeyword ||
        req.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        req.description
          ?.toLowerCase()
          .includes(this.searchKeyword.toLowerCase());
      return matchesType && matchesSearch;
    });
  }
}
