import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InternshipsService } from './internships.service';
import Swal from 'sweetalert2';
import { ViewInternshipModalComponent } from './components/modals/view-internship-modal/view-internship-modal.component';
import { RejectInternshipModalComponent } from './components/modals/reject-internship-modal/reject-internship-modal.component';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ViewInternshipModalComponent,
    RejectInternshipModalComponent,
  ],
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css',
})
export class InternshipsComponent implements OnInit {
  internships: any[] = [];
  selectedInternship: any = null;
  isLoading = false;
  isApproving = false;
  isRejecting = false;

  // Dialog states
  showViewDialog = false;
  showRejectDialog = false;
  rejectRemarks = '';

  // Pagination
  pageNo = 1;
  pageSize = 10;
  totalRecords = 0;

  // Filters
  searchKeyword = '';

  constructor(private internshipsService: InternshipsService) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  loadInternships(): void {
    this.isLoading = true;
    const params: any = {
      page: this.pageNo,
      limit: this.pageSize,
    };

    if (this.searchKeyword) {
      params.search = this.searchKeyword;
    }

    this.internshipsService.getAllInternships(params).subscribe({
      next: (response) => {
        this.internships = response.data || [];
        this.totalRecords = response.pagination?.totalRecords || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load internships',
          confirmButtonColor: '#10b981',
        });
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.pageNo = 1;
    this.loadInternships();
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.loadInternships();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.loadInternships();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    return Math.min(this.pageNo * this.pageSize, this.totalRecords);
  }

  viewInternship(internship: any): void {
    this.selectedInternship = internship;
    this.showViewDialog = true;
  }

  approveInternship(internship: any): void {
    Swal.fire({
      title: 'Approve Internship?',
      text: `Are you sure you want to approve "${internship.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isApproving = true;
        this.internshipsService
          .approveInternship(internship.internship_id)
          .subscribe({
            next: () => {
              this.isApproving = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Internship approved successfully',
                confirmButtonColor: '#10b981',
              });
              this.loadInternships();
              this.showViewDialog = false;
            },
            error: (error) => {
              this.isApproving = false;
              console.error('Error approving internship:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  error?.error?.detail ||
                  error?.error?.message ||
                  'Failed to approve internship',
                confirmButtonColor: '#ef4444',
              });
              // Don't close modal on error
            },
          });
      }
    });
  }

  openRejectDialog(internship: any): void {
    this.selectedInternship = internship;
    this.rejectRemarks = '';
    this.showRejectDialog = true;
  }

  confirmReject(remarks: string): void {
    if (!remarks.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please provide remarks for rejection',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (this.isRejecting) return;

    this.isRejecting = true;
    this.internshipsService
      .rejectInternship(this.selectedInternship.internship_id, remarks)
      .subscribe({
        next: () => {
          this.isRejecting = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Internship rejected successfully',
            confirmButtonColor: '#10b981',
          });
          this.loadInternships();
          this.showRejectDialog = false;
          this.showViewDialog = false;
        },
        error: (error) => {
          this.isRejecting = false;
          console.error('Error rejecting internship:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error?.error?.detail ||
              error?.error?.message ||
              'Failed to reject internship',
            confirmButtonColor: '#ef4444',
          });
          // Don't close modals on error
        },
      });
  }

  canApproveOrReject(status: string): boolean {
    return status === 'pending';
  }
}
