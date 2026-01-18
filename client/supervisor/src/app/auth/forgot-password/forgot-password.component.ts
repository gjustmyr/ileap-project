import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }

  sendResetLink() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const { email } = this.forgotPasswordForm.value;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: 'Success!',
            text: 'Password reset instructions have been sent to your email address.',
            icon: 'success',
            confirmButtonColor: '#16a34a'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: err?.error?.detail || 'Failed to send reset email. Please try again.',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
