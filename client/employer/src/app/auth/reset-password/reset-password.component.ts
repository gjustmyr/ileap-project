import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        Swal.fire({
          title: 'Invalid Link',
          text: 'This password reset link is invalid.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.loading = true;
      const { newPassword } = this.resetForm.value;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been reset successfully. Please login with your new password.',
            icon: 'success',
            confirmButtonColor: '#16a34a',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text:
              err?.error?.detail ||
              'Failed to reset password. The link may have expired.',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        },
      });
    }
  }
}
