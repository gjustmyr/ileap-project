import { Component, OnInit } from '@angular/core';
import { OjtHeadService } from './ojt-head.service';
import { CampusesService } from '../school-info/campuses/campuses.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ojt-head',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ojt-head.component.html',
  styleUrl: './ojt-head.component.css',
})
export class OjtHeadComponent implements OnInit {
  campuses: any[] = [];

  pageNo = 1;
  pageSize = 10;
  keyword = '';
  sortField = '';
  sortOrder = 1;
  totalRecords = 0;
  selectedCampusId!: number | string;

  ojtHeadList: any[] = [];

  isAddDialogVisible = false;
  isUpdateDialogVisible = false;

  selectedUserId!: string | number;

  ojtHeadForm!: FormGroup;
  ojtHeadUpdateForm!: FormGroup;

  constructor(
    private ojtService: OjtHeadService,
    private campusService: CampusesService,
    private fb: FormBuilder
  ) {
    this.ojtHeadForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: [''],
      position_title: [''],
      campus_id: [null, Validators.required],
    });

    this.ojtHeadUpdateForm = this.fb.group({
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
    });
  }

  ngOnInit(): void {
    this.getCampusesDropdown();
    this.getAllOjtHeads();
  }

  getCampusesDropdown(): void {
    this.campusService.getAllCampuses(1, 1000, '').subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data.campuses)) {
          this.campuses = res.data.campuses;
          this.selectedCampusId = this.campuses[0]?.campus_id ?? '';
        } else if (res && Array.isArray(res.data)) {
          // Fallback for different response structure
          this.campuses = res.data;
          this.selectedCampusId = this.campuses[0]?.campus_id ?? '';
        } else {
          this.campuses = [];
          console.error('Failed to load campuses: Invalid response format');
        }
      },
      error: (err) => {
        console.error('Error fetching campuses:', err);
        this.campuses = [];
      }
    });
  }

  handleSearch(): void {
    this.pageNo = 1;
    this.getAllOjtHeads();
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllOjtHeads();
  }

  resetFilters(): void {
    this.selectedCampusId = '';
    this.keyword = '';
    this.pageNo = 1;
    this.getAllOjtHeads();
  }

  handleAddDialog(): void {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    if (this.isAddDialogVisible) {
      this.ojtHeadForm.reset();
    }
  }

  handleUpdateDialog(user_id: string): void {
    this.ojtService.getOjtHeadProfileByID(user_id).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          this.isUpdateDialogVisible = true;
          this.selectedUserId = response.data.user_id;
          this.ojtHeadUpdateForm.patchValue(response.data);
        }
      },
      error: (err) => {
        console.error('Failed to fetch OJT Head profile:', err);
      },
    });
  }

  getAllOjtHeads(): void {
    this.ojtService.getAll(this.pageNo, this.pageSize, this.keyword, this.selectedCampusId).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.ojtHeadList = res.data;
          this.totalRecords = res?.pagination?.totalRecords || 0;
        } else {
          this.ojtHeadList = [];
          this.totalRecords = 0;
        }
      },
      error: () => {
        this.ojtHeadList = [];
        this.totalRecords = 0;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load OJT Heads.',
          confirmButtonColor: '#ef4444'
        });
      },
    });
  }

  pageChange(event: any): void {
    this.pageNo = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.getAllOjtHeads();
  }

  submitOjtHeadForm(): void {
    if (this.ojtHeadForm.invalid) {
      this.ojtHeadForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Register OJT Head?',
      html: `Are you sure you want to register this OJT Head?<br><strong>${this.ojtHeadForm.value.email_address}</strong>`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Register',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ojtService.registerOjtHead(this.ojtHeadForm.value).subscribe({
          next: (res) => {
            if (res?.status === 'SUCCESS') {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'OJT Head registered successfully!',
                confirmButtonColor: '#22c55e'
              });
              this.ojtHeadForm.reset();
              this.isAddDialogVisible = false;
              this.getAllOjtHeads();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: res?.message || 'Unable to register OJT Head.',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong.',
              confirmButtonColor: '#ef4444'
            });
          },
        });
      }
    });
  }

  submitUpdateForm(): void {
    if (this.ojtHeadUpdateForm.valid && this.selectedUserId) {
      Swal.fire({
        icon: 'question',
        title: 'Update OJT Head?',
        text: 'Are you sure you want to update this OJT Head information?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ojtService
            .updateOjtHead(
              this.selectedUserId as string,
              this.ojtHeadUpdateForm.value
            )
            .subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'OJT Head updated successfully!',
                  confirmButtonColor: '#3b82f6'
                });
                this.isUpdateDialogVisible = false;
                this.getAllOjtHeads();
              },
              error: (err) => {
                console.error('Failed to update OJT Head:', err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to update OJT Head.',
                  confirmButtonColor: '#ef4444'
                });
              },
            });
        }
      });
    }
  }

  handleSendNewPassword(userId: number, email: string): void {
    Swal.fire({
      icon: 'question',
      title: 'Send New Password?',
      html: `A new password will be generated and sent to:<br><strong>${email}</strong>`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ojtService.sendNewPassword(userId.toString()).subscribe({
          next: (res) => {
            if (res && res.status === 'SUCCESS') {
              Swal.fire({
                icon: 'success',
                title: 'Password Sent!',
                text: 'New password has been generated and sent to the email.',
                confirmButtonColor: '#22c55e'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: res?.message || 'Unable to send new password.',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to send new password.',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  // Pagination helper methods
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

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllOjtHeads();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllOjtHeads();
    }
  }
}
