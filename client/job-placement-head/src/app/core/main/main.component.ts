import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { EmployersComponent } from '../../features/employers/employers.component';
import { JobPostingsComponent } from '../../features/job-postings/job-postings.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    TableModule,
    CommonModule,
    FormsModule,
    EditorModule,
    DashboardComponent,
    EmployersComponent,
    JobPostingsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  activeTab: number = 0;
  userEmail: string = '';
  userName: string = 'Job Placement Portal';
  isUserDropdownOpen: boolean = false;
  currentDateTime: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.startClock();
  }

  startClock(): void {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime(): void {
    const now = new Date();
    const time = now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    const date = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    this.currentDateTime = `${time} - ${date}`;
  }

  loadUserInfo(): void {
    // Try to get user info from session storage first
    const userInfoStr = sessionStorage.getItem('user_info');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // For job placement officers, the name might be in different fields
        if (userInfo.first_name && userInfo.last_name) {
          this.userName = `${userInfo.first_name} ${userInfo.last_name}`;
          return;
        } else if (userInfo.name) {
          this.userName = userInfo.name;
          return;
        }
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }

    // Fallback: try to get from email
    this.userEmail = sessionStorage.getItem('user_email') || '';
    if (this.userEmail) {
      const emailName = this.userEmail.split('@')[0];
      this.userName =
        emailName
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'Job Placement Portal';
    } else {
      this.userName = 'Job Placement Portal';
    }
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  navigateToProfile() {
    this.isUserDropdownOpen = false;
    // Navigate to profile page (to be created)
    this.router.navigate(['/job-placement-head/profile']);
  }

  navigateToChangePassword() {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.isUserDropdownOpen = false;
    this.authService.logout();
  }
}
