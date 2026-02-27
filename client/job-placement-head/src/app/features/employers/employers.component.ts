import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { EmployerService } from './employer.service';
import { DropdownsService } from '../../shared/services/dropdowns.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.css',
})
export class EmployersComponent implements OnInit {
  employers: any[] = [];
  totalRecords = 0;
  pageNo = 1;
  pageSize = 10;
  isLoading = false;
  Math = Math;

  selectedIndustryId: string | number = '';
  keyword = '';

  industries: any[] = [];
  employerSimpleForm!: FormGroup;
  isSubmitting = false;
  isAddDialogVisible = false;

  moaPreviewUrl: string | null = null;
  moaFileName: string | null = null;
  moaFile: File | null = null;

  showViewDialog = false;
  selectedEmployer: any = null;

  // Search existing employer
  searchEmployerKeyword = '';
  searchResults: any[] = [];
  isSearching = false;
  searchAttempted = false;

  constructor(
    private employerService: EmployerService,
    private dropdownService: DropdownsService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadIndustries();
    this.getAllEmployers();
  }

  initializeForms(): void {
    this.employerSimpleForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      representative_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      industry_id: [null, Validators.required],
      validity_start: ['', Validators.required],
      validity_end: ['', Validators.required],
    });
  }

  getAllEmployers(): void {
    this.isLoading = true;
    const params: any = {
      page_no: this.pageNo,
      page_size: this.pageSize,
    };

    if (this.selectedIndustryId) {
      params.industry_id = this.selectedIndustryId;
    }
    if (this.keyword) {
      params.keyword = this.keyword;
    }

    this.employerService.getAllEmployers(params).subscribe({
      next: (res) => {
        if (res?.status === 'success') {
          this.employers = res.data || [];
          this.totalRecords = res.pagination?.total_records || 0;
        } else {
          this.employers = [];
          this.totalRecords = 0;
        }
        this.isLoading = false;
      },
      error: () => {
        this.employers = [];
        this.totalRecords = 0;
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load employers.',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllEmployers();
  }

  resetFilters(): void {
    this.selectedIndustryId = '';
    this.keyword = '';
    this.pageNo = 1;
    this.getAllEmployers();
  }

  handleAddDialog(): void {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    if (!this.isAddDialogVisible) {
      this.employerSimpleForm.reset();
      this.clearMOASelection();
      this.searchEmployerKeyword = '';
      this.searchResults = [];
      this.searchAttempted = false;
    }
  }

  onPageChange(newPage: number): void {
    this.pageNo = newPage;
    this.getAllEmployers();
  }

  loadIndustries(): void {
    this.dropdownService.getActiveIndustries().subscribe({
      next: (industries) => {
        this.industries = industries;
      },
      error: (err) => {
        console.error('Error loading industries:', err);
      },
    });
  }

  onMOAFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.moaFile = file;
      this.moaFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.moaPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      Swal.fire('Invalid File', 'Please select a PDF file', 'error');
      event.target.value = '';
    }
  }

  submitAddSimpleEmployer(): void {
    if (this.employerSimpleForm.invalid) {
      Object.keys(this.employerSimpleForm.controls).forEach((key) =>
        this.employerSimpleForm.get(key)?.markAsTouched(),
      );
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (this.isSubmitting) return;

    const formValue = { ...this.employerSimpleForm.value };
    const fd = new FormData();
    fd.append('email_address', formValue.email_address);
    fd.append('company_name', formValue.company_name);
    fd.append('representative_name', formValue.representative_name);
    fd.append('phone_number', formValue.phone_number);
    fd.append('industry_id', String(formValue.industry_id));
    fd.append('validity_start', formValue.validity_start);
    fd.append('validity_end', formValue.validity_end);

    if (this.moaFile) {
      fd.append('moa_pdf', this.moaFile);
    }

    this.isSubmitting = true;
    this.employerService.registerSimple(fd).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || 'Employer created successfully',
          confirmButtonColor: '#22c55e',
        });
        this.employerSimpleForm.reset();
        this.moaFile = null;
        this.moaPreviewUrl = null;
        this.moaFileName = null;
        this.isAddDialogVisible = false;
        this.getAllEmployers();
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err.error?.detail ||
            err.error?.message ||
            'Failed to create employer',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  clearMOASelection(): void {
    this.moaFile = null;
    this.moaPreviewUrl = null;
    this.moaFileName = null;
  }

  viewEmployerDetails(employer: any): void {
    this.selectedEmployer = employer;
    this.showViewDialog = true;
  }

  closeViewDialog(): void {
    this.showViewDialog = false;
    this.selectedEmployer = null;
  }

  previewMOA(): void {
    if (this.selectedEmployer?.moa_file) {
      const baseUrl = environment.apiUrl.replace('/api', '');
      const moaUrl = this.selectedEmployer.moa_file.startsWith('http')
        ? this.selectedEmployer.moa_file
        : `${baseUrl}/${this.selectedEmployer.moa_file}`;
      window.open(moaUrl, '_blank');
    }
  }

  downloadMOA(): void {
    if (this.selectedEmployer?.moa_file) {
      const baseUrl = environment.apiUrl.replace('/api', '');
      const moaUrl = this.selectedEmployer.moa_file.startsWith('http')
        ? this.selectedEmployer.moa_file
        : `${baseUrl}/${this.selectedEmployer.moa_file}`;
      const link = document.createElement('a');
      link.href = moaUrl;
      link.download = `MOA_${this.selectedEmployer.company_name}.pdf`;
      link.click();
    }
  }

  // Search existing employer methods
  searchExistingEmployer(): void {
    if (!this.searchEmployerKeyword || this.searchEmployerKeyword.length < 3) {
      Swal.fire({
        icon: 'info',
        title: 'Search Required',
        text: 'Please enter at least 3 characters to search',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    this.isSearching = true;
    this.searchAttempted = true;

    // Search all employers (not just job placement ones)
    const params: any = {
      page_no: 1,
      page_size: 10,
      keyword: this.searchEmployerKeyword,
    };

    // Use a different endpoint or modify the service to search all employers
    this.employerService.searchAllEmployers(params).subscribe({
      next: (res) => {
        this.isSearching = false;
        if (res?.status === 'success') {
          this.searchResults = res.data || [];
        } else {
          this.searchResults = [];
        }
      },
      error: () => {
        this.isSearching = false;
        this.searchResults = [];
        Swal.fire({
          icon: 'error',
          title: 'Search Error',
          text: 'Failed to search for existing employers.',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }

  useExistingEmployer(employer: any): void {
    const internshipValidity = employer.internship_validity
      ? new Date(employer.internship_validity).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'N/A';
    const jobPlacementValidity = employer.job_placement_validity
      ? new Date(employer.job_placement_validity).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Not set';

    Swal.fire({
      title: 'Use Existing Employer?',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-2">This will update the eligibility of:</p>
          <p class="font-semibold text-lg">${employer.company_name}</p>
          <p class="text-sm text-gray-600 mb-3">${employer.email_address}</p>
          
          <div class="bg-gray-50 p-3 rounded mb-3">
            <p class="text-sm font-medium mb-2">Current Status:</p>
            <p class="text-sm">Eligibility: <span class="font-medium">${employer.eligibility}</span></p>
            <p class="text-sm">Internship valid until: <span class="font-medium text-yellow-600">${internshipValidity}</span></p>
            <p class="text-sm">Job Placement valid until: <span class="font-medium text-green-600">${jobPlacementValidity}</span></p>
          </div>
          
          <div class="bg-green-50 p-3 rounded">
            <p class="text-sm font-medium mb-2">After Update:</p>
            <p class="text-sm">Eligibility: <span class="font-medium text-green-600">both</span> (internship + job placement)</p>
            <p class="text-sm text-gray-600 italic">You will set the new Job Placement validity date</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Update Eligibility',
      cancelButtonText: 'Cancel',
      width: '600px',
    }).then((result) => {
      if (result.isConfirmed) {
        // Pre-fill the form with existing employer data
        this.employerSimpleForm.patchValue({
          email_address: employer.email_address,
          company_name: employer.company_name,
          representative_name: employer.representative_name,
          phone_number: employer.phone_number,
          industry_id: employer.industry_id,
        });

        // Clear search results
        this.searchResults = [];
        this.searchEmployerKeyword = '';

        Swal.fire({
          icon: 'success',
          title: 'Form Pre-filled',
          text: 'Please set the Job Placement validity dates and submit to update eligibility.',
          confirmButtonColor: '#16a34a',
        });
      }
    });
  }
}
