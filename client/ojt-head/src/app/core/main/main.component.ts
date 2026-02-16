import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { OjtCoordinatorsComponent } from '../../features/ojt-coordinators/ojt-coordinators.component';
import { EmployersComponent } from '../../features/employers/employers.component';
import { InternshipsComponent } from '../../features/internships/internships.component';
import { RequirementsComponent } from '../../features/requirements/requirements.component';
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
    OjtCoordinatorsComponent,
    EmployersComponent,
    InternshipsComponent,
    RequirementsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  activeTab: number = 0;
  userEmail: string = '';
  userName: string = 'OJT Head';
  isUserDropdownOpen: boolean = false;
  currentDateTime: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.startClock();
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
    this.userEmail = sessionStorage.getItem('user_email') || '';

    // Extract name from email (before @)
    if (this.userEmail) {
      const emailName = this.userEmail.split('@')[0];
      this.userName =
        emailName
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'OJT Head';
    } else {
      this.userName = 'OJT Head';
    }
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout() {
    this.isUserDropdownOpen = false;
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
