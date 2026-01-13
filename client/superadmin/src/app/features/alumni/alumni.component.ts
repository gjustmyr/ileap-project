import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ProgramsService } from '../school-info/programs/programs.service';

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alumni.component.html',
  styleUrls: ['./alumni.component.css']
})
export class AlumniComponent implements OnInit {
  alumni: any[] = [];
  programs: any[] = [];
  
  // Dialog state
  showDialog: boolean = false;
  isEditMode: boolean = false;
  currentAlumniId: number | null = null;
  alumniForm: FormGroup;
  
  // Pagination
  pageNo: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  // Filters
  keyword: string = '';
  selectedProgramId: string | number = '';
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private programService: ProgramsService
  ) {
    this.alumniForm = this.fb.group({
      sr_code: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      program_id: [''],
      graduation_year: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadAlumni();
    this.loadPrograms();
  }
  
  loadPrograms(): void {
    this.programService.getAllPrograms(1, 1000, '', '').subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data.programs)) {
          this.programs = res.data.programs;
        } else {
          this.programs = [];
        }
      },
      error: (err) => {
        console.error('Error fetching programs:', err);
        this.programs = [];
      }
    });
  }
  
  loadAlumni(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string
    });
    
    const params: any = {
      pageNo: this.pageNo.toString(),
      pageSize: this.pageSize.toString(),
      keyword: this.keyword.trim()
    };
    
    if (this.selectedProgramId) {
      params.program_id = this.selectedProgramId.toString();
    }
    
    this.http.get(`${environment.apiUrl}/superadmin/alumni`, { headers, params })
      .subscribe({
        next: (res: any) => {
          if (res && Array.isArray(res.data)) {
            this.alumni = res.data;
            this.totalRecords = res.pagination?.total_records || 0;
          } else {
            this.alumni = [];
            this.totalRecords = 0;
          }
        },
        error: (err) => {
          console.error('Error loading alumni:', err);
          this.alumni = [];
          this.totalRecords = 0;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load alumni',
            confirmButtonColor: '#ef4444'
          });
        }
      });
  }
  
  applyFilters(): void {
    this.pageNo = 1;
    this.loadAlumni();
  }
  
  resetFilters(): void {
    this.selectedProgramId = '';
    this.keyword = '';
    this.pageNo = 1;
    this.loadAlumni();
  }
  
  // Pagination helpers
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
  
  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.loadAlumni();
    }
  }
  
  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.loadAlumni();
    }
  }
  
  handleAddDialog(): void {
    this.isEditMode = false;
    this.currentAlumniId = null;
    this.alumniForm.reset();
    this.showDialog = true;
  }
  
  handleUpdateDialog(alumnus: any): void {
    this.isEditMode = true;
    this.currentAlumniId = alumnus.alumni_id;
    this.alumniForm.patchValue({
      sr_code: alumnus.sr_code,
      first_name: alumnus.first_name,
      middle_name: alumnus.middle_name,
      last_name: alumnus.last_name,
      email: alumnus.email,
      program_id: alumnus.program_id || '',
      graduation_year: alumnus.graduation_year || ''
    });
    this.showDialog = true;
  }
  
  closeDialog(): void {
    this.showDialog = false;
    this.alumniForm.reset();
  }
  
  handleSubmit(): void {
    if (this.alumniForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string
    });
    
    const formData = { ...this.alumniForm.value };
    
    // Convert empty strings to null for optional fields
    if (!formData.program_id) formData.program_id = null;
    if (!formData.graduation_year) formData.graduation_year = null;
    if (!formData.sr_code) formData.sr_code = null;
    if (!formData.middle_name) formData.middle_name = null;
    
    if (this.isEditMode && this.currentAlumniId) {
      // Update
      this.http.put(
        `${environment.apiUrl}/superadmin/alumni/${this.currentAlumniId}`,
        formData,
        { headers }
      ).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Alumni updated successfully',
            confirmButtonColor: '#10b981'
          });
          this.closeDialog();
          this.loadAlumni();
        },
        error: (err) => {
          console.error('Error updating alumni:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.detail || 'Failed to update alumni',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    } else {
      // Create
      this.http.post(
        `${environment.apiUrl}/superadmin/alumni`,
        formData,
        { headers }
      ).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Alumni added successfully',
            confirmButtonColor: '#10b981'
          });
          this.closeDialog();
          this.loadAlumni();
        },
        error: (err) => {
          console.error('Error adding alumni:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.detail || 'Failed to add alumni',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    }
  }
  
  handleDelete(alumniId: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Delete Alumni',
      text: 'Are you sure you want to delete this alumni?',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders({
          Authorization: token as string
        });
        
        this.http.delete(
          `${environment.apiUrl}/superadmin/alumni/${alumniId}`,
          { headers }
        ).subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Alumni deleted successfully',
              confirmButtonColor: '#10b981'
            });
            this.loadAlumni();
          },
          error: (err) => {
            console.error('Error deleting alumni:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.detail || 'Failed to delete alumni',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }
}
