import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { CampusesService } from '../school-info/campuses/campuses.service';

@Component({
  selector: 'app-student-trainees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-trainees.component.html',
  styleUrl: './student-trainees.component.css'
})
export class StudentTraineesComponent implements OnInit {
  students: any[] = [];
  campuses: any[] = [];
  programs: any[] = [];
  
  // Pagination
  pageNo: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  // Filters
  keyword: string = '';
  selectedCampusId: string | number = '';
  selectedProgramId: string | number = '';
  
  constructor(
    private http: HttpClient,
    private campusService: CampusesService
  ) {}
  
  ngOnInit(): void {
    this.loadCampuses();
    this.loadStudents();
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
  
  loadStudents(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token as string
    });
    
    const params: any = {
      pageNo: this.pageNo.toString(),
      pageSize: this.pageSize.toString(),
      keyword: this.keyword.trim()
    };
    
    if (this.selectedCampusId) {
      params.campus_id = this.selectedCampusId.toString();
    }
    
    if (this.selectedProgramId) {
      params.program_id = this.selectedProgramId.toString();
    }
    
    this.http.get(`${environment.apiUrl}/superadmin/student-trainees`, { headers, params })
      .subscribe({
        next: (res: any) => {
          if (res && Array.isArray(res.data)) {
            this.students = res.data;
            this.totalRecords = res.pagination?.total_records || 0;
          } else {
            this.students = [];
            this.totalRecords = 0;
          }
        },
        error: (err) => {
          console.error('Error loading students:', err);
          this.students = [];
          this.totalRecords = 0;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load student trainees',
            confirmButtonColor: '#ef4444'
          });
        }
      });
  }
  
  applyFilters(): void {
    this.pageNo = 1;
    this.loadStudents();
  }
  
  resetFilters(): void {
    this.selectedCampusId = '';
    this.selectedProgramId = '';
    this.keyword = '';
    this.pageNo = 1;
    this.loadStudents();
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
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders({
          Authorization: token as string
        });
        
        this.http.post(
          `${environment.apiUrl}/superadmin/student-trainees/${userId}/send-new-password`,
          {},
          { headers }
        ).subscribe({
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
          }
        });
      }
    });
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
      this.loadStudents();
    }
  }
  
  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.loadStudents();
    }
  }
}
