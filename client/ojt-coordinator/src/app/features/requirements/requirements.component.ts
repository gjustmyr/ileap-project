import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.css',
})
export class RequirementsComponent implements OnInit {
  environment = environment;

  // Template downloads
  requirementTemplates: any[] = [];
  filteredTemplates: any[] = [];

  // Filters
  filters = {
    searchTerm: '',
    type: null as string | null,
    required: null as boolean | null,
  };

  // Pagination
  pageNo: number = 1;
  pageSize: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequirementTemplates();
  }

  loadRequirementTemplates(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/requirement-templates`, { headers })
      .subscribe({
        next: (response: any) => {
          this.requirementTemplates = response.data || [];
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading templates:', error);
        },
      });
  }

  applyFilters(): void {
    this.filteredTemplates = this.requirementTemplates.filter((template) => {
      const matchesSearch =
        !this.filters.searchTerm ||
        template.title
          ?.toLowerCase()
          .includes(this.filters.searchTerm.toLowerCase()) ||
        template.description
          ?.toLowerCase()
          .includes(this.filters.searchTerm.toLowerCase());

      const matchesType =
        this.filters.type === null || template.type === this.filters.type;

      const matchesRequired =
        this.filters.required === null ||
        template.is_required === this.filters.required;

      return matchesSearch && matchesType && matchesRequired;
    });

    // Reset to first page when filters change
    this.pageNo = 1;
  }

  resetFilters(): void {
    this.filters = {
      searchTerm: '',
      type: null,
      required: null,
    };
    this.applyFilters();
  }

  // Pagination methods
  getPaginatedTemplates(): any[] {
    const startIndex = (this.pageNo - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredTemplates.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredTemplates.length / this.pageSize);
  }

  getShowingStart(): number {
    return this.filteredTemplates.length === 0
      ? 0
      : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.filteredTemplates.length
      ? this.filteredTemplates.length
      : end;
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
    }
  }

  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
    }
  }

  previewTemplate(template: any): void {
    // template_url is already a full URL from backend
    window.open(template.template_url, '_blank');
  }

  downloadTemplate(template: any): void {
    // template_url is already a full URL from backend
    const link = document.createElement('a');
    link.href = template.template_url;
    link.download = template.title || 'template';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
