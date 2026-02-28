import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  programs: any[] = [];
  employmentStatuses = [
    { label: 'Unemployed', value: 'unemployed' },
    { label: 'Employed', value: 'employed' },
    { label: 'Self-Employed', value: 'self-employed' },
  ];
  resumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone_number: [''],
      sr_code: [{ value: '', disabled: true }],
      program_id: [{ value: null, disabled: true }],
      graduation_year: [{ value: null, disabled: true }],
      current_employment_status: ['unemployed'],
      current_company: [''],
      current_position: [''],
      linkedin_url: [''],
    });
  }

  ngOnInit(): void {
    this.loadPrograms();
    this.loadProfile();
  }

  loadPrograms(): void {
    this.http.get(`${environment.apiUrl}/dropdowns/programs`).subscribe({
      next: (response: any) => {
        this.programs = response.map((p: any) => ({
          label: p.program_name,
          value: p.program_id,
        }));
      },
      error: (err) => console.error('Failed to load programs', err),
    });
  }

  loadProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http.get(`${environment.apiUrl}/alumni/me`, { headers }).subscribe({
      next: (response: any) => {
        this.profileForm.patchValue(response.data);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to load profile',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Resume file must be less than 5MB',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        event.target.value = '';
        return;
      }
      this.resumeFile = file;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });
    const formData = new FormData();

    Object.keys(this.profileForm.value).forEach((key) => {
      if (this.profileForm.value[key]) {
        formData.append(key, this.profileForm.value[key]);
      }
    });

    if (this.resumeFile) {
      formData.append('resume', this.resumeFile);
    }

    this.http
      .patch(`${environment.apiUrl}/alumni/me`, formData, { headers })
      .subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: err.error?.detail || 'Failed to update profile',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        },
      });
  }
}
