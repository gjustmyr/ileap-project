import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { ProfileComponent } from '../../features/profile/profile.component';
import { InternshipsComponent } from '../../features/internships/internships.component';
import { RequirementsComponent } from '../../features/requirements/requirements.component';
import { OjtTrackerComponent } from '../../features/ojt-tracker/ojt-tracker.component';
import { OeamsComponent } from '../../features/oeams/oeams.component';
import { StudentService } from '../../shared/services/student.service';
import { InternshipsService } from '../../features/internships/internships.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    TableModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    EditorModule,
    ProfileComponent,
    InternshipsComponent,
    RequirementsComponent,
    OjtTrackerComponent,
    OeamsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  dateTime: string = '';
  activeTab: number = 0;
  showEditDialog: boolean = false;
  profileData: any = null;
  isLoadingProfile: boolean = false;
  isLoadingApplications: boolean = false;

  constructor(
    private studentService: StudentService,
    private internshipsService: InternshipsService,
    private router: Router
  ) {}

  openEditProfile() {
    this.showEditDialog = true;
  }

  closeEditProfile() {
    this.showEditDialog = false;
  }

  onProfileSaved() {
    // Close the modal and reload the profile data
    this.showEditDialog = false;
    this.loadProfile();
  }

  loadProfile() {
    this.isLoadingProfile = true;
    this.studentService.getProfile().subscribe({
      next: (response) => {
        this.profileData = response.data;
        // Fix profile picture URL if it's a relative path
        if (this.profileData.profile_picture && this.profileData.profile_picture.startsWith('/uploads/')) {
          this.profileData.profile_picture = environment.apiUrl.replace('/api', '') + this.profileData.profile_picture;
        }
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoadingProfile = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadApplications();
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
    // Clear session storage
    sessionStorage.clear();

    // Redirect to login
    this.router.navigate(['/login']);
  }
  searchText = '';

  appliedJobs: any[] = [];

  loadApplications() {
    this.isLoadingApplications = true;
    this.internshipsService.getMyApplications().subscribe({
      next: (response) => {
        // Map the response to match the table format
        this.appliedJobs = response.data.map((app: any) => ({
          id: app.application_id,
          internshipId: app.internship_id,
          companyName: app.internship?.company_name || 'N/A',
          position: app.internship?.title || 'N/A',
          dateApplied: new Date(app.created_at),
          status: this.mapStatus(app.status),
          remarks: app.remarks,
          applicationLetter: app.application_letter,
          resumePath: app.resume_path,
        }));
        this.isLoadingApplications = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load your applications',
        });
        this.isLoadingApplications = false;
      },
    });
  }

  mapStatus(status: string): string {
    const statusMap: any = {
      pending: 'Pending',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return statusMap[status] || 'Pending';
  }

  viewCompany(id: number) {
    // Navigate or open modal
    console.log('View company', id);
  }

  cancelApplication(applicationId: number) {
    Swal.fire({
      title: 'Cancel Application?',
      text: 'Are you sure you want to withdraw this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.internshipsService.withdrawApplication(applicationId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cancelled',
              text: 'Your application has been withdrawn',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.loadApplications();
          },
          error: (error) => {
            console.error('Error cancelling application:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.detail || 'Failed to cancel application',
            });
          },
        });
      }
    });
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
    Swal.fire({
      icon: 'success',
      title: 'Saved',
      text: 'Your logs have been saved!',
      confirmButtonColor: '#10b981',
    });
  }
}
