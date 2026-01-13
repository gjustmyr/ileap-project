import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

interface OjtCoordinator {
  user_id: number;
  email_address: string;
  first_name: string;
  last_name: string;
  contact_number: string | null;
  position_title: string | null;
  status: string;
  campus_id: number | null;
  campus_name: string | null;
  department_id: number | null;
  department_name: string | null;
}

interface Campus {
  campus_id: number;
  campus_name: string;
  is_extension: boolean;
}

interface Department {
  department_id: number;
  department_name: string;
}

@Component({
  selector: 'app-ojt-coordinator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ojt-coordinator.component.html',
  styleUrl: './ojt-coordinator.component.css',
})
export class OjtCoordinatorComponent implements OnInit {
  ojtCoordinators: OjtCoordinator[] = [];
  filteredCoordinators: OjtCoordinator[] = [];
  campuses: Campus[] = [];
  departments: Department[] = [];
  
  selectedCampusId: number | string = '';
  selectedDepartmentId: number | string = '';
  keyword: string = '';

  isUpdateDialogVisible: boolean = false;
  isSendAccountDialogVisible: boolean = false;

  coordinatorUpdateForm: FormGroup;
  sendAccountForm: FormGroup;

  selectedCoordinator: OjtCoordinator | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.coordinatorUpdateForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: [''],
      position_title: [''],
      campus_id: [null, Validators.required],
      department_id: [null, Validators.required],
      status: ['active', Validators.required],
    });

    this.sendAccountForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: [''],
      position_title: [''],
      campus_id: [null, Validators.required],
      department_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadOjtCoordinators();
    this.loadCampuses();
  }

  loadOjtCoordinators(): void {
    this.http
      .get<any>(`${environment.apiUrl}/ojt-coordinators/superadmin/all`)
      .subscribe({
        next: (response) => {
          this.ojtCoordinators = response.data || [];
          this.filteredCoordinators = this.ojtCoordinators;
        },
        error: (error) => {
          console.error('Error loading OJT coordinators:', error);
        },
      });
  }

  loadCampuses(): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/campuses?pageSize=1000`).subscribe({
      next: (response) => {
        this.campuses = response?.data?.campuses || [];
      },
      error: (error) => {
        console.error('Error loading campuses:', error);
      },
    });
  }

  getDepartmentsByCampus(campusId: number): void {
    this.http.get<any>(`${environment.apiUrl}/superadmin/departments?campus_id=${campusId}&pageSize=1000`).subscribe({
      next: (response) => {
        this.departments = response?.data?.departments || [];
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
      },
    });
  }

  onCampusFilterChange(event: any): void {
    this.selectedCampusId = event?.target?.value || '';
    
    if (this.selectedCampusId) {
      this.getDepartmentsByCampus(parseInt(this.selectedCampusId as string));
    } else {
      this.departments = [];
    }
    
    this.selectedDepartmentId = '';
  }

  onCampusChange(event: any): void {
    const campusId = event?.target?.value;
    if (campusId) {
      this.getDepartmentsByCampus(parseInt(campusId));
      this.sendAccountForm.patchValue({ department_id: null });
    } else {
      this.departments = [];
    }
  }

  onCampusChangeUpdate(event: any): void {
    const campusId = event?.target?.value;
    if (campusId) {
      this.getDepartmentsByCampus(parseInt(campusId));
      this.coordinatorUpdateForm.patchValue({ department_id: null });
    } else {
      this.departments = [];
    }
  }

  applyFilters(): void {
    this.filteredCoordinators = this.ojtCoordinators.filter((coordinator) => {
      const matchesKeyword =
        !this.keyword ||
        (coordinator.first_name || '').toLowerCase().includes(this.keyword.toLowerCase()) ||
        (coordinator.last_name || '').toLowerCase().includes(this.keyword.toLowerCase()) ||
        (coordinator.email_address || '').toLowerCase().includes(this.keyword.toLowerCase()) ||
        (coordinator.campus_name || '').toLowerCase().includes(this.keyword.toLowerCase()) ||
        (coordinator.department_name || '').toLowerCase().includes(this.keyword.toLowerCase());

      const matchesCampus =
        !this.selectedCampusId ||
        coordinator.campus_id?.toString() === this.selectedCampusId.toString();

      const matchesDepartment =
        !this.selectedDepartmentId ||
        coordinator.department_id?.toString() === this.selectedDepartmentId.toString();

      return matchesKeyword && matchesCampus && matchesDepartment;
    });
  }

  resetFilters(): void {
    this.selectedCampusId = '';
    this.selectedDepartmentId = '';
    this.keyword = '';
    this.departments = [];
    this.filteredCoordinators = this.ojtCoordinators;
  }

  handleUpdateDialog(coordinator: OjtCoordinator): void {
    this.selectedCoordinator = coordinator;
    this.coordinatorUpdateForm.patchValue({
      email_address: coordinator.email_address,
      first_name: coordinator.first_name,
      last_name: coordinator.last_name,
      contact_number: coordinator.contact_number,
      position_title: coordinator.position_title,
      campus_id: coordinator.campus_id,
      department_id: coordinator.department_id,
      status: coordinator.status,
    });
    
    if (coordinator.campus_id) {
      this.getDepartmentsByCampus(coordinator.campus_id);
    }
    
    this.isUpdateDialogVisible = true;
  }

  submitUpdateForm(): void {
    if (this.coordinatorUpdateForm.valid && this.selectedCoordinator?.user_id) {
      this.http
        .put(
          `${environment.apiUrl}/ojt-coordinators/${this.selectedCoordinator.user_id}`,
          this.coordinatorUpdateForm.value
        )
        .subscribe({
          next: () => {
            this.isUpdateDialogVisible = false;
            this.loadOjtCoordinators();
            alert('OJT Coordinator updated successfully');
          },
          error: (error) => {
            console.error('Error updating OJT coordinator:', error);
            alert('Failed to update OJT coordinator');
          },
        });
    }
  }

  handleSendAccountDialog(): void {
    this.sendAccountForm.reset();
    this.departments = [];
    this.isSendAccountDialogVisible = !this.isSendAccountDialogVisible;
  }

  submitSendAccount(): void {
    if (this.sendAccountForm.valid) {
      this.http
        .post(
          `${environment.apiUrl}/ojt-coordinators/send-account`,
          this.sendAccountForm.value
        )
        .subscribe({
          next: () => {
            this.isSendAccountDialogVisible = false;
            this.loadOjtCoordinators();
            alert('Account credentials sent successfully to the OJT coordinator');
          },
          error: (error) => {
            console.error('Error sending account:', error);
            alert('Failed to send account credentials');
          },
        });
    }
  }

  handleSendNewPassword(userId: number, email: string): void {
    Swal.fire({
      title: 'Send New Password?',
      text: `A new password will be sent to ${email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .post(`${environment.apiUrl}/superadmin/ojt-coordinators/${userId}/send-new-password`, {})
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Password Sent!',
                text: 'A new password has been sent successfully',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (error) => {
              console.error('Error sending new password:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send new password. Please try again.'
              });
            },
          });
      }
    });
  }
}
