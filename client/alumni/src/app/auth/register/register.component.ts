import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DropdownModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  programs: any[] = [];
  graduationYears: any[] = [];
  employmentStatuses = [
    { label: 'Unemployed', value: 'unemployed' },
    { label: 'Employed', value: 'employed' },
    { label: 'Self-Employed', value: 'self-employed' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      phone_number: [''],
      sr_code: [''],
      program_id: [null, Validators.required],
      graduation_year: [null, Validators.required],
      current_employment_status: ['unemployed'],
      current_company: [''],
      current_position: [''],
      linkedin_url: [''],
    });
  }

  ngOnInit(): void {
    this.loadPrograms();
    this.generateGraduationYears();
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

  generateGraduationYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 50; i++) {
      const year = currentYear - i;
      this.graduationYears.push({ label: year.toString(), value: year });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirm_password')?.value;

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords do not match',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.keys(this.registerForm.value).forEach((key) => {
      if (key !== 'confirm_password' && this.registerForm.value[key]) {
        formData.append(key, this.registerForm.value[key]);
      }
    });

    this.http
      .post(`${environment.apiUrl}/alumni/register`, formData)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          Swal.fire({
            title: 'Success!',
            text: 'Registration successful. You can now login.',
            icon: 'success',
            confirmButtonColor: '#10b981',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Registration Failed',
            text: err.error?.detail || 'An error occurred during registration',
            icon: 'error',
            confirmButtonColor: '#ef4444',
          });
        },
      });
  }
}
