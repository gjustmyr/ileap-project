import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been changed successfully.',
            icon: 'success',
            confirmButtonColor: '#16a34a',
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: err?.error?.detail || 'Failed to change password.',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
