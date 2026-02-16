import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { JobListingsComponent } from '../../features/job-listings/job-listings.component';
import { CompanyProfileComponent } from '../../features/company-profile/company-profile.component';
import { TraineeSupervisorsComponent } from '../../features/trainee-supervisors/trainee-supervisors.component';
import { ApplicationsComponent } from '../../features/applications/applications.component';
import { OjtMonitoringComponent } from '../../features/ojt-monitoring/ojt-monitoring.component';
import { RequirementsComponent } from '../../features/requirements/requirements.component';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    CommonModule,
    DashboardComponent,
    JobListingsComponent,
    ApplicationsComponent,
    CompanyProfileComponent,
    TraineeSupervisorsComponent,
    OjtMonitoringComponent,
    RequirementsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  activeTab: number = 0;
  dateTime: string = '';
  currentDateTime: string = '';
  userName: string = 'Employer';
  isUserDropdownOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.startClock();
    
    // Keep old dateTime for backward compatibility
    setInterval(() => {
      const now = new Date();

      const time = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      this.dateTime = `${date}, ${time}`;
    }, 1000);
  }

  startClock(): void {
    // Update time immediately
    this.updateDateTime();
    
    // Update every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime(): void {
    const now = new Date();
    
    // Format time (12-hour format with AM/PM)
    const time = now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Format date
    const date = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    this.currentDateTime = `${time} - ${date}`;
  }

  loadUserInfo(): void {
    const userEmail = sessionStorage.getItem('user_email') || '';

    // Extract name from email (before @)
    if (userEmail) {
      const emailName = userEmail.split('@')[0];
      this.userName =
        emailName
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'Employer';
    } else {
      this.userName = 'Employer';
    }
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  onTabChange(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  logout() {
    this.isUserDropdownOpen = false;
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
