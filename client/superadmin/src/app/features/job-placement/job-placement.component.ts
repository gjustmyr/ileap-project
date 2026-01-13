import { Component, OnInit } from '@angular/core';
import { JobPlacementService } from './job-placement.service';
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
  selector: 'app-job-placement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './job-placement.component.html',
  styleUrl: './job-placement.component.css'
})
export class JobPlacementComponent implements OnInit {
  campuses: any[] = [];

  pageNo = 1;
  pageSize = 10;
  keyword = '';
  totalRecords = 0;
  selectedCampusId: string | number = '';

  jpoList: any[] = [];

  showDialog: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: string | number = '';

  jpoForm!: FormGroup;

  constructor(
    private jpoService: JobPlacementService,
    private campusService: CampusesService,
    private fb: FormBuilder
  ) {
    this.jpoForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      password: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: ['', [Validators.pattern(/^09\d{9}$/)]],
      position_title: [''],
      campus_id: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCampuses();
    this.getAllJobPlacementOfficers();
  }

  loadCampuses(): void {
    this.campusService.getAllCampuses(1, 1000, '').subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data.campuses)) {
          this.campuses = res.data.campuses;
        } else {
          this.campuses = [];
        }
      },
      error: (err) => {
        console.error('Error fetching campuses:', err);
        this.campuses = [];
      }
    });
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllJobPlacementOfficers();
  }

  resetFilters(): void {
    this.selectedCampusId = '';
    this.keyword = '';
    this.pageNo = 1;
    this.getAllJobPlacementOfficers();
  }

  handleAddDialog(): void {
    this.isEditMode = false;
    this.selectedUserId = '';
    this.jpoForm.reset({ status: 'active' });
    this.jpoForm.get('password')?.setValidators([Validators.required]);
    this.jpoForm.get('password')?.updateValueAndValidity();
    this.showDialog = true;
  }

  getAllJobPlacementOfficers(): void {
    this.jpoService.getAll(this.pageNo, this.pageSize, this.keyword).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.jpoList = res.data;
          this.totalRecords = res.pagination?.total_records || 0;
        } else {
          this.jpoList = [];
          this.totalRecords = 0;
        }
      },
      error: (err) => {
        console.error('Error loading JPO:', err);
        this.jpoList = [];
        this.totalRecords = 0;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load job placement officers',
          confirmButtonColor: '#ef4444'
        });
      },
    });
  }

  handleUpdateDialog(user_id: string): void {
    this.jpoService.getJPOProfileByID(user_id).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCCESS') {
          const data = response.data;
          this.isEditMode = true;
          this.selectedUserId = data.user_id;
          this.jpoForm.patchValue({
            first_name: data.first_name,
            last_name: data.last_name,
            email_address: data.email_address,
            status: data.status,
            contact_number: data.contact_number,
            position_title: data.position_title,
            campus_id: data.campus_id,
          });
          this.jpoForm.get('password')?.clearValidators();
          this.jpoForm.get('password')?.updateValueAndValidity();
          this.showDialog = true;
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load JPO details',
          confirmButtonColor: '#ef4444'
        });
      },
    });
  }

  closeDialog(): void {
    this.showDialog = false;
    this.jpoForm.reset();
  }

  handleSubmit(): void {
    if (this.jpoForm.invalid) {
      this.jpoForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    const formData = { ...this.jpoForm.value };
    
    if (this.isEditMode && this.selectedUserId) {
      // Remove password if empty during update
      if (!formData.password) {
        delete formData.password;
      }
      
      this.jpoService.updateJPO(this.selectedUserId as string, formData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'JPO updated successfully!',
            confirmButtonColor: '#10b981'
          });
          this.closeDialog();
          this.getAllJobPlacementOfficers();
        },
        error: (err) => {
          console.error('Failed to update JPO:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Failed to update JPO',
            confirmButtonColor: '#ef4444'
          });
        },
      });
    } else {
      // Create new JPO
      this.jpoService.registerJPO(formData).subscribe({
        next: (res) => {
          if (res?.status === 'SUCCESS') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'JPO registered successfully!',
              confirmButtonColor: '#10b981'
            });
            this.closeDialog();
            this.getAllJobPlacementOfficers();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: res?.message || 'Unable to register JPO',
              confirmButtonColor: '#ef4444'
            });
          }
        },
        error: (err) => {
          console.error('Error creating JPO:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Something went wrong',
            confirmButtonColor: '#ef4444'
          });
        },
      });
    }
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
      this.getAllJobPlacementOfficers();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllJobPlacementOfficers();
    }
  }
}
