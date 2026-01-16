import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  records: any[] = [];
  selectedStudentId: string = '';
  isLoading = true;
  isLoadingRecords = false;

  // Filtering
  searchTerm: string = '';
  filterProgram: string = '';
  filterStatus: string = '';
  uniquePrograms: string[] = [];

  // Date filtering for records
  filterYear: string = '';
  filterMonth: string = '';
  filteredRecords: any[] = [];
  uniqueYears: string[] = [];
  months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // For edit modal
  editingRecord: any = null;
  showEditModal = false;
  isSaving = false;

  // For view details modal
  viewingRecord: any = null;
  showViewModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/my-students`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.students = response.data;
            this.filteredStudents = [...this.students];
            this.extractUniquePrograms();
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.isLoading = false;
        },
      });
  }

  extractUniquePrograms(): void {
    const programs = this.students
      .map((s) => s.program)
      .filter((p, i, arr) => p && arr.indexOf(p) === i);
    this.uniquePrograms = programs;
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter((student) => {
      const matchesSearch =
        !this.searchTerm ||
        student.first_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.last_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.student_number?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesProgram = !this.filterProgram || student.program === this.filterProgram;
      const matchesStatus = !this.filterStatus || student.ojt_status === this.filterStatus;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }

  viewStudentRecords(student: any): void {
    this.selectedStudentId = student.student_id;
    this.loadRecords();
  }

  clearSelection(): void {
    this.selectedStudentId = '';
    this.records = [];
  }

  getSelectedStudentName(): string {
    const student = this.students.find((s) => s.student_id === this.selectedStudentId);
    return student ? `${student.first_name} ${student.last_name} - ${student.student_number}` : '';
  }

  loadRecords(): void {
    this.isLoadingRecords = true;
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/students/${this.selectedStudentId}/records`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.records = response.data;
            this.extractYears();
            this.applyRecordFilters();
          }
          this.isLoadingRecords = false;
        },
        error: (error) => {
          console.error('Error loading records:', error);
          this.isLoadingRecords = false;
        },
      });
  }

  validateRecord(recordId: number, status: string): void {
    Swal.fire({
      title: `Confirm ${status === 'approved' ? 'Approval' : 'Rejection'}`,
      input: 'textarea',
      inputLabel: 'Remarks (optional)',
      inputPlaceholder: 'Add any remarks here...',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = sessionStorage.getItem('auth_token');
        this.http
          .put(
            `${environment.apiUrl}/supervisors/records/${recordId}/validate`,
            {
              validation_status: status,
              supervisor_remarks: result.value || '',
            },
            {
              headers: { Authorization: token || '' },
            }
          )
          .subscribe({
            next: (response: any) => {
              if (response.status === 'success') {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: `Record ${status} successfully`,
                  timer: 1500,
                  showConfirmButton: false,
                });
                this.loadRecords();
              }
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to validate record',
              });
            },
          });
      }
    });
  }

  openEditModal(record: any): void {
    this.editingRecord = { ...record };
    // Extract just the time portion for the time inputs (HH:mm format)
    if (this.editingRecord.time_in) {
      const timeInDate = new Date(this.editingRecord.time_in);
      this.editingRecord.time_in = timeInDate.toTimeString().substring(0, 5); // HH:mm
    }
    if (this.editingRecord.time_out) {
      const timeOutDate = new Date(this.editingRecord.time_out);
      this.editingRecord.time_out = timeOutDate.toTimeString().substring(0, 5); // HH:mm
    }
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingRecord = null;
  }

  viewRecordDetails(record: any): void {
    this.viewingRecord = { ...record };
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewingRecord = null;
  }

  openEditFromView(): void {
    if (this.viewingRecord) {
      this.editingRecord = { ...this.viewingRecord };
      // Extract just the time portion for the time inputs (HH:mm format)
      if (this.editingRecord.time_in) {
        const timeInDate = new Date(this.editingRecord.time_in);
        this.editingRecord.time_in = timeInDate.toTimeString().substring(0, 5); // HH:mm
      }
      if (this.editingRecord.time_out) {
        const timeOutDate = new Date(this.editingRecord.time_out);
        this.editingRecord.time_out = timeOutDate.toTimeString().substring(0, 5); // HH:mm
      }
      this.showViewModal = false;
      this.showEditModal = true;
    }
  }

  validateFromView(status: string): void {
    if (this.viewingRecord) {
      const recordId = this.viewingRecord.id;
      this.closeViewModal();
      this.validateRecord(recordId, status);
    }
  }

  saveRecord(): void {
    if (!this.editingRecord) return;

    console.log('===== SAVE RECORD START =====');
    console.log('Editing record:', this.editingRecord);

    // Convert time strings (HH:mm) back to ISO datetime using the record's date
    // Use local time format (YYYY-MM-DDTHH:mm:ss) instead of UTC to preserve user's input time
    let timeInISO = this.editingRecord.time_in;
    let timeOutISO = this.editingRecord.time_out;

    if (this.editingRecord.time_in && this.editingRecord.date) {
      const [hours, minutes] = this.editingRecord.time_in.split(':');
      const dateObj = new Date(this.editingRecord.date);
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      // Format as local datetime: YYYY-MM-DDTHH:mm:ss
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hrs = String(dateObj.getHours()).padStart(2, '0');
      const mins = String(dateObj.getMinutes()).padStart(2, '0');
      const secs = String(dateObj.getSeconds()).padStart(2, '0');
      timeInISO = `${year}-${month}-${day}T${hrs}:${mins}:${secs}`;
      console.log('Converted time_in:', this.editingRecord.time_in, '->', timeInISO);
    }

    if (this.editingRecord.time_out && this.editingRecord.date) {
      const [hours, minutes] = this.editingRecord.time_out.split(':');
      const dateObj = new Date(this.editingRecord.date);
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      // Format as local datetime: YYYY-MM-DDTHH:mm:ss
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hrs = String(dateObj.getHours()).padStart(2, '0');
      const mins = String(dateObj.getMinutes()).padStart(2, '0');
      const secs = String(dateObj.getSeconds()).padStart(2, '0');
      timeOutISO = `${year}-${month}-${day}T${hrs}:${mins}:${secs}`;
      console.log('Converted time_out:', this.editingRecord.time_out, '->', timeOutISO);
    }

    const payload = {
      time_in: timeInISO,
      time_out: timeOutISO,
      tasks: this.editingRecord.tasks,
      accomplishments: this.editingRecord.accomplishments,
      supervisor_remarks: this.editingRecord.supervisor_remarks,
    };

    console.log('Sending payload:', payload);

    this.isSaving = true;
    const token = sessionStorage.getItem('auth_token');
    this.http
      .put(`${environment.apiUrl}/supervisors/records/${this.editingRecord.id}/update`, payload, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (response: any) => {
          console.log('✅ Update response received:', response);
          this.isSaving = false;
          if (response.status === 'success') {
            console.log('Response data:', response.data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Record updated successfully',
              timer: 1500,
              showConfirmButton: false,
            });
            this.closeEditModal();
            // Force reload of records
            console.log('Reloading records...');
            this.loadRecords();
          }
        },
        error: (error) => {
          console.error('❌ Update error:', error);
          this.isSaving = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update record',
          });
        },
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return timeString;
    }
  }

  extractYears(): void {
    const years = new Set<string>();
    this.records.forEach((record) => {
      if (record.date) {
        const year = new Date(record.date).getFullYear().toString();
        years.add(year);
      }
    });
    this.uniqueYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }

  applyRecordFilters(): void {
    this.filteredRecords = this.records.filter((record) => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear().toString();
      const recordMonth = (recordDate.getMonth() + 1).toString().padStart(2, '0');

      const yearMatch = !this.filterYear || recordYear === this.filterYear;
      const monthMatch = !this.filterMonth || recordMonth === this.filterMonth;

      return yearMatch && monthMatch;
    });
  }

  onDateFilterChange(): void {
    this.applyRecordFilters();
  }

  clearDateFilters(): void {
    this.filterYear = '';
    this.filterMonth = '';
    this.applyRecordFilters();
  }

  calculateHours(timeIn: string, timeOut: string): number {
    if (!timeIn || !timeOut) return 0;

    const parseTime = (timeStr: string) => {
      const date = new Date(timeStr);
      return date.getTime();
    };

    const inTime = parseTime(timeIn);
    const outTime = parseTime(timeOut);

    if (isNaN(inTime) || isNaN(outTime)) return 0;

    const diffMs = outTime - inTime;
    const hours = diffMs / (1000 * 60 * 60);

    return Math.round(hours * 100) / 100; // Round to 2 decimal places
  }

  getTotalApprovedHours(): number {
    // Accept both 'approved' and 'complete' as valid statuses
    const approvedRecords = this.records.filter(
      (r) => r.validation_status === 'approved' || r.validation_status === 'complete'
    );

    const total = approvedRecords.reduce((sum, record) => {
      // Use total_hours from backend if available, otherwise calculate
      if (record.total_hours) {
        return sum + parseFloat(record.total_hours);
      }
      return sum + this.calculateHours(record.time_in, record.time_out);
    }, 0);

    return Math.round(total * 100) / 100;
  }

  getRemainingHours(): number {
    const required = 486;
    const accomplished = this.getTotalApprovedHours();
    const remaining = required - accomplished;
    return Math.max(0, Math.round(remaining * 100) / 100);
  }

  getProgressPercentage(): number {
    const required = 486;
    const accomplished = this.getTotalApprovedHours();
    const percentage = (accomplished / required) * 100;
    return Math.min(100, Math.round(percentage * 10) / 10);
  }

  getApprovedDaysCount(): number {
    return this.records.filter(
      (r) => r.validation_status === 'approved' || r.validation_status === 'complete'
    ).length;
  }
}
