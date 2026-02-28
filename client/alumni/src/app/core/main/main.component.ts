import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { JobSearchComponent } from '../../features/job-search/job-search.component';
import { JobApplicationsComponent } from '../../features/job-applications/job-applications.component';
import { ProfileComponent } from '../../features/profile/profile.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    DashboardComponent,
    JobSearchComponent,
    JobApplicationsComponent,
    ProfileComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  activeTab: number = 0;
  userName: string = 'Alumni Portal';
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
    const userInfoStr = sessionStorage.getItem('user_info');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
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

    const userEmail = sessionStorage.getItem('user_email') || '';
    if (userEmail) {
      const emailName = userEmail.split('@')[0];
      this.userName =
        emailName
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'Alumni Portal';
    } else {
      this.userName = 'Alumni Portal';
    }
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  showContactModal = false;

  navigateToProfile() {
    this.isUserDropdownOpen = false;
    this.activeTab = 3;
  }

  navigateToChangePassword() {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/change-password']);
  }

  openContactModal() {
    this.isUserDropdownOpen = false;
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
  }

  logout() {
    this.isUserDropdownOpen = false;
    this.authService.logout();
  }
}
