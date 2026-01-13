import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { InternshipsService } from './internships.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    TextareaModule,
  ],
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css',
})
export class InternshipsComponent implements OnInit {
  internships: any[] = [];
  selectedInternship: any = null;
  isLoading = false;
  bookmarkedInternships: number[] = []; // Store bookmarked internship IDs
  showBookmarksOnly: boolean = false;

  // Dialog states
  showViewDialog = false;
  showApplyDialog = false;
  applicationLetter = '';
  selectedResume: File | null = null;

  // Search and Filters
  searchKeyword = '';
  selectedCompany = '';
  selectedCompanyId: string = '';
  selectedIndustry = '';
  companies: any[] = [];
  industries: any[] = [];

  applyFilters(): void {
    this.loadInternships();
  }

  constructor(
    private internshipsService: InternshipsService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadIndustries();
    this.loadInternships();
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarkedInternships');
    if (saved) {
      this.bookmarkedInternships = JSON.parse(saved);
    }
  }

  loadCompanies(): void {
    this.internshipsService.getCompanies().subscribe({
      next: (res) => {
        this.companies = (res.data || res || []).map((c: any) => ({
          ...c,
          selected: false,
        }));
      },
      error: (err) => {
        console.error('Error loading companies:', err);
      },
    });
  }

  loadIndustries(): void {
    this.internshipsService.getIndustries().subscribe({
      next: (res) => {
        this.industries = (res.industries || res.data || res || []).map((i: any) => ({
          ...i,
          selected: false,
        }));
      },
      error: (err) => {
        console.error('Error loading industries:', err);
      },
    });
  }

  loadInternships(): void {
    this.isLoading = true;
    const params: any = {};
    // Smart search
    if (this.searchKeyword) params.search = this.searchKeyword;
    // Companies (multi-select)
    const selectedCompanyIds = this.companies
      .filter((c) => c.selected)
      .map((c) => c.employer_id);
    if (selectedCompanyIds.length > 0)
      params.company = selectedCompanyIds.join(',');
    // Industries (multi-select)
    const selectedIndustryIds = this.industries
      .filter((i) => i.selected)
      .map((i) => i.industry_id);
    if (selectedIndustryIds.length > 0)
      params.industry = selectedIndustryIds.join(',');

    this.internshipsService.getAvailableInternships(params).subscribe({
      next: (response) => {
        this.internships = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load internships',
        });
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.loadInternships();
  }

  viewInternship(internship: any): void {
    this.selectedInternship = internship;
    this.showViewDialog = true;
  }

  openApplyDialog(internship: any): void {
    this.selectedInternship = internship;
    this.applicationLetter = '';
    this.selectedResume = null;
    this.showApplyDialog = true;
  }

  onResumeSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: 'Please upload a PDF, DOC, or DOCX file',
        });
        event.target.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: 'Resume must be less than 5MB',
        });
        event.target.value = '';
        return;
      }
      
      this.selectedResume = file;
    }
  }

  submitApplication(): void {
    if (!this.applicationLetter.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please write a cover letter',
      });
      return;
    }

    const formData = new FormData();
    formData.append('application_letter', this.applicationLetter);
    if (this.selectedResume) {
      formData.append('resume', this.selectedResume);
    }

    this.internshipsService
      .applyToInternship(this.selectedInternship.internship_id, formData)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Application submitted successfully',
          });
          this.showApplyDialog = false;
          this.showViewDialog = false;
          this.selectedResume = null;
          this.loadInternships();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.detail || 'Failed to submit application',
          });
        },
      });
  }

  toggleBookmark(internshipId: number, event: Event): void {
    event.stopPropagation();
    const index = this.bookmarkedInternships.indexOf(internshipId);
    
    if (index > -1) {
      // Remove bookmark
      this.bookmarkedInternships.splice(index, 1);
      Swal.fire({
        icon: 'info',
        title: 'Bookmark Removed',
        text: 'Internship removed from bookmarks',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      // Add bookmark
      this.bookmarkedInternships.push(internshipId);
      Swal.fire({
        icon: 'success',
        title: 'Bookmarked',
        text: 'Internship saved to bookmarks',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
    
    // Save to localStorage
    localStorage.setItem('bookmarkedInternships', JSON.stringify(this.bookmarkedInternships));
  }

  isBookmarked(internshipId: number): boolean {
    return this.bookmarkedInternships.includes(internshipId);
  }

  getDisplayedInternships(): any[] {
    if (this.showBookmarksOnly) {
      return this.internships.filter(int => this.isBookmarked(int.internship_id));
    }
    return this.internships;
  }

  toggleBookmarkView(): void {
    this.showBookmarksOnly = !this.showBookmarksOnly;
  }

  previewInternshipMOA(): void {
    if (this.selectedInternship?.moa_file) {
      const moaUrl = `${environment.apiUrl}${this.selectedInternship.moa_file}`;
      window.open(moaUrl, '_blank');
    }
  }

  downloadInternshipMOA(): void {
    if (this.selectedInternship?.moa_file) {
      const moaUrl = `${environment.apiUrl}${this.selectedInternship.moa_file}`;
      const link = document.createElement('a');
      link.href = moaUrl;
      link.download = `MOA_${this.selectedInternship.company_name}.pdf`;
      link.click();
    }
  }
}
