import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from './applications.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  selectedApplication: any = null;

  showViewDialog = false;
  showAcceptDialog = false;
  showRejectDialog = false;

  rejectRemarks = '';
  searchText = '';
  statusFilter = '';

  isLoading = false;

  constructor(private applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationsService.getApplications().subscribe({
      next: (response) => {
        console.log('Applications response:', response);
        this.applications = response.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load applications. Please try again.',
        });
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter((app) => {
      const matchesSearch =
        !this.searchText ||
        app.student_name
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        app.internship_title
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        app.student_email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        !this.statusFilter || app.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
    this.applyFilters();
    Swal.fire({
      icon: 'success',
      title: 'Filters Reset',
      text: 'All filters have been cleared',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  viewApplication(application: any): void {
    this.selectedApplication = application;
    this.showViewDialog = true;
  }

  openAcceptDialog(application: any): void {
    this.selectedApplication = application;

    Swal.fire({
      title: 'Accept Application',
      html: `
        <p class="mb-3">Are you sure you want to accept this application?</p>
        <div class="text-left">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            OJT Start Date (Optional)
          </label>
          <input
            type="date"
            id="ojt-start-date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            min="${new Date().toISOString().split('T')[0]}"
          />
          <p class="text-xs text-gray-500 mt-1">When will the student start their OJT?</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Accept',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const dateInput = document.getElementById(
          'ojt-start-date'
        ) as HTMLInputElement;
        return {
          startDate: dateInput?.value || null,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.acceptApplication(result.value.startDate);
      }
    });
  }

  openRejectDialog(application: any): void {
    this.selectedApplication = application;

    Swal.fire({
      title: 'Reject Application',
      text: 'Please provide a reason for rejection:',
      input: 'textarea',
      inputPlaceholder: 'Enter your reason here...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Please provide a reason for rejection';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.rejectRemarks = result.value;
        this.rejectApplication();
      }
    });
  }

  acceptApplication(startDate?: string | null): void {
    if (!this.selectedApplication) return;

    this.applicationsService
      .updateApplicationStatus(
        this.selectedApplication.application_id,
        'accepted',
        'Application accepted by employer',
        startDate
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Accepted',
            text: 'Application accepted successfully',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.showViewDialog = false;
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error accepting application:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to accept application',
          });
        },
      });
  }

  rejectApplication(): void {
    if (!this.selectedApplication) return;

    this.applicationsService
      .updateApplicationStatus(
        this.selectedApplication.application_id,
        'rejected',
        this.rejectRemarks
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'info',
            title: 'Rejected',
            text: 'Application rejected',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          this.showViewDialog = false;
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error rejecting application:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to reject application',
          });
        },
      });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      withdrawn: 'bg-gray-100 text-gray-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  downloadResume(resumePath: string): void {
    if (!resumePath) return;
    // Construct the full URL to download the resume
    const apiUrl = 'http://localhost:8000'; // Update with your API URL
    window.open(`${apiUrl}/${resumePath}`, '_blank');
  }
}
