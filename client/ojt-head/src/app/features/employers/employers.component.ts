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
  // Listing properties
  employers: any[] = [];
  totalRecords = 0;
  pageNo = 1;
  pageSize = 10;
  isLoading = false;
  Math = Math;

  // Filter properties
  selectedIndustryId: string | number = '';
  keyword = '';

  // Form properties
  industries: any[] = [];
  employerSimpleForm!: FormGroup;
  isSubmitting = false;
  isAddDialogVisible = false;

  moaPreviewUrl: string | null = null;
  moaFileName: string | null = null;
  moaFile: File | null = null;

  // View dialog properties
  showViewDialog = false;
  selectedEmployer: any = null;

  constructor(
    private employerService: EmployerService,
    private dropdownService: DropdownsService,
    private fb: FormBuilder
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
      // Reset form when closing
      this.employerSimpleForm.reset();
      this.clearMOASelection();
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
        console.log('Loaded industries:', industries);
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
        this.employerSimpleForm.get(key)?.markAsTouched()
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
        // Don't reset form on error
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
      const moaUrl = `${environment.apiUrl}${this.selectedEmployer.moa_file}`;
      window.open(moaUrl, '_blank');
    }
  }

  downloadMOA(): void {
    if (this.selectedEmployer?.moa_file) {
      const moaUrl = `${environment.apiUrl}${this.selectedEmployer.moa_file}`;
      const link = document.createElement('a');
      link.href = moaUrl;
      link.download = `MOA_${this.selectedEmployer.company_name}.pdf`;
      link.click();
    }
  }
}
