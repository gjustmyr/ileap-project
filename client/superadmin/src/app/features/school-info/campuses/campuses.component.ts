import { Component } from '@angular/core';
import { CampusesService } from './campuses.service';
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
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campuses',
  imports: [
    CommonModule,
    TableModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './campuses.component.html',
  styleUrl: './campuses.component.css',
})
export class CampusesComponent {
  //Datasets
  campuses: any[] = [];
  mainCampuses: any[] = [];

  //Data Tables -> Pagination
  pageNo: number = 1;
  pageSize: number = 10;
  keyword: string = '';
  sortField: string = '';
  sortOrder: number = 1;
  totalRecords: number = 0;

  //Dialog
  isAddDialogVisible: boolean = false;
  isUpdateDialogVisible = false;
  updateCampusForm!: FormGroup;
  selectedCampusId: string | null = null;

  //Payloads
  newCampus!: FormGroup;

  //Inialized Module
  constructor(
    private campusesService: CampusesService,
    private fb: FormBuilder
  ) {
    this.newCampus = this.fb.group({
      campus_name: ['', Validators.required],
      is_extension: [false, Validators.required],
      parent_campus_id: [null],
    });
    this.updateCampusForm = this.fb.group({
      campus_name: ['', Validators.required],
      is_extension: [false, Validators.required],
      parent_campus_id: [null],
      status: ['', Validators.required],
    });
  }

  //Run on load
  ngOnInit(): void {
    this.getAllCampuses();
    this.loadMainCampuses();
  }

  // Load main campuses for dropdown
  loadMainCampuses(): void {
    this.campusesService.getMainCampuses().subscribe({
      next: (response: any) => {
        console.log('Main campuses response:', response);
        if (response && response.data) {
          console.log('Main campuses loaded:', response);
          this.mainCampuses = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading main campuses:', err);
      },
    });
  }

  //Handle Search
  handleSearch() {
    this.pageNo = 1;
    this.getAllCampuses();
  }

  //Dialog -> Handle Add Dialogs
  handleAddDialog() {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    this.newCampus.reset();
  }

  //Dialog -> Handle Add Dialogs
  handleUpdateDialog(campus_id: string): void {
    this.selectedCampusId = campus_id;

    this.campusesService.getCampusById(campus_id).subscribe({
      next: (response) => {
        if (response && response.data) {
          const campus = response.data;

          this.updateCampusForm.patchValue({
            campus_name: campus.campus_name,
            is_extension: campus.is_extension,
            parent_campus_id: campus.parent_campus_id,
            status: campus.status,
          });

          this.isUpdateDialogVisible = true;
        } else {
          console.error('Failed to fetch campus details:', response?.message);
        }
      },
      error: (error) => {
        console.error('Error fetching campus by ID:', error);
      },
    });
  }

  //Data Tables -> Pagination -> Controls
  pageChange(event: any) {
    this.pageNo = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.getAllCampuses();
  }

  // Pagination helper methods
  onPageSizeChange() {
    this.pageNo = 1;
    this.getAllCampuses();
  }

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllCampuses();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllCampuses();
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

  //Get All Campuses
  getAllCampuses(): void {
    this.campusesService
      .getAllCampuses(this.pageNo, this.pageSize, this.keyword)
      .subscribe({
        next: (response: any) => {
          if (response && response.data && response.data.campuses) {
            let campuses = response.data.campuses;

            // Basic sorting before assigning to `this.campuses`
            if (this.sortField) {
              campuses.sort((a: any, b: any) => {
                const valA = a[this.sortField];
                const valB = b[this.sortField];

                if (valA == null) return 1;
                if (valB == null) return -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                  return this.sortOrder === 1
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
                }

                return this.sortOrder === 1 ? valA - valB : valB - valA;
              });
            }

            this.campuses = campuses;
            this.totalRecords = response.data.pagination.totalRecords;
          }
        },
        error: (err) => {
          console.error('Error fetching campuses in component:', err);
        },
      });
  }

  //Submit New Campus
  submitNewCampus(): void {
    if (this.newCampus.valid) {
      const payload = {
        ...this.newCampus.value,
        is_extension: this.newCampus.value.is_extension === 'true' || this.newCampus.value.is_extension === true
      };
      this.campusesService.addCampus(payload).subscribe({
        next: (res) => {
          if (res && res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Campus added successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.getAllCampuses();
            this.isAddDialogVisible = false;
            this.newCampus.reset();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res?.message || 'Failed to add campus'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while adding campus'
          });
          console.error('Error adding campus:', err);
        },
      });
    } else {
      this.newCampus.markAllAsTouched();
    }
  }

  //Submit Updated Campus
  submitUpdatedSubmit() {
    console.log(this.selectedCampusId as string, this.updateCampusForm.value);

    const payload = {
      ...this.updateCampusForm.value,
      is_extension: this.updateCampusForm.value.is_extension === 'true' || this.updateCampusForm.value.is_extension === true
    };

    this.campusesService
      .updateCampus(
        this.selectedCampusId as string,
        payload
      )
      .subscribe((res) => {
        if (res && res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Campus updated successfully',
            timer: 2000,
            showConfirmButton: false
          });
          this.getAllCampuses();
          this.isUpdateDialogVisible = false;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update campus'
          });
        }
      });
  }

  handleUpdateStatus(
    event: Event,
    campus_id: string,
    currentStatus: string
  ): void {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'inactive' ? 'disable' : 'enable';

    Swal.fire({
      title: 'Confirmation',
      text: `Do you want to ${actionText} this campus?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'inactive' ? '#dc3545' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: actionText.charAt(0).toUpperCase() + actionText.slice(1),
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campusesService.toggleCampusStatus(campus_id).subscribe({
          next: (res) => {
            if (res && res.success) {
              Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: `Campus is now ${newStatus}`,
                timer: 2000,
                showConfirmButton: false
              });
              this.getAllCampuses();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.message || 'Failed to update campus status'
              });
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Something went wrong while updating status'
            });
            console.error('Status update error:', err);
          },
        });
      }
    });
  }
}
