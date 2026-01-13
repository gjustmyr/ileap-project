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
import Swal from 'sweetalert2';

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
  dateTime: string = '';

  constructor(private router: Router, private authService: AuthService) {}

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

  logout() {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Show logging out toast
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'Logging out...',
          showConfirmButton: false,
          timer: 1000,
        });

        // Delay to show the toast, then logout
        setTimeout(() => {
          this.authService.logout();
        }, 1000);
      }
    });
  }
  searchText = '';

  appliedJobs = [
    {
      id: 1,
      companyId: 101,
      companyName: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      workMode: 'Hybrid',
      dateApplied: new Date('2025-06-15'),
      status: 'Pending',
    },
    {
      id: 2,
      companyId: 102,
      companyName: 'CreativeSoft',
      position: 'UI/UX Designer',
      workMode: 'Remote',
      dateApplied: new Date('2025-06-10'),
      status: 'Accepted',
    },
  ];

  viewCompany(id: number) {
    // Navigate or open modal
    console.log('View company', id);
  }

  cancelApplication(id: number) {
    // Your cancel logic here
    console.log('Cancel application', id);
  }

  jobs = [
    {
      title: 'Fullstack Developer',
      company: 'Batangas State University',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et elit quis arcu volutpat molestie. Nam sit amet cursus ex.',
      status: 'Open',
    },
    {
      title: 'Frontend Developer',
      company: 'Batangas State University',
      description:
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      status: 'Open',
    },
    {
      title: 'Backend Developer',
      company: 'Innovative Tech Solutions Inc.',
      description:
        'Responsible for developing server-side logic, maintaining central databases, and ensuring high performance and responsiveness.',
      status: 'Closed',
    },
    {
      title: 'UI/UX Designer',
      company: 'Creative Minds Studio',
      description:
        'Design user-friendly interfaces and improve user experience across web and mobile applications.',
      status: 'Open',
    },
    {
      title: 'Mobile App Developer',
      company: 'AppVantage Corp.',
      description:
        'Develop native Android/iOS applications and maintain existing mobile systems with performance enhancements.',
      status: 'Open',
    },
    {
      title: 'Data Analyst Intern',
      company: 'Insight Analytics PH',
      description:
        'Assist in collecting, processing, and performing statistical analyses on large datasets to uncover trends.',
      status: 'Open',
    },
    {
      title: 'Cybersecurity Intern',
      company: 'ShieldSec Corporation',
      description:
        'Monitor systems for vulnerabilities, implement security measures, and assist in audits and threat analysis.',
      status: 'Closed',
    },
    {
      title: 'DevOps Assistant',
      company: 'CloudStack Innovations',
      description:
        'Support CI/CD pipeline implementation and help manage scalable infrastructure on cloud platforms.',
      status: 'Open',
    },
    {
      title: 'QA Tester',
      company: 'TestLab Solutions',
      description:
        'Create test plans, execute manual and automated tests, and ensure high product quality.',
      status: 'Open',
    },
    {
      title: 'Technical Writer',
      company: 'BrightDocs Ltd.',
      description:
        'Produce documentation for software products, including user guides, FAQs, and developer references.',
      status: 'Open',
    },
  ];

  workingArrangement: string = 'Work from Home';
  taskForTheDay: string = '';
  accomplishmentForTheDay: string = '';

  arrangementOptions = [
    { label: 'Work from Home', value: 'Work from Home' },
    { label: 'On-Site', value: 'On-Site' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Skeletal Workforce', value: 'Skeletal Workforce' },
  ];

  saveLogs() {
    console.log('Task:', this.taskForTheDay);
    console.log('Accomplishment:', this.accomplishmentForTheDay);

    // You can add an HTTP request or toast message here
    alert('Your logs have been saved!');
  }
}
