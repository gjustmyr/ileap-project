import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { EmployerService } from './employer.service';
import { DropdownsService } from '../../shared/services/dropdowns.service';

@Component({
  selector: 'app-employer',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css',
})
export class EmployerComponent implements OnInit {
  pageNo = 1;
  pageSize = 10;
  keyword = '';
  sortField = '';
  sortOrder = 1;
  totalRecords = 0;
  employerForm!: FormGroup;
  showAddEmployerDialog = false;

  employers: any[] = [];
  industries: any[] = [];
  selectedIndustryId: number | null = null; // <-- for p-select binding

  constructor(
    private employerService: EmployerService,
    private fb: FormBuilder,
    private dropdownService: DropdownsService
  ) {}

  ngOnInit(): void {
    this.getIndustriesDropdown();
    this.getAllEmployers();

    this.employerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [{ value: '', disabled: true }, Validators.required],
      company_name: ['', Validators.required],
      industry_id: [null, Validators.required],
    });
  }

  getAllEmployers(): void {
    this.employerService
      .getAllEmployers(
        this.pageNo,
        this.pageSize,
        this.keyword,
        this.selectedIndustryId
      )
      .subscribe({
        next: (res) => {
          if (res && Array.isArray(res.data)) {
            this.employers = res.data;
            this.totalRecords = res.pagination?.total_records || 0;
          } else {
            this.employers = [];
            this.totalRecords = 0;
          }
        },
        error: (err) => {
          console.error('Failed to fetch employers:', err);
          this.employers = [];
          this.totalRecords = 0;
        },
      });
  }

  getIndustriesDropdown(): void {
    this.dropdownService.getActiveIndustries().subscribe({
      next: (res: any) => {
        this.industries = res;
      },
      error: (err) => {
        console.error('Failed to fetch industries:', err);
      },
    });
  }

  handleSearch(): void {
    this.pageNo = 1;
    this.getAllEmployers();
  }

  applyFilters(): void {
    this.pageNo = 1;
    this.getAllEmployers();
  }

  resetFilters(): void {
    this.selectedIndustryId = null;
    this.keyword = '';
    this.pageNo = 1;
    this.getAllEmployers();
  }

  openAddDialog(): void {
    this.employerForm.reset();
    this.showAddEmployerDialog = true;
  }

  pageChange(event: any): void {
    this.pageNo = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.getAllEmployers();
  }

  generatePassword(): void {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    const newPass = Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    this.employerForm.get('password')?.setValue(newPass);
  }

  submitEmployer(): void {
    if (this.employerForm.invalid) {
      this.employerForm.markAllAsTouched();
      return;
    }

    this.employerService
      .addEmployer(this.employerForm.getRawValue())
      .subscribe({
        next: (res) => {
          console.log('Employer created:', res);
          this.showAddEmployerDialog = false;
          this.getAllEmployers(); // refresh list
        },
        error: (err) => {
          console.error('Failed to create employer:', err);
        },
      });
  }

  // Pagination helper methods
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

  previousPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllEmployers();
    }
  }

  nextPage() {
    if (this.pageNo < this.getTotalPages()) {
      this.pageNo++;
      this.getAllEmployers();
    }
  }
}
