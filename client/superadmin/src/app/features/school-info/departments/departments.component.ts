import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';

import { DepartmentsService } from './departments.service';
import { DropdownsService } from '../../../shared/services/dropdowns.service';
import { SelectModule } from 'primeng/select';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent {
  departments: any[] = [];
  currentCampusId!: number;
  currentCampusName: string = '';
  availableDeans: any[] = [];
  deanSelectionMode: 'existing' | 'new' = 'new';
  updateDeanSelectionMode: 'existing' | 'new' = 'new';

  pageNo = 1;
  pageSize = 10;
  keyword = '';
  sortField = '';
  sortOrder = 1;
  totalRecords = 0;

  isAddDialogVisible = false;
  isUpdateDialogVisible = false;
  selectedDepartmentId: string | null = null;

  newDepartmentForm!: FormGroup;
  updateDepartmentForm!: FormGroup;

  constructor(
    private departmentsService: DepartmentsService,
    private dropdownService: DropdownsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.newDepartmentForm = this.fb.group({
      department_name: ['', Validators.required],
      abbrev: [''],
      dean_name: [''],
      dean_email: [''],
      dean_contact: [''],
      status: ['active'], // Default status
    });

    this.updateDepartmentForm = this.fb.group({
      department_name: ['', Validators.required],
      abbrev: [''],
      dean_name: [''],
      dean_email: [''],
      dean_contact: [''],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get campus_id and campus_name from query params
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      this.currentCampusId = +params['campusId'];
      this.currentCampusName = params['campusName'] || '';
      console.log('Current Campus ID:', this.currentCampusId);
      console.log('Current Campus Name:', this.currentCampusName);
      this.getAllDepartments();
      this.loadAvailableDeans();
    });
  }

  loadAvailableDeans(): void {
    // Get all departments to extract unique deans
    this.departmentsService.getAllDepartments(1, 1000, '', '').subscribe({
      next: (response: any) => {
        console.log('Load deans response:', response);
        if (response?.success && response.data?.departments) {
          console.log('Total departments:', response.data.departments.length);
          // Extract unique deans
          const deansMap = new Map();
          response.data.departments.forEach((dept: any) => {
            console.log('Department:', dept.department_name, 'Dean:', dept.dean_name, dept.dean_email);
            if (dept.dean_name && dept.dean_email) {
              const key = dept.dean_email;
              if (!deansMap.has(key)) {
                deansMap.set(key, {
                  dean_name: dept.dean_name,
                  dean_email: dept.dean_email,
                  dean_contact: dept.dean_contact || ''
                });
              }
            }
          });
          this.availableDeans = Array.from(deansMap.values());
          console.log('Available deans:', this.availableDeans);
        }
      },
      error: (error) => {
        console.error('Error loading deans:', error);
      }
    });
  }

  handleSearch() {
    this.pageNo = 1;
    this.getAllDepartments();
  }

  // Pagination helpers
  onPageSizeChange() {
    this.pageNo = 1;
    this.getAllDepartments();
  }

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllDepartments();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllDepartments();
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

  handleAddDialog(): void {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    this.deanSelectionMode = 'new';
    this.newDepartmentForm.reset({
      department_name: '',
      abbrev: '',
      dean_name: '',
      dean_email: '',
      dean_contact: '',
      status: 'active'
    });
  }

  onDeanSelect(event: any): void {
    if (event.value && this.deanSelectionMode === 'existing') {
      const selectedDean = this.availableDeans.find(d => d.dean_email === event.value);
      if (selectedDean) {
        this.newDepartmentForm.patchValue({
          dean_name: selectedDean.dean_name,
          dean_email: selectedDean.dean_email,
          dean_contact: selectedDean.dean_contact
        });
      }
    }
  }

  onUpdateDeanSelect(event: any): void {
    if (event.value && this.updateDeanSelectionMode === 'existing') {
      const selectedDean = this.availableDeans.find(d => d.dean_email === event.value);
      if (selectedDean) {
        this.updateDepartmentForm.patchValue({
          dean_name: selectedDean.dean_name,
          dean_email: selectedDean.dean_email,
          dean_contact: selectedDean.dean_contact
        });
      }
    }
  }

  handleUpdateDialog(departmentId: string): void {
    this.selectedDepartmentId = departmentId;
    this.updateDeanSelectionMode = 'new'; // Default to new

    this.departmentsService.getDepartmentById(departmentId).subscribe({
      next: (res) => {
        console.log('Get department response:', res);
        if (res?.success) {
          this.updateDepartmentForm.patchValue(res.data);
          this.isUpdateDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Error fetching department:', err);
      },
    });
  }

  submitNewDepartment(): void {
    if (this.newDepartmentForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this department?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const payload = {
            ...this.newDepartmentForm.value,
            campus_id: this.currentCampusId
          };
          this.departmentsService.addDepartment(payload).subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Department added successfully',
                  confirmButtonColor: '#22c55e'
                });
                this.getAllDepartments();
                this.isAddDialogVisible = false;
                this.newDepartmentForm.reset({
                  department_name: '',
                  abbrev: '',
                  dean_name: '',
                  dean_email: '',
                  dean_contact: '',
                  status: 'active'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to add department',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Error adding department:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while adding department',
                confirmButtonColor: '#ef4444'
              });
            },
          });
        }
      });
    } else {
      this.newDepartmentForm.markAllAsTouched();
    }
  }

  submitUpdatedSubmit(): void {
    if (!this.selectedDepartmentId || !this.updateDepartmentForm.valid) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this department?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentsService
          .updateDepartment(
            this.selectedDepartmentId as string,
            this.updateDepartmentForm.value
          )
          .subscribe({
            next: (res) => {
              if (res?.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Department updated successfully',
                  confirmButtonColor: '#3b82f6'
                });
                this.getAllDepartments();
                this.isUpdateDialogVisible = false;
                this.updateDepartmentForm.reset();
                this.selectedDepartmentId = null;
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: res?.message || 'Failed to update department',
                  confirmButtonColor: '#ef4444'
                });
              }
            },
            error: (err) => {
              console.error('Update error:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while updating department',
                confirmButtonColor: '#ef4444'
              });
            },
          });
      }
    });
  }

  pageChange(event: any): void {
    this.pageNo = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.getAllDepartments();
  }

  getAllDepartments(): void {
    console.log('Fetching departments for campus ID:', this.currentCampusId);
    this.departmentsService
      .getAllDepartments(
        this.pageNo,
        this.pageSize,
        this.keyword,
        this.currentCampusId
      )
      .subscribe({
        next: (res) => {
          console.log('Departments response:', res);
          if (res?.success) {
            let departments = res.data.departments;

            if (this.sortField) {
              departments.sort((a: any, b: any) => {
                const valA = a[this.sortField];
                const valB = b[this.sortField];

                if (valA == null) return 1;
                if (valB == null) return -1;

                if (typeof valA === 'string') {
                  return this.sortOrder === 1
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
                }

                return this.sortOrder === 1 ? valA - valB : valB - valA;
              });
            }

            this.departments = departments;
            this.totalRecords = res.pagination.totalRecords;
          }
        },
        error: (err) => {
          console.error('Error fetching departments:', err);
        },
      });
  }

  handleUpdateStatus(
    event: Event,
    departmentId: string,
    currentStatus: string
  ): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'inactive' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} this department?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentsService.toggleDepartmentStatus(departmentId).subscribe({
          next: (res) => {
            if (res?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Department is now ${newStatus}`,
                confirmButtonColor: '#22c55e'
              });
              this.getAllDepartments();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res?.message || 'Failed to update status',
                confirmButtonColor: '#ef4444'
              });
            }
          },
          error: (err) => {
            console.error('Status update error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while updating status',
              confirmButtonColor: '#ef4444'
            });
          },
        });
      }
    });
  }
}
