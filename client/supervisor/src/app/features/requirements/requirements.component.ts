import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.css',
})
export class RequirementsComponent implements OnInit {
  students: any[] = [];
  selectedStudentId: number | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  isSubmitting = false;
  readonly PERFORMANCE_APPRAISAL_ID = 17;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  downloadTemplate(): void {
    const token = sessionStorage.getItem('auth_token');

    this.http
      .get(`${environment.apiUrl}/supervisors/appraisal-template`, {
        headers: { Authorization: token || '' },
        responseType: 'blob',
      })
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Performance_Appraisal_Form_Template.pdf';
          link.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            icon: 'success',
            title: 'Downloaded',
            text: 'Appraisal form template downloaded successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: (error) => {
          console.error('Error downloading template:', error);
          Swal.fire({
            icon: 'error',
            title: 'Download Failed',
            text: 'Could not download the appraisal form template',
          });
        },
      });
  }

  loadStudents(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/my-students`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.students = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.isLoading = false;
        },
      });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select a PDF file',
        });
        event.target.value = '';
        return;
      }
      this.selectedFile = file;
    }
  }

  submitRequirement(): void {
    if (!this.selectedStudentId || !this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a student and choose a file',
      });
      return;
    }

    Swal.fire({
      title: 'Confirm Submission',
      text: 'Submit Performance Appraisal for this student?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadRequirement();
      }
    });
  }

  uploadRequirement(): void {
    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    const token = sessionStorage.getItem('auth_token');
    this.http
      .post(
        `${environment.apiUrl}/supervisors/students/${this.selectedStudentId}/requirements/${this.PERFORMANCE_APPRAISAL_ID}/submit`,
        formData,
        { headers: { Authorization: token || '' } }
      )
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Performance Appraisal submitted successfully',
              timer: 2000,
              showConfirmButton: false,
            });
            this.selectedFile = null;
            this.selectedStudentId = null;
            // Reset file input
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error.error?.message || 'Failed to submit Performance Appraisal',
          });
        },
      });
  }
}
