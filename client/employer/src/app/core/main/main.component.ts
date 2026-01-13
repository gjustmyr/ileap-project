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

  constructor(private router: Router) {}

  ngOnInit(): void {
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

  onTabChange(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
