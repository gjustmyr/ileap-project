// import { Component, OnInit } from '@angular/core';
// import { JobListingService } from './job-listing.service';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DropdownsService } from '../../shared/services/dropdowns.service';
// import { DialogModule } from 'primeng/dialog';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DropdownModule } from 'primeng/dropdown';
// import { DatePickerModule } from 'primeng/datepicker';
// import { AutoCompleteModule } from 'primeng/autocomplete';

// @Component({
//   selector: 'app-job-listings',
//   templateUrl: './job-listings.component.html',
//   styleUrls: ['./job-listings.component.css'],
//   imports: [
//     TableModule,
//     CommonModule,
//     FormsModule,
//     DialogModule,
//     DropdownModule,
//     ReactiveFormsModule,
//     AutoCompleteModule,
//     DatePickerModule,
//   ],
// })
// export class JobListingsComponent implements OnInit {
//   internships: any[] = [];
//   industries: any[] = [];
//   skills: any[] = [];
//   filteredSkills: any[] = [];

//   isLoading = true;

//   selectedIndustryId: number | null = null;

//   internshipForm!: FormGroup;

//   internshipModes = [
//     { label: 'Face-to-Face', value: 'FTF' },
//     { label: 'Hybrid', value: 'Hybrid' },
//     { label: 'Work From Home', value: 'Work From Home' },
//   ];

//   pageNo: number = 0;
//   pageSize: number = 10;
//   keyword: string = '';
//   totalRecords: number = 0;

//   showAddDialog: boolean = false;

//   sortField = '';
//   sortOrder = 1;

//   constructor(
//     private jobService: JobListingService,
//     private dropdownService: DropdownsService,
//     private fb: FormBuilder
//   ) {}

//   ngOnInit(): void {
//     this.fetchIndustries();
//     this.fetchSkills();

//     this.internshipForm = this.fb.group({
//       title: ['', Validators.required],
//       duration_months: [null],
//       allowance: [''],
//       qualifications: [''],
//       job_description: [''],
//       mode: ['', Validators.required],
//       application_deadline: [null],
//       skills: [[], Validators.required], // ← Add this line
//     });

//     // 👇 Subscribe to changes in skills
//     this.internshipForm.get('skills')?.valueChanges.subscribe((newSkills) => {
//       console.log('Skills changed:', newSkills);
//       // You can perform filtering, validation, or transformation here if needed
//     });
//   }

//   fetchIndustries(): void {
//     this.dropdownService.getActiveIndustries().subscribe({
//       next: (res: any) => {
//         this.industries = res;
//         console.log(res);
//       },
//       error: (err) => {
//         console.error('Failed to load industries', err);
//       },
//     });
//   }

//   onSearchClick(): void {
//     this.pageNo = 0;
//     this.fetchInternships();
//   }

//   onSearchChange(): void {
//     this.pageNo = 0;
//     this.fetchInternships();
//   }

//   onPageChange(event: any): void {
//     this.pageNo = event.first / event.rows;
//     this.pageSize = event.rows;

//     this.sortField = event.sortField || '';
//     this.sortOrder = event.sortOrder || 1;

//     this.fetchInternships();
//   }

//   fetchInternships(): void {
//     this.isLoading = true;

//     this.jobService
//       .getAllInternships(this.pageNo + 1, this.pageSize, this.keyword)
//       .subscribe({
//         next: (res) => {
//           let internships = res.data;

//           if (this.sortField) {
//             internships = [...internships].sort((a, b) => {
//               const valA = a[this.sortField];
//               const valB = b[this.sortField];

//               if (valA == null && valB == null) return 0;
//               if (valA == null) return 1;
//               if (valB == null) return -1;

//               if (typeof valA === 'string' && typeof valB === 'string') {
//                 return this.sortOrder === 1
//                   ? valA.localeCompare(valB)
//                   : valB.localeCompare(valA);
//               }

//               return this.sortOrder === 1
//                 ? valA > valB
//                   ? 1
//                   : valA < valB
//                   ? -1
//                   : 0
//                 : valA < valB
//                 ? 1
//                 : valA > valB
//                 ? -1
//                 : 0;
//             });
//           }

//           this.internships = internships;
//           this.totalRecords = res.pagination?.totalRecords || res.data.length;
//           this.isLoading = false;
//         },
//         error: (err) => {
//           console.error('Failed to load internships', err);
//           this.isLoading = false;
//         },
//       });
//   }

//   allSkills: any[] = []; // All from backend

//   fetchSkills(): void {
//     this.dropdownService.getSkills().subscribe({
//       next: (skills) => {
//         // Convert to [{ label, value, origin }] format
//         this.allSkills = skills.map((s: any) => ({
//           label: s.skill_name,
//           value: s.skill_id,
//           origin: 'old',
//         }));
//       },
//       error: (err) => console.error(err),
//     });
//   }

//   filterSkills(event: any) {
//     const query = event.query.toLowerCase();

//     const filtered = this.allSkills.filter((skill) =>
//       skill.label.toLowerCase().includes(query)
//     );

//     // Check if query is not in existing options
//     const exists = this.allSkills.some(
//       (skill) => skill.label.toLowerCase() === query
//     );

//     this.filteredSkills = exists
//       ? filtered
//       : [
//           {
//             label: event.query,
//             value: event.query,
//             __new: true,
//             origin: 'new',
//           },
//           ...filtered,
//         ];
//   }

//   onSkillSelect(skill: any) {
//     // optional: mark new skills
//     if (skill.__new) {
//       skill.origin = 'new';
//     }
//   }

//   onSkillBlur() {
//     const skills = this.internshipForm.get('skills')?.value || [];
//     const lastTyped = this.filteredSkills[0];

//     // Optional: if user just typed a new skill and left input
//     if (
//       lastTyped?.__new &&
//       !skills.find((s: any) => s.label === lastTyped.label)
//     ) {
//       this.internshipForm.patchValue({
//         skills: [...skills, lastTyped],
//       });
//     }
//   }

//   submitInternship(): void {
//     if (this.internshipForm.valid) {
//       const formData = this.internshipForm.value;

//       // Separate new and old skills
//       const oldSkills = formData.skills.filter((s: any) => s.origin === 'old');
//       const newSkills = formData.skills.filter((s: any) => s.origin === 'new');

//       const payload = {
//         ...formData,
//         skill_ids: oldSkills.map((s: any) => s.value),
//         new_skills: newSkills.map((s: any) => s.label),
//       };

//       console.log('Submitting:', payload);
//       // Call API here

//       this.internshipForm.reset();
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { JobListingService } from './job-listing.service';
import { DropdownsService } from '../../shared/services/dropdowns.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    DatePickerModule,
    ChipsModule,
    AutoCompleteModule,
    EditorModule,
  ],
  providers: [MessageService],
})
export class JobListingsComponent implements OnInit {
  internships: any[] = [];
  industries: any[] = [];
  skills: any[] = [];
  internshipForm!: FormGroup;

  isLoading = true;
  showAddDialog = false;
  showViewDialog = false;
  isEditMode = false;
  selectedInternshipId: number | null = null;
  selectedInternship: any = null;
  selectedIndustryId: number | null = null;
  items: any[] | undefined;
  pageNo = 0;
  pageSize = 10;
  keyword = '';
  totalRecords = 0;
  sortField = '';
  sortOrder = 1;

  // Eligibility and tabs
  employerEligibility: string = 'internship'; // 'internship', 'job_placement', or 'both'
  activeTab: 'internship' | 'job_placement' = 'internship';

  filteredSkills: any[] = []; // filtered results for autocomplete

  internshipModes = [
    { label: 'Face-to-Face', value: 'FTF' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Work From Home', value: 'Work From Home' },
  ];

  constructor(
    private jobService: JobListingService,
    private dropdownService: DropdownsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchEmployerEligibility();
    this.fetchIndustries();
    this.fetchSkills();

    this.internshipForm = this.fb.group({
      title: ['', Validators.required],
      full_description: ['', Validators.required],
      is_draft: [true],
      skills: [[]], // Array of skill strings
    });
  }

  fetchEmployerEligibility(): void {
    this.jobService.getEmployerProfile().subscribe({
      next: (res: any) => {
        this.employerEligibility = res.data?.eligibility || 'internship';
        // Set initial active tab based on eligibility
        if (this.employerEligibility === 'job_placement') {
          this.activeTab = 'job_placement';
        }
      },
      error: (err: any) => {
        console.error('Failed to load employer eligibility', err);
      },
    });
  }

  switchTab(tab: 'internship' | 'job_placement'): void {
    if (this.canAccessTab(tab)) {
      this.activeTab = tab;
      this.pageNo = 0;
      this.fetchInternships();
    }
  }

  canAccessTab(tab: 'internship' | 'job_placement'): boolean {
    if (this.employerEligibility === 'both') return true;
    return this.employerEligibility === tab;
  }

  fetchIndustries(): void {
    this.dropdownService.getActiveIndustries().subscribe({
      next: (res) => {
        this.industries = res;
      },
      error: (err) => {
        console.error('Failed to load industries', err);
      },
    });
  }

  fetchSkills(): void {
    this.jobService.getAllSkills('').subscribe({
      next: (response: any) => {
        this.skills = response || [];
        console.log('All skills loaded:', this.skills);
      },
      error: (err) => console.error('Error loading skills:', err),
    });
  }

  onSkillChange(event: any) {
    const selectedSkills = this.internshipForm.get('skills')?.value || [];
    console.log('Skills selected:', selectedSkills);
  }

  addSkillFromList(skillName: string): void {
    const currentSkills = this.internshipForm.get('skills')?.value || [];
    if (!currentSkills.includes(skillName)) {
      this.internshipForm.patchValue({ skills: [...currentSkills, skillName] });
    }
  }

  removeSkill(skillToRemove: string): void {
    const currentSkills = this.internshipForm.get('skills')?.value || [];
    const updatedSkills = currentSkills.filter(
      (skill: string) => skill !== skillToRemove
    );
    this.internshipForm.patchValue({ skills: updatedSkills });
  }

  viewInternship(internship: any): void {
    this.selectedInternship = internship;
    this.showViewDialog = true;
  }

  changeStatus(newStatus: string): void {
    if (!this.selectedInternship) return;

    // Validate employer can only change certain statuses
    const allowedTransitions: { [key: string]: string[] } = {
      draft: ['pending'],
      pending: [], // Cannot change while pending - waiting for OJT Head
      approved: ['open', 'closed'],
      open: ['closed'],
      closed: ['open'],
      rejected: ['pending'],
    };

    const currentStatus = this.selectedInternship.status;
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Action',
        detail: 'You cannot change to this status',
      });
      // Reset to original status
      this.selectedInternship.status = currentStatus;
      return;
    }

    const updatePayload = {
      status: newStatus,
    };

    this.jobService
      .updateInternship(this.selectedInternship.internship_id, updatePayload)
      .subscribe({
        next: (res) => {
          console.log('Status updated:', res);
          this.selectedInternship.status = newStatus;
          this.fetchInternships();
          const message =
            newStatus === 'pending'
              ? 'Submitted for approval'
              : 'Status updated successfully';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
          });
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update status',
          });
          // Reset to original status on error
          this.selectedInternship.status = currentStatus;
        },
      });
  }

  editInternship(internship: any): void {
    this.isEditMode = true;
    this.selectedInternshipId = internship.internship_id;
    this.showAddDialog = true;

    // Extract skill names from the skills array
    const skillNames = internship.skills?.map((s: any) => s.skill_name) || [];

    this.internshipForm.patchValue({
      title: internship.title,
      full_description: internship.full_description,
      is_draft: internship.status === 'draft',
      skills: skillNames,
    });
  }

  submitInternship(): void {
    if (this.internshipForm.invalid) {
      this.internshipForm.markAllAsTouched();
      return;
    }

    const formData = this.internshipForm.value;

    // Extract skill names from the selected skills (they could be objects or strings)
    const skillNames = (formData.skills || []).map((skill: any) =>
      typeof skill === 'string' ? skill : skill.skill_name
    );

    const payload = {
      title: formData.title,
      full_description: formData.full_description,
      posting_type: this.activeTab, // 'internship' or 'job_placement'
      is_draft: formData.is_draft,
      skills: skillNames,
    };

    console.log('Submitting to backend:', payload);

    if (this.isEditMode && this.selectedInternshipId) {
      // Update existing internship - convert is_draft to status
      const updatePayload = {
        title: payload.title,
        full_description: payload.full_description,
        status: payload.is_draft ? 'draft' : 'pending',
        skills: payload.skills,
      };

      this.jobService
        .updateInternship(this.selectedInternshipId, updatePayload)
        .subscribe({
          next: (res) => {
            console.log('Internship updated:', res);
            this.resetForm();
            this.fetchInternships();
          },
          error: (err) => {
            console.error('Error updating internship:', err);
          },
        });
    } else {
      // Create new internship
      this.jobService.createInternship(payload).subscribe({
        next: (res) => {
          console.log('Internship created:', res);
          this.resetForm();
          this.fetchInternships();
        },
        error: (err) => {
          console.error('Error creating internship:', err);
        },
      });
    }
  }

  resetForm(): void {
    this.internshipForm.reset();
    this.internshipForm.patchValue({ is_draft: true, skills: [] });
    this.showAddDialog = false;
    this.isEditMode = false;
    this.selectedInternshipId = null;
  }

  openAddDialog(): void {
    this.resetForm();
    this.showAddDialog = true;
  }

  // Pagination and Sorting
  onSearchClick(): void {
    this.pageNo = 0;
    this.fetchInternships();
  }

  onSearchChange(): void {
    this.pageNo = 0;
    this.fetchInternships();
  }

  onPageChange(event: any): void {
    this.pageNo = event.first / event.rows;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.fetchInternships();
  }

  fetchInternships(): void {
    this.isLoading = true;

    this.jobService
      .getAllInternships(this.pageNo + 1, this.pageSize, this.keyword)
      .subscribe({
        next: (res) => {
          let internships = res.data;

          if (this.sortField) {
            internships = [...internships].sort((a, b) => {
              const valA = a[this.sortField];
              const valB = b[this.sortField];

              if (valA == null && valB == null) return 0;
              if (valA == null) return 1;
              if (valB == null) return -1;

              return typeof valA === 'string'
                ? this.sortOrder === 1
                  ? valA.localeCompare(valB)
                  : valB.localeCompare(valA)
                : this.sortOrder === 1
                ? valA > valB
                  ? 1
                  : -1
                : valA < valB
                ? 1
                : -1;
            });
          }

          this.internships = internships;
          this.totalRecords =
            res.pagination?.totalRecords || internships.length;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load internships', err);
          this.isLoading = false;
        },
      });
  }

  getStatusClass(status: string): string {
    const statusLower = (status || 'draft').toLowerCase();
    switch (statusLower) {
      case 'approved':
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
