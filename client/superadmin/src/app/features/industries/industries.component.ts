import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { IndustryService } from './industry.service';

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './industries.component.html',
  styleUrl: './industries.component.css'
})
export class IndustriesComponent implements OnInit {
  industries: any[] = [];
  
  // Pagination
  pageNo: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  // Search
  keyword: string = '';
  
  // Modals
  isAddDialogVisible: boolean = false;
  isUpdateDialogVisible: boolean = false;
  isStatusDialogVisible: boolean = false;
  
  // Forms
  industryForm!: FormGroup;
  industryUpdateForm!: FormGroup;
  
  // Selected industry for status update
  selectedIndustry: any = null;
  
  constructor(
    private industryService: IndustryService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }
  
  ngOnInit(): void {
    this.loadIndustries();
  }
  
  initializeForms(): void {
    this.industryForm = this.fb.group({
      industry_name: ['', [Validators.required, Validators.maxLength(100)]]
    });
    
    this.industryUpdateForm = this.fb.group({
      industry_id: [null],
      industry_name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  
  loadIndustries(): void {
    this.industryService.getAll(
      this.pageNo,
      this.pageSize,
      this.keyword || undefined
    ).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.industries)) {
          this.industries = res.industries;
          this.totalRecords = res.pagination?.total_records || 0;
        } else {
          this.industries = [];
          this.totalRecords = 0;
        }
      },
      error: (err) => {
        console.error('Error loading industries:', err);
        this.industries = [];
        this.totalRecords = 0;
        Swal.fire('Error', 'Failed to load industries', 'error');
      }
    });
  }
  
  handleAddDialog(): void {
    this.isAddDialogVisible = !this.isAddDialogVisible;
    if (this.isAddDialogVisible) {
      this.industryForm.reset();
    }
  }
  
  submitIndustryForm(): void {
    if (this.industryForm.invalid) {
      Object.keys(this.industryForm.controls).forEach(key => {
        this.industryForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.industryService.create(this.industryForm.value).subscribe({
      next: (res) => {
        Swal.fire('Success', res.message || 'Industry created successfully', 'success');
        this.handleAddDialog();
        this.loadIndustries();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.detail || 'Failed to create industry', 'error');
      }
    });
  }
  
  handleUpdateDialog(industryId: number): void {
    this.industryService.getByID(industryId).subscribe({
      next: (industry) => {
        this.industryUpdateForm.patchValue({
          industry_id: industry.industry_id,
          industry_name: industry.industry_name
        });
        this.isUpdateDialogVisible = true;
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to load industry details', 'error');
      }
    });
  }
  
  submitUpdateForm(): void {
    if (this.industryUpdateForm.invalid) {
      Object.keys(this.industryUpdateForm.controls).forEach(key => {
        this.industryUpdateForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const industryId = this.industryUpdateForm.get('industry_id')?.value;
    this.industryService.update(industryId, this.industryUpdateForm.value).subscribe({
      next: (res) => {
        Swal.fire('Success', res.message || 'Industry updated successfully', 'success');
        this.isUpdateDialogVisible = false;
        this.loadIndustries();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.detail || 'Failed to update industry', 'error');
      }
    });
  }
  
  handleDelete(industryId: number, industryName: string): void {
    Swal.fire({
      title: 'Delete Industry?',
      text: `Are you sure you want to delete "${industryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.industryService.delete(industryId).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', res.message || 'Industry deleted successfully', 'success');
            this.loadIndustries();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.detail || 'Failed to delete industry', 'error');
          }
        });
      }
    });
  }
  
  handleSearch(): void {
    this.pageNo = 1;
    this.loadIndustries();
  }
  
  previousPage(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.loadIndustries();
    }
  }
  
  nextPage(): void {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.loadIndustries();
    }
  }
  
  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
  
  getShowingStart(): number {
    return this.totalRecords === 0 ? 0 : (this.pageNo - 1) * this.pageSize + 1;
  }
  
  getShowingEnd(): number {
    const end = this.pageNo * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
  
  // Add status change logic
  handleStatusDialog(industry: any): void {
    this.selectedIndustry = industry;
    this.isStatusDialogVisible = true;
  }

  updateIndustryStatus(newStatus: string): void {
    if (!this.selectedIndustry) return;
    this.industryService.update(this.selectedIndustry.industry_id, {
      industry_name: this.selectedIndustry.industry_name,
      status: newStatus
    }).subscribe({
      next: (res) => {
        Swal.fire('Success', `Industry status updated to ${newStatus}`, 'success');
        this.isStatusDialogVisible = false;
        this.selectedIndustry = null;
        this.loadIndustries();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.detail || 'Failed to update status', 'error');
      }
    });
  }
}
