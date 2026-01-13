import { Component, OnInit } from '@angular/core';
import { DropdownsService } from '../../shared/services/dropdowns.service';
import { OjtCoordinatorService } from './ojt-coordinator.service';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ojt-coordinators',
  templateUrl: './ojt-coordinators.component.html',
  styleUrls: ['./ojt-coordinators.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class OjtCoordinatorsComponent implements OnInit {
  campuses: any[] = [];
  departments: any[] = [];

  selectedCampusId: number | string = '';
  selectedDepartmentId: number | string = '';

  coordinators: any[] = [];
  pageNo = 1;
  pageSize = 10;
  keyword = '';
  totalRecords = 0;

  isAddDialogVisible = false;
  isUpdateDialogVisible = false;
  selectedUserId: string | number = '';
  isLoading = false;
  isSubmitting = false;

  coordinatorForm!: FormGroup;
  coordinatorUpdateForm!: FormGroup;

  constructor(
    private dropdownService: DropdownsService,
    private coordinatorService: OjtCoordinatorService,
    private fb: FormBuilder
  ) {
    this.coordinatorForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: [''],
      position_title: [''],
      campus_id: [null, Validators.required],
      department_id: [null, Validators.required],
    });

    this.coordinatorUpdateForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email_address: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      contact_number: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
      ],
      position_title: ['', Validators.required],
      campus_id: ['', Validators.required],
      department_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getMyCampuses();
    this.getAllCoordinators();
  }

  getMyCampuses() {
    this.dropdownService.getMyCampuses().subscribe({
      next: (campuses: any) => {
        this.campuses = campuses;
      },
      error: (error: Error) => {
        console.error('Error fetching campuses', error);
      },
    });
  }

  getDepartmentsByCampus(campusId: number) {
    console.log('Loading departments for campus:', campusId);
    this.dropdownService.getDepartmentsByCampus(campusId).subscribe({
      next: (departments: any) => {
        console.log('Departments loaded:', departments);
        this.departments = departments;
      },
      error: (err: Error) => {
        console.error('Error fetching departments:', err);
        this.departments = [];
      },
    });
  }

  onCampusFilterChange(event: any) {
    this.selectedCampusId = event?.target?.value || '';

    // Load departments for the selected campus
    if (this.selectedCampusId) {
      this.getDepartmentsByCampus(parseInt(this.selectedCampusId as string));
    } else {
      this.departments = [];
    }

    // Reset department selection when campus changes
    this.selectedDepartmentId = '';
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllCoordinators();
  }

  resetFilters(): void {
    this.selectedCampusId = '';
    this.selectedDepartmentId = '';
    this.keyword = '';
    this.departments = [];
    this.pageNo = 1;
    this.getAllCoordinators();
  }

  handleSearch() {
    this.pageNo = 1;
    this.getAllCoordinators();
  }

  handleAddDialog() {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    if (this.isAddDialogVisible) {
      this.coordinatorForm.reset();
      this.departments = [];
    }
  }

  handleUpdateDialog(user_id: string) {
    this.coordinatorService.getCoordinatorByID(user_id).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.isUpdateDialogVisible = true;
          this.selectedUserId = response.data.user_id;
          this.coordinatorUpdateForm.patchValue(response.data);
          // Load departments for the current campus
          if (response.data.campus_id) {
            this.getDepartmentsByCampus(response.data.campus_id);
          }
        }
      },
      error: (err) => {
        console.error('Failed to fetch coordinator profile:', err);
      },
    });
  }

  getAllCoordinators() {
    this.coordinatorService
      .getAll(
        this.pageNo,
        this.pageSize,
        this.keyword,
        this.selectedCampusId,
        this.selectedDepartmentId
      )
      .subscribe({
        next: (res) => {
          if (res && Array.isArray(res.data)) {
            this.coordinators = res.data;
            this.totalRecords = res?.pagination?.totalRecords || 0;
          } else {
            this.coordinators = [];
            this.totalRecords = 0;
          }
        },
        error: () => {
          this.coordinators = [];
          this.totalRecords = 0;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load OJT Coordinators.',
            confirmButtonColor: '#ef4444',
          });
        },
      });
  }

  onCampusChange(event: any) {
    const campusId = event?.target?.value;
    if (campusId) {
      this.getDepartmentsByCampus(parseInt(campusId));
      this.coordinatorForm.patchValue({ department_id: null });
    } else {
      this.departments = [];
    }
  }

  onCampusChangeUpdate(event: any) {
    const campusId = event?.target?.value;
    if (campusId) {
      this.getDepartmentsByCampus(parseInt(campusId));
      this.coordinatorUpdateForm.patchValue({ department_id: null });
    } else {
      this.departments = [];
    }
  }

  submitCoordinatorForm() {
    if (this.coordinatorForm.invalid) {
      this.coordinatorForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (this.isSubmitting) return;

    Swal.fire({
      icon: 'question',
      title: 'Register OJT Coordinator?',
      html: `Are you sure you want to register this OJT Coordinator?<br><strong>${this.coordinatorForm.value.email_address}</strong>`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Register',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isSubmitting = true;
        this.coordinatorService
          .registerCoordinator(this.coordinatorForm.value)
          .subscribe({
            next: (res) => {
              this.isSubmitting = false;
              if (res?.status === 'SUCCESS') {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'OJT Coordinator registered successfully!',
                  confirmButtonColor: '#22c55e',
                });
                this.coordinatorForm.reset();
                this.departments = [];
                this.isAddDialogVisible = false;
                this.getAllCoordinators();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Failed',
                  text: res?.message || 'Unable to register OJT Coordinator.',
                  confirmButtonColor: '#ef4444',
                });
                // Don't close modal on error
              }
            },
            error: (err) => {
              this.isSubmitting = false;
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  err?.error?.detail ||
                  err?.error?.message ||
                  'Something went wrong.',
                confirmButtonColor: '#ef4444',
              });
              // Don't close modal on error
            },
          });
      }
    });
  }

  submitUpdateForm() {
    if (this.coordinatorUpdateForm.invalid) {
      this.coordinatorUpdateForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (this.isSubmitting) return;

    if (this.coordinatorUpdateForm.valid && this.selectedUserId) {
      Swal.fire({
        icon: 'question',
        title: 'Update OJT Coordinator?',
        text: 'Are you sure you want to update this OJT Coordinator information?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isSubmitting = true;
          this.coordinatorService
            .updateCoordinator(
              this.selectedUserId as string,
              this.coordinatorUpdateForm.value
            )
            .subscribe({
              next: () => {
                this.isSubmitting = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'OJT Coordinator updated successfully!',
                  confirmButtonColor: '#3b82f6',
                });
                this.isUpdateDialogVisible = false;
                this.getAllCoordinators();
              },
              error: (err) => {
                this.isSubmitting = false;
                console.error('Failed to update coordinator:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text:
                    err?.error?.detail ||
                    err?.error?.message ||
                    'Failed to update OJT Coordinator.',
                  confirmButtonColor: '#ef4444',
                });
                // Don't close modal on error
              },
            });
        }
      });
    }
  }

  handleSendNewPassword(userId: number, email: string) {
    Swal.fire({
      icon: 'question',
      title: 'Send New Password?',
      html: `A new password will be generated and sent to:<br><strong>${email}</strong>`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        this.coordinatorService.sendNewPassword(userId.toString()).subscribe({
          next: (res) => {
            if (res && res.status === 'SUCCESS') {
              Swal.fire({
                icon: 'success',
                title: 'Password Sent!',
                text: 'New password has been generated and sent to the email.',
                confirmButtonColor: '#22c55e',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: res?.message || 'Unable to send new password.',
                confirmButtonColor: '#ef4444',
              });
            }
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to send new password.',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    });
  }

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllCoordinators();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageNo < totalPages) {
      this.pageNo++;
      this.getAllCoordinators();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }

  getShowingEnd(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
}
