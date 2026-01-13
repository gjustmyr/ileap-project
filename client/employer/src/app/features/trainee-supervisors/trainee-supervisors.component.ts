import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TraineeSupervisorService } from './trainee-supervisor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trainee-supervisors',
  templateUrl: './trainee-supervisors.component.html',
  styleUrl: './trainee-supervisors.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class TraineeSupervisorsComponent implements OnInit {
  supervisors: any[] = [];
  isAddDialogVisible = false;
  isUpdateDialogVisible = false;
  supervisorForm!: FormGroup;
  supervisorUpdateForm!: FormGroup;
  selectedSupervisorId: number | null = null;

  pageNo = 1;
  pageSize = 10;
  keyword = '';
  totalRecords = 0;

  constructor(
    private supervisorService: TraineeSupervisorService,
    private fb: FormBuilder
  ) {
    this.supervisorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: [''],
      position: [''],
      department: [''],
    });

    this.supervisorUpdateForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      position: [''],
      department: [''],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchSupervisors();
  }

  fetchSupervisors(): void {
    this.supervisorService
      .getAllSupervisors(this.pageNo, this.pageSize, this.keyword)
      .subscribe({
        next: (res: any) => {
          this.supervisors = res.data || [];
          this.totalRecords = res.pagination?.total || 0;
        },
        error: (err: any) => {
          console.error('Error fetching supervisors:', err);
          Swal.fire('Error', 'Failed to load supervisors', 'error');
        },
      });
  }

  handleAddDialog(): void {
    this.isAddDialogVisible = true;
    this.supervisorForm.reset();
  }

  handleUpdateDialog(supervisorId: number): void {
    const supervisor = this.supervisors.find(s => s.supervisor_id === supervisorId);
    if (supervisor) {
      this.selectedSupervisorId = supervisorId;
      this.supervisorUpdateForm.patchValue({
        first_name: supervisor.first_name,
        last_name: supervisor.last_name,
        email: supervisor.email,
        phone_number: supervisor.phone_number,
        position: supervisor.position,
        department: supervisor.department,
        status: supervisor.status,
      });
      this.isUpdateDialogVisible = true;
    }
  }

  submitSupervisorForm(): void {
    if (this.supervisorForm.invalid) {
      this.supervisorForm.markAllAsTouched();
      return;
    }

    const formData = this.supervisorForm.value;

    this.supervisorService.createSupervisor(formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Supervisor registered successfully. A temporary password has been generated.', 'success');
        this.isAddDialogVisible = false;
        this.fetchSupervisors();
      },
      error: (err: any) => {
        console.error('Error creating supervisor:', err);
        Swal.fire('Error', err.error?.detail || 'Failed to register supervisor', 'error');
      },
    });
  }

  submitUpdateForm(): void {
    if (this.supervisorUpdateForm.invalid || !this.selectedSupervisorId) {
      this.supervisorUpdateForm.markAllAsTouched();
      return;
    }

    const formData = this.supervisorUpdateForm.value;

    this.supervisorService.updateSupervisor(this.selectedSupervisorId, formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Supervisor updated successfully', 'success');
        this.isUpdateDialogVisible = false;
        this.fetchSupervisors();
      },
      error: (err: any) => {
        console.error('Error updating supervisor:', err);
        Swal.fire('Error', err.error?.detail || 'Failed to update supervisor', 'error');
      },
    });
  }

  handleSendNewPassword(supervisorId: number, email: string): void {
    Swal.fire({
      title: 'Send New Password?',
      text: `A new password will be generated and sent to ${email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, send it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement send new password API call
        Swal.fire('Sent!', 'New password has been sent to the email.', 'success');
      }
    });
  }

  handleSearch(): void {
    this.pageNo = 1;
    this.fetchSupervisors();
  }

  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.fetchSupervisors();
    }
  }

  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.fetchSupervisors();
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
