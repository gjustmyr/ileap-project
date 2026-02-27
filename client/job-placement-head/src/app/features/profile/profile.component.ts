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
import { Router } from '@angular/router';

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
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position_title: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    // Get user info from session storage
    const userInfoStr = sessionStorage.getItem('user_info');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        this.userId = userInfo.user_id;

        this.profileForm.patchValue({
          first_name: userInfo.first_name || '',
          last_name: userInfo.last_name || '',
          email: userInfo.email || '',
          position_title: userInfo.position_title || '',
        });
      } catch (e) {
        console.error('Error loading profile:', e);
      }
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

    const payload = {
      user_id: this.userId,
      ...this.profileForm.value,
    };

    this.http
      .patch(`${environment.apiUrl}/jp-officers/profile`, payload, { headers })
      .subscribe({
        next: (response: any) => {
          this.loading = false;

          // Update session storage with new info
          const updatedUserInfo = {
            ...JSON.parse(sessionStorage.getItem('user_info') || '{}'),
            ...this.profileForm.value,
          };
          sessionStorage.setItem('user_info', JSON.stringify(updatedUserInfo));

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

  goBack(): void {
    this.router.navigate(['/job-placement-head']);
  }
}
