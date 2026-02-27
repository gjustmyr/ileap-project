import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { JobPostingsService } from './job-postings.service';
import { DropdownsService } from '../../shared/services/dropdowns.service';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-postings.component.html',
  styleUrl: './job-postings.component.css',
})
export class JobPostingsComponent implements OnInit {
  jobPostings: any[] = [];
  totalRecords = 0;
  pageNo = 1;
  pageSize = 10;
  isLoading = false;
  Math = Math;

  selectedIndustryId: string | number = '';
  selectedStatusFilter: string = '';
  keyword = '';

  industries: any[] = [];
  employers: any[] = [];

  showViewDialog = false;
  selectedPosting: any = null;

  constructor(
    private jobPostingsService: JobPostingsService,
    private dropdownService: DropdownsService,
  ) {}

  ngOnInit(): void {
    this.loadIndustries();
    this.getAllJobPostings();
  }

  getAllJobPostings(): void {
    this.isLoading = true;
    const params: any = {
      page_no: this.pageNo,
      page_size: this.pageSize,
    };

    if (this.selectedIndustryId) {
      params.industry_id = this.selectedIndustryId;
    }
    if (this.selectedStatusFilter) {
      params.status_filter = this.selectedStatusFilter;
    }
    if (this.keyword) {
      params.keyword = this.keyword;
    }

    this.jobPostingsService.getAllJobPostings(params).subscribe({
      next: (res) => {
        if (res?.status === 'success') {
          this.jobPostings = res.data || [];
          this.totalRecords = res.pagination?.total_records || 0;
        } else {
          this.jobPostings = [];
          this.totalRecords = 0;
        }
        this.isLoading = false;
      },
      error: () => {
        this.jobPostings = [];
        this.totalRecords = 0;
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load job postings.',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllJobPostings();
  }

  resetFilters(): void {
    this.selectedIndustryId = '';
    this.selectedStatusFilter = '';
    this.keyword = '';
    this.pageNo = 1;
    this.getAllJobPostings();
  }

  onPageChange(newPage: number): void {
    this.pageNo = newPage;
    this.getAllJobPostings();
  }

  loadIndustries(): void {
    this.dropdownService.getActiveIndustries().subscribe({
      next: (industries) => {
        this.industries = industries;
      },
      error: (err) => {
        console.error('Error loading industries:', err);
      },
    });
  }

  viewPostingDetails(posting: any): void {
    this.selectedPosting = posting;
    this.showViewDialog = true;
  }

  closeViewDialog(): void {
    this.showViewDialog = false;
    this.selectedPosting = null;
  }

  handleApprove(posting: any): void {
    Swal.fire({
      title: 'Approve Job Posting?',
      html: `
        <p class="text-gray-700">Are you sure you want to approve this job posting?</p>
        <p class="font-semibold mt-2">${posting.title}</p>
        <p class="text-sm text-gray-600">${posting.company_name}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updatePostingStatus(posting.internship_id, 'approved');
      }
    });
  }

  handleReject(posting: any): void {
    Swal.fire({
      title: 'Reject Job Posting?',
      html: `
        <p class="text-gray-700">Are you sure you want to reject this job posting?</p>
        <p class="font-semibold mt-2">${posting.title}</p>
        <p class="text-sm text-gray-600">${posting.company_name}</p>
        <textarea id="reject-remarks" class="swal2-textarea mt-3" placeholder="Reason for rejection (optional)"></textarea>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const remarks = (
          document.getElementById('reject-remarks') as HTMLTextAreaElement
        ).value;
        return remarks;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.updatePostingStatus(
          posting.internship_id,
          'rejected',
          result.value,
        );
      }
    });
  }

  updatePostingStatus(
    postingId: number,
    status: string,
    remarks?: string,
  ): void {
    const statusData: any = { status };
    if (remarks) {
      statusData.remarks = remarks;
    }

    this.jobPostingsService
      .updateJobPostingStatus(postingId, statusData)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: res.message || 'Job posting status updated successfully',
            confirmButtonColor: '#16a34a',
          });
          this.getAllJobPostings();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err.error?.detail ||
              err.error?.message ||
              'Failed to update job posting status',
            confirmButtonColor: '#ef4444',
          });
        },
      });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      open: 'bg-blue-100 text-blue-800',
      closed: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-600',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      draft: 'Draft',
      pending: 'Pending Review',
      approved: 'Approved',
      open: 'Open',
      closed: 'Closed',
      rejected: 'Rejected',
      archived: 'Archived',
    };
    return statusLabels[status] || status;
  }

  // Pagination helper methods
  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    return Math.min(this.pageNo * this.pageSize, this.totalRecords);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllJobPostings();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllJobPostings();
    }
  }
}
