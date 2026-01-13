import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    FileUploadModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.css'
})
export class RequirementsComponent implements OnInit {
  // Tab control
  activeTab: string = 'pre-ojt';
  
  // Student hiring and OJT status
  isHired: boolean = false;
  employerInfo: any = null;
  canSubmitRequirements: boolean = false;
  allRequirementsValidated: boolean = false;
  allPreOjtValidated: boolean = false;
  canStartOJT: boolean = false;
  ojtStatus: string = 'not-started';
  
  // Templates
  requirementTemplates: any[] = [];
  postOjtTemplates: any[] = [];
  environment = environment;
  
  // Pre-OJT Requirements
  preOjtRequirements: any[] = [
    {
      id: 1,
      name: 'Recommendation/Endorsement Letter',
      description: 'Letter of recommendation from faculty',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 2,
      name: 'Acceptance Form',
      description: 'Signed acceptance form from employer',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 3,
      name: 'Internship Training Agreement',
      description: 'Agreement between school, student, and employer',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 4,
      name: 'Student-Trainee\'s Personal History Statement',
      description: 'Personal history and background information',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 5,
      name: 'Resume/CV',
      description: 'Updated resume with complete information',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 6,
      name: 'Parent\'s Consent for Internship Training',
      description: 'Signed consent form from parent/guardian',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 7,
      name: 'Parent/Guardian\'s Valid ID',
      description: 'Copy of parent/guardian\'s valid government ID',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 8,
      name: 'Registration Form',
      description: 'OJT registration form',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 9,
      name: 'OJT Time Frame',
      description: 'Agreed schedule and duration of OJT',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 10,
      name: 'Location Map',
      description: 'Map showing location of internship site',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 11,
      name: 'Vaccination Card and PhilHealth ID',
      description: 'Proof of vaccination and PhilHealth membership',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 12,
      name: 'Certificate of Employment with attached job description',
      description: 'Certificate from employer with job description',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 13,
      name: 'Pre-OJT Counseling Slip from the OGC',
      description: 'Counseling slip from Guidance Office',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 14,
      name: 'Notarized Memorandum of Agreement (MOA)',
      description: 'Notarized MOA between all parties',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 15,
      name: 'Medical Certificate',
      description: 'Recent medical certificate (within 6 months)',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    }
  ];

  // Post-OJT Requirements
  postOjtRequirements: any[] = [
    {
      id: 16,
      name: 'Narrative Report',
      description: 'Comprehensive report of OJT experiences and learnings',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 17,
      name: 'Performance Appraisal Report',
      description: 'Evaluation report completed and submitted by your training supervisor',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null,
      supervisor_submitted: true
    },
    {
      id: 18,
      name: 'Training Supervisor Feedback',
      description: 'Feedback form completed by training supervisor',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    },
    {
      id: 19,
      name: 'OJT Related-Learning Experience',
      description: 'Documentation of practical skills and knowledge gained',
      status: 'pending',
      file_url: null,
      validated: false,
      returned: false,
      remarks: null
    }
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.checkHiringStatus();
    this.loadRequirements();
    this.loadTemplates();
  }

  loadTemplates(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/requirement-templates`, { headers })
      .subscribe({
        next: (response: any) => {
          const allTemplates = response.data || [];
          // Filter templates by type
          this.requirementTemplates = allTemplates.filter((t: any) => t.type === 'pre');
          this.postOjtTemplates = allTemplates.filter((t: any) => t.type === 'post');
        },
        error: (error) => {
          console.error('Error loading templates:', error);
        },
      });
  }

  previewTemplate(template: any): void {
    const templateUrl = `${environment.apiUrl}${template.template_url}`;
    window.open(templateUrl, '_blank');
  }

  downloadTemplate(template: any): void {
    const templateUrl = `${environment.apiUrl}${template.template_url}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = template.title || 'template';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  checkHiringStatus(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': token || ''
    });

    this.http.get(`${environment.apiUrl}/students/hiring-status`, { headers })
      .subscribe({
        next: (response: any) => {
          this.isHired = response.is_hired;
          this.employerInfo = response.employer_info;
          this.canSubmitRequirements = true; // Always allow submission to prepare in advance
          this.allRequirementsValidated = response.all_validated || false;
          this.canStartOJT = this.isHired && this.allRequirementsValidated;
        },
        error: (error) => {
          console.error('Error checking hiring status:', error);
          this.canSubmitRequirements = true; // Allow submission even if check fails
        }
      });
  }

  loadRequirements(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': token || ''
    });

    // First get the student_id from profile
    this.http.get(`${environment.apiUrl}/students/profile`, { headers })
      .subscribe({
        next: (profileResponse: any) => {
          const studentId = profileResponse.data?.student_id;
          
          if (!studentId) {
            console.error('Student ID not found in profile response');
            return;
          }
          
          // Now fetch the requirements using student_id
          this.http.get(`${environment.apiUrl}/requirements/student/${studentId}`, { headers })
            .subscribe({
              next: (response: any) => {
                if (response.status === 'success' && response.requirements.length > 0) {
                  // Create a map of requirement_id to submission data
                  const submissionMap = new Map();
                  response.requirements.forEach((sub: any) => {
                    submissionMap.set(sub.requirement_id, sub);
                  });
                  
                  // Update preOjtRequirements with actual submission data
                  this.preOjtRequirements = this.preOjtRequirements.map(req => {
                    const submission = submissionMap.get(req.id);
                    if (submission) {
                      return {
                        ...req,
                        status: submission.status,
                        file_url: submission.file_url,
                        validated: submission.validated,
                        returned: submission.returned,
                        remarks: submission.remarks
                      };
                    }
                    return req;
                  });

                  // Update postOjtRequirements with actual submission data
                  this.postOjtRequirements = this.postOjtRequirements.map(req => {
                    const submission = submissionMap.get(req.id);
                    if (submission) {
                      return {
                        ...req,
                        status: submission.status,
                        file_url: submission.file_url,
                        validated: submission.validated,
                        returned: submission.returned,
                        remarks: submission.remarks
                      };
                    }
                    return req;
                  });
                  
                  // Check if all Pre-OJT requirements are validated
                  this.checkPreOjtValidation();
                  
                  console.log('Requirements loaded successfully');
                }
              },
              error: (error) => {
                console.error('Error loading requirements:', error);
              }
            });
        },
        error: (error) => {
          console.error('Error loading student profile:', error);
        }
      });
  }

  checkPreOjtValidation(): void {
    this.allPreOjtValidated = this.preOjtRequirements.every(req => req.validated);
  }

  onFileSelect(event: any, requirement: any, requirementType: string = 'pre-ojt'): void {
    const file = event.files[0];
    if (file) {
      this.uploadFile(file, requirement, requirementType);
    }
  }

  uploadFile(file: File, requirement: any, requirementType: string = 'pre-ojt'): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirement_id', requirement.id.toString());
    
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': token || ''
    });

    this.http.post(`${environment.apiUrl}/requirements/upload`, formData, { headers })
      .subscribe({
        next: (response: any) => {
          requirement.status = 'submitted';
          requirement.file_url = response.file_url;
          requirement.validated = false; // Not validated until coordinator reviews
          requirement.returned = false; // Reset returned status
          requirement.remarks = null; // Clear any previous remarks
          
          // Update validation status for Pre-OJT requirements
          if (requirementType === 'pre-ojt') {
            this.checkPreOjtValidation();
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Uploaded Successfully!',
            text: `${requirement.name} has been submitted`,
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: error.error?.detail || 'Failed to upload file. Please try again.',
            confirmButtonColor: '#ef4444'
          });
        }
      });
  }

  viewFile(url: string): void {
    window.open(url, '_blank');
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'pending': 'warn',
      'submitted': 'info',
      'approved': 'success',
      'rejected': 'danger'
    };
    return severityMap[status] || 'info';
  }
}
