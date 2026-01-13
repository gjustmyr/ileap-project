import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profile: any = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    position: '',
    department: '',
  };
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    this.http
      .get(`${environment.apiUrl}/supervisors/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.profile = response.data;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.isLoading = false;
        },
      });
  }

  updateProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    this.http
      .put(`${environment.apiUrl}/supervisors/me`, this.profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Profile updated successfully',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update profile',
          });
        },
      });
  }
}
