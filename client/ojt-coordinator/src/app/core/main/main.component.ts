import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { RequirementsService } from '../../features/requirements/requirements.service';
import { HeaderComponent } from '../header/header.component';
import { RequirementsComponent } from '../../features/requirements/requirements.component';

@Component({
  selector: 'app-main',
  imports: [
    TabsModule,
    TableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule,
    DialogModule,
    ChartModule,
    CardModule,
    DropdownModule,
    HeaderComponent,
    RequirementsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  dateTime: string = '';
  activeTab: number = 1; // Default to Class Listing

  // Create Class Modal
  showCreateClassModal: boolean = false;
  createClassForm!: FormGroup;
  csvFile: File | null = null;
  csvFileName: string = '';
  isLoading: boolean = false;

  // Dropdown options
  schoolYearOptions = [
    { label: '2024-2025', value: '2024-2025' },
    { label: '2025-2026', value: '2025-2026' },
    { label: '2026-2027', value: '2026-2027' },
  ];

  semesterOptions = [
    { label: 'First Semester', value: 'FIRST' },
    { label: 'Second Semester', value: 'SECOND' },
    { label: 'Summer', value: 'SUMMER' },
  ];

  // Programs will be loaded from backend based on coordinator's department
  programOptions: any[] = [];

  // Sections will be loaded based on selected program
  sectionOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private requirementsService: RequirementsService
  ) {}

  ngOnInit(): void {
    this.initializeCreateClassForm();
    this.loadProgramsByDepartment(); // Load programs based on coordinator's department
    this.loadClassList(); // Load existing classes
    this.applyClassListFilters();
    this.loadInternships(); // Load internship opportunities
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

  loadProgramsByDepartment(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: token, // Token already includes 'Bearer ' prefix
    });

    console.log(
      'Fetching programs from:',
      `${environment.apiUrl}/classes/programs`
    );
    console.log('Token:', token ? 'Token exists' : 'No token');

    this.http
      .get<any[]>(`${environment.apiUrl}/classes/programs`, { headers })
      .subscribe({
        next: (programs) => {
          console.log('Programs loaded successfully:', programs);
          this.programOptions = programs;
        },
        error: (error) => {
          console.error('Error loading programs:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.error);

          // Show error only if it's not a 401 (unauthorized) during initial load
          if (error.status !== 401) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                error.error?.detail ||
                'Failed to load programs. Please refresh the page.',
            });
          }
        },
      });
  }

  initializeCreateClassForm(): void {
    this.createClassForm = this.fb.group({
      schoolYear: ['', Validators.required],
      semester: ['', Validators.required],
      program: ['', Validators.required],
      section: ['', Validators.required],
      csvRequired: [false, Validators.requiredTrue],
    });
  }

  onProgramChange(event: any): void {
    const programAbbrev = event.value;
    console.log('Program changed:', programAbbrev);
    if (programAbbrev) {
      this.loadSectionsByProgram(programAbbrev);
    } else {
      this.sectionOptions = [];
      this.createClassForm.patchValue({ section: null });
    }
  }

  loadSectionsByProgram(programAbbrev: string): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: token,
    });

    const url = `${environment.apiUrl}/classes/sections/${programAbbrev}`;
    console.log('Loading sections from:', url);
    console.log('Program abbreviation:', programAbbrev);

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (sections) => {
        console.log('Sections loaded successfully:', sections);
        console.log('Number of sections:', sections.length);
        this.sectionOptions = sections;
        // Reset section field when program changes
        this.createClassForm.patchValue({ section: null });
      },
      error: (error) => {
        console.error('Error loading sections:', error);
        console.error('Error status:', error.status);
        console.error('Error detail:', error.error);
        this.sectionOptions = [];
        this.createClassForm.patchValue({ section: null });

        if (error.status !== 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.detail ||
              'Failed to load sections. Please try again.',
          });
        }
      },
    });
  }

  onCSVFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload a CSV file',
        });
        return;
      }

      this.csvFile = file;
      this.csvFileName = file.name;
      this.createClassForm.patchValue({ csvRequired: true });
    }
  }

  clearCSVFile(): void {
    this.csvFile = null;
    this.csvFileName = '';
    this.createClassForm.patchValue({ csvRequired: false });
  }

  downloadCSVTemplate(): void {
    const headers = ['SR Code', 'First Name', 'Last Name', 'Email'];
    const sampleData = [
      ['12-34567', 'Juan', 'Dela Cruz', 'juan.delacruz@example.com'],
      ['12-34568', 'Maria', 'Santos', 'maria.santos@example.com'],
      ['12-34569', 'Jose', 'Reyes', 'jose.reyes@example.com'],
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...sampleData.map((row) => row.join(',')),
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'student_list_template.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  submitCreateClass(): void {
    if (this.createClassForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields and upload student CSV',
      });
      return;
    }

    if (!this.csvFile) {
      Swal.fire({
        icon: 'warning',
        title: 'CSV Required',
        text: 'Please upload a CSV file with student information',
      });
      return;
    }

    this.isLoading = true;

    const formValue = this.createClassForm.value;
    const formData = new FormData();

    // Generate class section name (e.g., BCPET-1201)
    const classSection = `${formValue.program}-12${formValue.section}`;

    formData.append('school_year', formValue.schoolYear);
    formData.append('semester', formValue.semester);
    formData.append('program', formValue.program);
    formData.append('section', formValue.section);
    formData.append('class_section', classSection);
    formData.append('students_csv', this.csvFile);

    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '', // Token already includes 'Bearer ' prefix
    });

    this.http
      .post(`${environment.apiUrl}/classes`, formData, { headers })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;

          Swal.fire({
            icon: 'success',
            title: 'Class Created',
            text:
              response.message ||
              `Class ${classSection} has been created successfully!`,
          }).then(() => {
            this.showCreateClassModal = false;
            this.createClassForm.reset();
            this.clearCSVFile();
            this.loadClassList(); // Refresh the class list
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating class:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.detail ||
              'Failed to create class. Please try again.',
          });
        },
      });
  }

  closeCreateClassModal(): void {
    this.showCreateClassModal = false;
    this.createClassForm.reset();
    this.clearCSVFile();
  }

  applyClassListFilters(): void {
    this.filteredClassList = this.classList.filter((classItem) => {
      const matchesSearch =
        !this.classListFilters.searchTerm ||
        classItem.classSection
          ?.toLowerCase()
          .includes(this.classListFilters.searchTerm.toLowerCase()) ||
        classItem.schoolyear
          ?.toLowerCase()
          .includes(this.classListFilters.searchTerm.toLowerCase());

      const matchesSchoolYear =
        !this.classListFilters.schoolYear ||
        classItem.schoolyear === this.classListFilters.schoolYear;

      const matchesSemester =
        !this.classListFilters.semester ||
        classItem.semester === this.classListFilters.semester;

      const matchesProgram =
        !this.classListFilters.program ||
        classItem.classSection?.startsWith(this.classListFilters.program);

      return (
        matchesSearch && matchesSchoolYear && matchesSemester && matchesProgram
      );
    });
  }

  clearClassListFilters(): void {
    this.classListFilters = {
      searchTerm: '',
      schoolYear: null,
      semester: null,
      program: null,
    };
    this.applyClassListFilters();
  }

  loadClassList(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: token, // Token already includes 'Bearer ' prefix
    });

    this.http.get<any>(`${environment.apiUrl}/classes`, { headers }).subscribe({
      next: (response) => {
        this.classList = response.classes || [];
        this.applyClassListFilters();
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      },
    });
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  applyDashboardFilters() {
    // TODO: Implement dashboard filter logic
    console.log('Dashboard filters applied:', {
      section: this.selectedSection,
      program: this.selectedProgram,
      semester: this.selectedSemester,
    });
    Swal.fire({
      icon: 'success',
      title: 'Filters Applied',
      text: 'Dashboard data has been filtered',
      confirmButtonColor: '#10b981',
      timer: 1500,
    });
  }

  resetDashboardFilters() {
    this.selectedSection = '';
    this.selectedProgram = '';
    this.selectedSemester = '';
    Swal.fire({
      icon: 'info',
      title: 'Filters Reset',
      text: 'All filters have been cleared',
      confirmButtonColor: '#10b981',
      timer: 1500,
    });
  }

  classList: any[] = [];

  // Class List Filters
  classListFilters = {
    searchTerm: '',
    schoolYear: null,
    semester: null,
    program: null,
  };

  filteredClassList: any[] = [];
  classListRowsPerPage: number = 10;
  classListPageOptions = [5, 10, 20, 50];

  dialogVisible = false;
  selectedClassSection: string = '';
  studentSearch: string = '';
  selectedStudents: any[] = [];

  // View Requirements Modal
  viewRequirementsVisible = false;
  selectedStudent: any = null;

  // Preview Requirement Modal
  previewRequirementVisible = false;
  selectedRequirement: any = null;

  // Return Requirement Modal
  returnRequirementVisible = false;
  returnRemarks: string = '';

  // Pre-OJT Requirements
  preOjtRequirements = [
    'Recommendation/Endorsement Letter',
    'Acceptance Form',
    'Internship Training Agreement',
    "Student-Trainee's Personal History Statement",
    'Resume/CV',
    "Parent's Consent for Internship Training",
    "Parent/Guardian's Valid ID",
    'Registration Form',
    'OJT Time Frame',
    'Location Map',
    'Vaccination Card and PhilHealth ID',
    'Certificate of Employment with attached job description',
    'Pre-OJT Counseling Slip from the OGC',
    'Notarized Memorandum of Agreement (MOA)',
    'Medical Certificate',
  ];

  // Post-OJT Requirements
  postOjtRequirements = [
    'Narrative Report',
    "Student Trainee's Performance Appraisal Report",
    "Training Supervisor's Feedback Form",
    'OJT Related-Learning Experience',
  ];

  studentsPerSection: { [key: string]: any[] } = {};

  // Internship Listing
  internships: any[] = [];
  filteredInternships: any[] = [];
  isLoadingInternships: boolean = false;
  internshipIndustries: any[] = [];
  internshipCompanies: any[] = [];

  internshipFilters = {
    searchKeyword: '',
    industry: null,
    company: null,
    status: null,
  };

  selectedInternship: any = null;
  showInternshipDetails: boolean = false;

  openDialog(section: string): void {
    this.selectedClassSection = section;
    this.studentSearch = '';
    this.dialogVisible = true;

    // Load students for this class section
    this.loadStudentsForClass(section);
  }

  loadStudentsForClass(section: string): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: token,
    });

    // Find the class by section name
    const classData = this.classList.find((c) => c.classSection === section);
    if (!classData) {
      console.error('Class not found');
      return;
    }

    // Fetch students for this class
    this.http
      .get<any>(
        `${environment.apiUrl}/classes/${classData.class_id}/students`,
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.selectedStudents = response.students || [];
          this.studentsPerSection[section] = this.selectedStudents;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.selectedStudents = [];
        },
      });
  }

  filteredStudents(): any[] {
    const query = this.studentSearch.toLowerCase().trim();
    return this.selectedStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.company?.toLowerCase().includes(query)
    );
  }

  canSubmitGrade(student: any): boolean {
    // Grade can only be submitted when:
    // 1. OJT is completed
    // 2. All post-OJT requirements are validated (postCompleted === postTotal)
    // 3. Grade hasn't been submitted yet (no finalGrade)
    return (
      student.ojtStatus === 'Completed' &&
      student.postCompleted === student.postTotal &&
      student.postTotal > 0 &&
      !student.finalGrade
    );
  }

  submitGrade(student: any): void {
    if (!student.selectedGrade) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a grade first',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Submit Grade',
      text: `Submit grade ${student.selectedGrade} for ${student.name}?`,
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        student.gradeSaving = true;
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders({
          Authorization: token || '',
        });

        this.http
          .post(
            `${environment.apiUrl}/students/${student.student_id}/grade`,
            { grade: student.selectedGrade },
            { headers }
          )
          .subscribe({
            next: () => {
              student.gradeSaving = false;
              student.finalGrade = student.selectedGrade;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Grade submitted successfully',
                confirmButtonColor: '#10b981',
                timer: 1500,
              });
            },
            error: (error) => {
              student.gradeSaving = false;
              console.error('Error submitting grade:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit grade',
                confirmButtonColor: '#10b981',
              });
            },
          });
      }
    });
  }

  openViewRequirements(student: any): void {
    this.selectedStudent = student;
    this.viewRequirementsVisible = true;

    // Fetch actual submitted requirements from backend
    // Use student_id field from backend response
    this.loadStudentRequirements(student.student_id);
  }

  loadStudentRequirements(studentId: number): void {
    if (!studentId) {
      console.error('No student ID provided');
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http
      .get(`${environment.apiUrl}/requirements/student/${studentId}`, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            // Update requirements with actual submission data
            this.updateRequirementsWithSubmissions(response.requirements);
          }
        },
        error: (error) => {
          console.error('Error loading student requirements:', error);
        },
      });
  }

  updateRequirementsWithSubmissions(submissions: any[]): void {
    // Store submissions in requirementsList for validation functions
    this.requirementsList = submissions;

    // Create a map of requirement_id to submission
    const submissionMap = new Map();
    submissions.forEach((sub) => {
      submissionMap.set(sub.requirement_id, sub);
    });

    // Update selectedStudent with submission counts
    let accomplishedCount = 0;
    submissions.forEach((sub) => {
      if (sub.status === 'submitted' && !sub.returned) {
        accomplishedCount++;
      }
    });

    if (this.selectedStudent) {
      this.selectedStudent.submittedRequirements = submissionMap;
      this.selectedStudent.accomplishedFromDb = accomplishedCount;
    }
  }

  closeViewRequirements(): void {
    this.viewRequirementsVisible = false;
    this.selectedStudent = null;
  }

  validateRequirement(requirementId: number, requirementName: string): void {
    if (!this.selectedStudent) return;

    // Find the requirement submission from the loaded data
    const requirement = this.requirementsList.find(
      (r) => r.requirement_id === requirementId
    );
    if (!requirement || !requirement.file_url) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Validate',
        text: 'This requirement has not been submitted yet.',
      });
      return;
    }

    // Check if already validated
    if (requirement.validated) {
      Swal.fire({
        icon: 'info',
        title: 'Already Validated',
        text: 'This requirement has already been validated.',
      });
      return;
    }

    this.requirementsService.approveRequirement(requirementId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Requirement Validated',
          text: `${requirementName} has been validated successfully.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        // Reload requirements to update UI
        this.loadStudentRequirements(this.selectedStudent.student_id);
      },
      error: (error) => {
        console.error('Error validating requirement:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to validate requirement. Please try again.',
        });
      },
    });
  }

  openPreviewRequirement(requirement: any, requirementName: string): void {
    this.selectedRequirement = {
      ...requirement,
      name: requirementName,
      student: this.selectedStudent,
    };
    this.previewRequirementVisible = true;
  }

  closePreviewRequirement(): void {
    this.previewRequirementVisible = false;
    this.selectedRequirement = null;
  }

  openReturnRequirement(requirement: any, requirementName: string): void {
    this.selectedRequirement = {
      ...requirement,
      name: requirementName,
      student: this.selectedStudent,
    };
    this.returnRemarks = '';
    this.returnRequirementVisible = true;
  }

  closeReturnRequirement(): void {
    this.returnRequirementVisible = false;
    this.selectedRequirement = null;
    this.returnRemarks = '';
  }

  submitReturnRequirement(): void {
    if (!this.returnRemarks.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Remarks Required',
        text: 'Please provide remarks explaining why this requirement is being returned.',
      });
      return;
    }

    // TODO: Implement backend API call to return requirement with remarks
    console.log(
      'Returning requirement:',
      this.selectedRequirement,
      'Remarks:',
      this.returnRemarks
    );

    Swal.fire({
      icon: 'info',
      title: 'Requirement Returned',
      text: 'The student will be notified to resubmit this requirement.',
      timer: 2000,
      showConfirmButton: false,
    });

    this.closeReturnRequirement();
  }

  validateAllRequirements(): void {
    if (!this.selectedStudent) return;

    // Check if there are submitted requirements
    const hasSubmittedRequirements = this.requirementsList.some(
      (r) => r.status === 'submitted'
    );
    if (!hasSubmittedRequirements) {
      Swal.fire({
        icon: 'warning',
        title: 'No Requirements to Validate',
        text: 'This student has not submitted any requirements yet.',
      });
      return;
    }

    Swal.fire({
      title: 'Validate All Requirements?',
      text: 'This will validate all submitted requirements for this student.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, validate all',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.requirementsService
          .approveAllRequirements(this.selectedStudent.student_id)
          .subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'All Requirements Validated',
                text:
                  response.message ||
                  'All requirements have been validated successfully.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
              // Reload requirements to update UI
              this.loadStudentRequirements(this.selectedStudent.student_id);
            },
            error: (error) => {
              console.error('Error validating all requirements:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  error.error?.detail ||
                  'Failed to validate requirements. Please try again.',
              });
            },
          });
      }
    });
  }

  // Declare these in your component class
  selectedCampus: any;
  selectedProgram: any;
  selectedSemester: any;

  // Optional: Sample dropdown options if not yet added
  campusOptions = [
    { label: 'BatStateU - Alangilan', value: 'Alangilan' },
    { label: 'BatStateU - Lipa', value: 'Lipa' },
    { label: 'BatStateU - Nasugbu', value: 'Nasugbu' },
  ];

  jobs: any[] = [];

  metrics: any[] = [];

  // Pie chart: OJT Status Distribution
  ojtStatusData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };

  // Bar chart: Total OJT Progress
  ojtProgressData = {
    labels: [],
    datasets: [
      {
        label: 'Students',
        backgroundColor: [],
        data: [],
      },
    ],
  };

  // Line chart: Weekly Applications
  lineChartData = {
    labels: [],
    datasets: [
      {
        label: 'Applications',
        data: [],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  requirementsList: any[] = [];

  selectedSection: string = '';

  // Helper method to check if requirement is submitted
  isRequirementSubmitted(requirementId: number): boolean {
    if (!this.selectedStudent?.submittedRequirements) {
      return false;
    }
    const submission =
      this.selectedStudent.submittedRequirements.get(requirementId);
    return (
      submission && submission.status === 'submitted' && !submission.returned
    );
  }

  // Helper method to get requirement submission
  getRequirementSubmission(requirementId: number): any {
    if (!this.selectedStudent?.submittedRequirements) {
      return null;
    }
    return this.selectedStudent.submittedRequirements.get(requirementId);
  }

  // Helper method to check if requirement is validated
  isRequirementValidated(requirementId: number): boolean {
    const submission = this.getRequirementSubmission(requirementId);
    return submission && submission.validated === true;
  }

  downloadRequirementsCSV() {
    const headers = [
      'Program',
      'Pre-OJT Requirements',
      'Post-OJT Requirements',
    ];
    const rows = this.requirementsList.map((item) => [
      `"${item.program}"`,
      `"${item.preOjt}"`,
      `"${item.postOjt}"`,
    ]);

    const csvContent =
      headers.join(',') + '\n' + rows.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'OJT_Requirements_Summary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Class List Pagination
  classListPageNo: number = 1;
  classListPageSize: number = 10;

  getPaginatedClassList(): any[] {
    const startIndex = (this.classListPageNo - 1) * this.classListPageSize;
    const endIndex = startIndex + this.classListPageSize;
    return this.filteredClassList.slice(startIndex, endIndex);
  }

  getClassListTotalPages(): number {
    return Math.ceil(this.filteredClassList.length / this.classListPageSize);
  }

  getClassListShowingStart(): number {
    return this.filteredClassList.length === 0
      ? 0
      : (this.classListPageNo - 1) * this.classListPageSize + 1;
  }

  getClassListShowingEnd(): number {
    const end = this.classListPageNo * this.classListPageSize;
    return end > this.filteredClassList.length
      ? this.filteredClassList.length
      : end;
  }

  previousClassListPage(): void {
    if (this.classListPageNo > 1) {
      this.classListPageNo--;
    }
  }

  nextClassListPage(): void {
    if (this.classListPageNo < this.getClassListTotalPages()) {
      this.classListPageNo++;
    }
  }

  // Internship Listing Methods
  loadInternships(): void {
    this.isLoadingInternships = true;

    this.http.get<any>(`${environment.apiUrl}/internships`).subscribe({
      next: (response) => {
        this.internships = response.data || [];
        this.filteredInternships = [...this.internships];
        this.extractInternshipFiltersData();
        this.isLoadingInternships = false;
      },
      error: (error) => {
        console.error('Error loading internships:', error);
        this.isLoadingInternships = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load internship opportunities',
          confirmButtonColor: '#10b981',
        });
      },
    });
  }

  extractInternshipFiltersData(): void {
    // Extract unique industries
    const industriesMap = new Map();
    this.internships.forEach((internship) => {
      if (internship.industry_id && internship.industry_name) {
        industriesMap.set(internship.industry_id, {
          industry_id: internship.industry_id,
          industry_name: internship.industry_name,
        });
      }
    });
    this.internshipIndustries = Array.from(industriesMap.values());

    // Extract unique companies
    const companiesMap = new Map();
    this.internships.forEach((internship) => {
      if (internship.employer_id && internship.company_name) {
        companiesMap.set(internship.employer_id, {
          employer_id: internship.employer_id,
          company_name: internship.company_name,
        });
      }
    });
    this.internshipCompanies = Array.from(companiesMap.values());
  }

  applyInternshipFilters(): void {
    this.filteredInternships = this.internships.filter((internship) => {
      // Search filter
      if (this.internshipFilters.searchKeyword) {
        const keyword = this.internshipFilters.searchKeyword.toLowerCase();
        const matchesSearch =
          internship.title?.toLowerCase().includes(keyword) ||
          internship.company_name?.toLowerCase().includes(keyword) ||
          internship.description?.toLowerCase().includes(keyword);
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (this.internshipFilters.industry !== null) {
        if (internship.industry_id !== this.internshipFilters.industry)
          return false;
      }

      // Company filter
      if (this.internshipFilters.company !== null) {
        if (internship.employer_id !== this.internshipFilters.company)
          return false;
      }

      // Status filter
      if (this.internshipFilters.status !== null) {
        if (internship.status !== this.internshipFilters.status) return false;
      }

      return true;
    });

    Swal.fire({
      icon: 'success',
      title: 'Filters Applied',
      text: `Found ${this.filteredInternships.length} internship opportunities`,
      confirmButtonColor: '#10b981',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  resetInternshipFilters(): void {
    this.internshipFilters = {
      searchKeyword: '',
      industry: null,
      company: null,
      status: null,
    };
    this.filteredInternships = [...this.internships];

    Swal.fire({
      icon: 'info',
      title: 'Filters Reset',
      text: 'All filters have been reset',
      confirmButtonColor: '#10b981',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  viewInternshipDetails(internship: any): void {
    Swal.fire({
      title: `<h2 class="text-xl font-semibold text-gray-800 poppins-semibold">${internship.title}</h2>`,
      html: `
        <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p class="text-sm text-blue-700 poppins-regular">
            <i class="pi pi-building mr-2"></i>
            <strong>${internship.company_name}</strong>
          </p>
        </div>
        
        <div class="text-left poppins-regular">
          <div class="space-y-3">
            <div class="border-b border-gray-200 pb-2">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</p>
              <p class="text-sm text-gray-700">${
                internship.industry_name || 'N/A'
              }</p>
            </div>
            
            <div class="border-b border-gray-200 pb-2">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
              <p class="text-sm text-gray-700"><i class="pi pi-map-marker text-xs mr-1"></i>${
                internship.address || 'Batangas City'
              }</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-2">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                <p class="text-sm text-gray-700"><i class="pi pi-clock text-xs mr-1"></i>${
                  internship.duration_months
                } months</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                <p class="text-sm">
                  <span class="px-2 py-1 rounded text-xs ${
                    internship.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }">${internship.status === 'open' ? 'Open' : 'Closed'}</span>
                </p>
              </div>
            </div>
            
            <div class="border-b border-gray-200 pb-2">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Posted Date</p>
              <p class="text-sm text-gray-700"><i class="pi pi-calendar text-xs mr-1"></i>${new Date(
                internship.created_at
              ).toLocaleDateString()}</p>
            </div>
            
            <div class="mt-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
              <p class="text-sm text-gray-700 leading-relaxed">${
                internship.description || 'No description available'
              }</p>
            </div>
          </div>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      confirmButtonText: 'Close',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-lg shadow-2xl',
        title: 'p-6 border-b border-gray-200 text-left',
        closeButton: 'text-gray-500 hover:text-gray-700 text-2xl leading-none',
        htmlContainer: 'p-6 text-left',
        actions: 'px-6 pb-6 pt-4 border-t border-gray-200 flex justify-end',
        confirmButton:
          'px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 poppins-medium text-sm',
      },
    });
  }

  applyToInternship(internship: any): void {
    if (internship.status !== 'open') {
      Swal.fire({
        icon: 'error',
        title: 'Application Closed',
        text: 'This internship opportunity is no longer accepting applications.',
        buttonsStyling: false,
        customClass: {
          confirmButton:
            'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 poppins-medium text-sm',
        },
      });
      return;
    }

    Swal.fire({
      title: `<h2 class="text-xl font-semibold text-gray-800 poppins-semibold">Apply for ${internship.title}</h2>`,
      html: `
        <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p class="text-sm text-blue-700 poppins-regular">
            <i class="pi pi-info-circle mr-2"></i>
            Complete the form below to submit your application to <strong>${internship.company_name}</strong>
          </p>
        </div>
        
        <div class="text-left poppins-regular">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2 poppins-semibold">
              Cover Letter / Application Letter <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="applicationLetter" 
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 poppins-regular text-sm transition-colors"
              rows="6"
              placeholder="Write your cover letter here..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              <i class="pi pi-info-circle mr-1"></i>
              Explain why you're interested in this position and what you can bring to the company
            </p>
          </div>
          
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-gray-700 poppins-semibold">
                Resume/CV (Optional)
              </label>
            </div>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
              <input 
                type="file" 
                id="resumeFile" 
                accept=".pdf,.doc,.docx"
                class="w-full text-sm poppins-regular file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              <i class="pi pi-file mr-1"></i>
              Accepted formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: '<i class="pi pi-check mr-2"></i>Submit Application',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-lg shadow-2xl',
        title: 'p-6 border-b border-gray-200 text-left',
        closeButton: 'text-gray-500 hover:text-gray-700 text-2xl leading-none',
        htmlContainer: 'p-6 text-left',
        actions:
          'px-6 pb-6 pt-4 border-t border-gray-200 flex justify-end gap-3',
        confirmButton:
          'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 poppins-medium text-sm',
        cancelButton:
          'px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 poppins-medium text-sm',
      },
      preConfirm: () => {
        const applicationLetter = (
          document.getElementById('applicationLetter') as HTMLTextAreaElement
        ).value;
        const resumeFile = (
          document.getElementById('resumeFile') as HTMLInputElement
        ).files?.[0];

        if (!applicationLetter.trim()) {
          Swal.showValidationMessage('Cover letter is required');
          return false;
        }

        return { applicationLetter, resumeFile };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { applicationLetter, resumeFile } = result.value;

        const formData = new FormData();
        formData.append('application_letter', applicationLetter);
        if (resumeFile) {
          formData.append('resume', resumeFile);
        }

        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .post(
            `${environment.apiUrl}/internships/${internship.internship_id}/apply`,
            formData,
            { headers }
          )
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Application Submitted',
                html: `
                <div class="poppins-regular">
                  <p class="text-gray-700">Your application has been successfully submitted to <strong>${internship.company_name}</strong>!</p>
                  <p class="text-sm text-gray-600 mt-2">You will be notified once the employer reviews your application.</p>
                </div>
              `,
                buttonsStyling: false,
                customClass: {
                  popup: 'rounded-lg shadow-2xl',
                  confirmButton:
                    'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 poppins-medium text-sm',
                },
              });
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Application Failed',
                text:
                  error.error?.detail ||
                  'Failed to submit application. Please try again.',
                buttonsStyling: false,
                customClass: {
                  popup: 'rounded-lg shadow-2xl',
                  confirmButton:
                    'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 poppins-medium text-sm',
                },
              });
            },
          });
      }
    });
  }

  toggleBookmark(internship: any): void {
    internship.is_bookmarked = !internship.is_bookmarked;

    const action = internship.is_bookmarked ? 'added to' : 'removed from';
    Swal.fire({
      icon: 'success',
      title: internship.is_bookmarked ? 'Bookmarked' : 'Bookmark Removed',
      text: `${internship.title} has been ${action} your bookmarks.`,
      confirmButtonColor: '#10b981',
      timer: 1500,
      showConfirmButton: false,
    });
  }
}
