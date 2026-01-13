import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-listing',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.css',
  standalone: true,
})
export class JobListingComponent implements OnInit {
  internships: any[] = [];
  filteredInternships: any[] = [];
  isLoadingInternships: boolean = false;
  internshipIndustries: any[] = [];
  internshipCompanies: any[] = [];

  internshipFilters = {
    searchKeyword: '',
    industry: null,
    company: null,
    status: null,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships(): void {
    this.isLoadingInternships = true;

    this.http.get<any>(`${environment.apiUrl}/internships`).subscribe({
      next: (response) => {
        this.internships = response.data || [];
        this.filteredInternships = [...this.internships];
        this.extractInternshipFiltersData();
        this.isLoadingInternships = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        this.isLoadingInternships = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load internship opportunities',
          confirmButtonColor: '#10b981',
        });
      },
    });
  }

  extractInternshipFiltersData(): void {
    // Extract unique industries
    const industriesMap = new Map();
    this.internships.forEach((internship) => {
      if (internship.industry_id && internship.industry_name) {
        industriesMap.set(internship.industry_id, {
          industry_id: internship.industry_id,
          industry_name: internship.industry_name,
        });
      }
    });
    this.internshipIndustries = Array.from(industriesMap.values());

    // Extract unique companies
    const companiesMap = new Map();
    this.internships.forEach((internship) => {
      if (internship.employer_id && internship.company_name) {
        companiesMap.set(internship.employer_id, {
          employer_id: internship.employer_id,
          company_name: internship.company_name,
        });
      }
    });
    this.internshipCompanies = Array.from(companiesMap.values());
  }

  applyInternshipFilters(): void {
    this.filteredInternships = this.internships.filter((internship) => {
      // Search filter
      if (this.internshipFilters.searchKeyword) {
        const keyword = this.internshipFilters.searchKeyword.toLowerCase();
        const matchesSearch =
          internship.title?.toLowerCase().includes(keyword) ||
          internship.company_name?.toLowerCase().includes(keyword) ||
          internship.description?.toLowerCase().includes(keyword);
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (this.internshipFilters.industry !== null) {
        if (internship.industry_id !== this.internshipFilters.industry)
          return false;
      }

      // Company filter
      if (this.internshipFilters.company !== null) {
        if (internship.employer_id !== this.internshipFilters.company)
          return false;
      }

      // Status filter
      if (this.internshipFilters.status !== null) {
        if (internship.status !== this.internshipFilters.status) return false;
      }

      return true;
    });

    Swal.fire({
      icon: 'success',
      title: 'Filters Applied',
      text: `Found ${this.filteredInternships.length} internship opportunities`,
      confirmButtonColor: '#10b981',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  resetInternshipFilters(): void {
    this.internshipFilters = {
      searchKeyword: '',
      industry: null,
      company: null,
      status: null,
    };
    this.filteredInternships = [...this.internships];

    Swal.fire({
      icon: 'info',
      title: 'Filters Reset',
      text: 'All filters have been reset',
      confirmButtonColor: '#10b981',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  viewInternshipDetails(internship: any): void {
    Swal.fire({
      title: `<h2 class="text-2xl text-gray-900 poppins-semibold mb-1">${internship.title}</h2>`,
      html: `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <i class="pi pi-building text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-sm text-gray-600 poppins-medium">Company</p>
              <p class="text-base text-gray-900 poppins-semibold">${
                internship.company_name
              }</p>
            </div>
          </div>
        </div>
        
        <div class="text-left">
          <div class="space-y-4">
            <!-- Industry & Status Row -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2 poppins-semibold">Industry</p>
                <p class="text-sm text-gray-900 poppins-medium">${
                  internship.industry_name || 'Not Specified'
                }</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2 poppins-semibold">Status</p>
                <span class="inline-block px-3 py-1 rounded-full text-xs poppins-semibold ${
                  internship.status === 'open'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }">
                  ${internship.status === 'open' ? 'Currently Open' : 'Closed'}
                </span>
              </div>
            </div>
            
            <!-- Location -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-2 poppins-semibold">
                <i class="pi pi-map-marker mr-1"></i>Location
              </p>
              <p class="text-sm text-gray-900 poppins-medium">${
                internship.address || 'Batangas City, Philippines'
              }</p>
            </div>
            
            <!-- Duration & Posted Date Row -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2 poppins-semibold">
                  <i class="pi pi-clock mr-1"></i>Duration
                </p>
                <p class="text-sm text-gray-900 poppins-medium">${
                  internship.duration_months
                } Months</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2 poppins-semibold">
                  <i class="pi pi-calendar mr-1"></i>Posted Date
                </p>
                <p class="text-sm text-gray-900 poppins-medium">${new Date(
                  internship.created_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
            </div>
            
            <!-- Description -->
            <div class="bg-white rounded-lg p-4 border-2 border-gray-200">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-3 poppins-semibold">Position Description</p>
              <div class="text-sm text-gray-700 leading-relaxed poppins-regular">
                ${
                  internship.description ||
                  '<p class="text-gray-500 italic">No description available for this position.</p>'
                }
              </div>
            </div>
          </div>
        </div>
      `,
      width: '700px',
      showCloseButton: true,
      confirmButtonText: 'Close Details',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-xl shadow-2xl border border-gray-200',
        title: 'p-6 pb-4 border-b border-gray-200 text-left',
        closeButton:
          'text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors',
        htmlContainer: 'p-6 pt-4 text-left max-h-[60vh] overflow-y-auto',
        actions: 'px-6 pb-6 pt-4 border-t border-gray-200 flex justify-end',
        confirmButton:
          'px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg poppins-medium text-sm transition-colors shadow-sm',
      },
    });
  }
}
