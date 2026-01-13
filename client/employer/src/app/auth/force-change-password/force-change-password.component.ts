import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './force-change-password.component.html',
  styleUrl: './force-change-password.component.css',
})
export class ForceChangePasswordComponent {
  changeForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.changeForm = this.fb.group(
      {
        current_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  get current_password(): AbstractControl {
    return this.changeForm.get('current_password')!;
  }

  get new_password(): AbstractControl {
    return this.changeForm.get('new_password')!;
  }

  get confirm_password(): AbstractControl {
    return this.changeForm.get('confirm_password')!;
  }

  matchPasswords(group: AbstractControl): { mismatch: true } | null {
    const newPass = group.get('new_password')?.value;
    const confirmPass = group.get('confirm_password')?.value;

    if (newPass !== undefined && confirmPass !== undefined) {
      return newPass === confirmPass ? null : { mismatch: true };
    }

    return null;
  }

  onSubmit(e: Event): void {
    e.preventDefault();

    if (this.changeForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Please correct the errors in the form.',
        icon: 'error',
      });
      return;
    }

    const { current_password, new_password } = this.changeForm.value;
    const user_id = sessionStorage.getItem('user_id');

    this.loading = true;

    this.authService
      .changePassword(user_id, current_password, new_password)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status === 'SUCCESS') {
            Swal.fire({
              title: 'Password Changed',
              text: 'You will now be redirected to your dashboard.',
              icon: 'success',
              confirmButtonColor: '#16a34a',
            }).then(() => this.router.navigate(['/dashboard']));
          } else {
            Swal.fire({
              title: 'Error',
              text: res.message || 'Password change failed.',
              icon: 'error',
            });
          }
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'Server error.',
            icon: 'error',
          });
        },
      });
  }
}
