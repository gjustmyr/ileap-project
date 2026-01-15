import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      this.authService.validateToken().subscribe({
        next: () => {
          console.log('User already logged in, redirecting to dashboard...');
          this.router.navigate(['/main/dashboard']);
        },
        error: () => {
          sessionStorage.clear();
        }
      });
    }
  }

  get email_address() {
    return this.loginForm.get('email_address')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  verifyUser(e: Event) {
    e.preventDefault();

    if (this.loginForm.valid) {
      this.loading = true;

      const { email_address, password } = this.loginForm.value;

      this.authService.loginUser(email_address, password).subscribe({
        next: (response: any) => {
          this.loading = false;

          if (response.status === 'success') {
            sessionStorage.setItem('auth_token', `Bearer ${response.data.token}`);
            sessionStorage.setItem('user_id', response.data.user.user_id);

            Swal.fire({
              title: 'Login Successful!',
              text: `Welcome back!`,
              icon: 'success',
              confirmButtonColor: '#16a34a',
            }).then(() => {
              this.router.navigate(['/ojt-coordinator']);
            });
          } else {
            Swal.fire({
              title: 'Login Failed',
              text: response.message || 'Unknown error.',
              icon: 'error',
              confirmButtonColor: '#dc2626',
            });
          }
        },
        error: (err: any) => {
          this.loading = false;
          Swal.fire({
            title: 'Login Failed',
            text: err?.error?.message || 'Something went wrong.',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Login Failed',
        text: 'Please provide a valid email and password.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
      });
    }
  }
}
