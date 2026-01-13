import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { CompanyProfileService } from './company-profile.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
})
export class CompanyProfileComponent implements OnInit {
  isUpdateProfileVisible = false;
  companyProfile: any;
  profileForm!: FormGroup;
  logoFile: File | null = null;
  logoPreview: string | null = null;
  isLoading = false;
  industries: any[] = [];

  weekDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  workSchedule: any = {};

  constructor(
    private fb: FormBuilder,
    private companyProfileService: CompanyProfileService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployerProfile();
    this.loadIndustries();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.minLength(3)]],
      industry_id: ['', Validators.required],
      company_overview: ['', [Validators.required, Validators.minLength(30)]],
      representative_name: [''],
      company_size: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
      ],
      address: ['', Validators.required],
      website: [
        '',
        Validators.pattern(/^(https?:\/\/)?([\w\d\-]+\.)+[\w\-]{2,}(\/.+)?$/),
      ],
      facebook: [
        '',
        Validators.pattern(/^https?:\/\/(www\.)?facebook\.com\/.+$/),
      ],
      linkedin: [
        '',
        Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.+$/),
      ],
      twitter: [
        '',
        Validators.pattern(/^https?:\/\/(www\.)?twitter\.com\/.+$/),
      ],
    });
  }

  getEmployerProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: token });

    this.http.get(`${environment.apiUrl}/employers/me`, { headers }).subscribe({
      next: (response: any) => {
        this.companyProfile = response.data || response;
        this.profileForm.patchValue({
          company_name: this.companyProfile.company_name,
          industry_id: this.companyProfile.industry_id,
          company_overview: this.companyProfile.company_overview,
          representative_name: this.companyProfile.representative_name,
          company_size: this.companyProfile.company_size,
          email: this.companyProfile.email,
          phone_number: this.companyProfile.phone_number,
          address: this.companyProfile.address,
          website: this.companyProfile.website,
          facebook: this.companyProfile.facebook,
          linkedin: this.companyProfile.linkedin,
          twitter: this.companyProfile.twitter,
        });

        // Parse work schedule
        if (this.companyProfile.work_schedule) {
          try {
            this.workSchedule = JSON.parse(this.companyProfile.work_schedule);
          } catch (e) {
            this.workSchedule = {};
          }
        }

        if (this.companyProfile.logo) {
          this.logoPreview = this.companyProfile.logo;
        }
      },
      error: (err) => {
        console.error('Failed to fetch employer profile:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load company profile',
        });
      },
    });
  }

  showUpdateProfileDialog(): void {
    this.isUpdateProfileVisible = true;
    this.getEmployerProfile();
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload an image file',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Image size should not exceed 5MB',
        });
        return;
      }

      this.logoFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.logoFile = null;
    this.logoPreview = null;
  }

  loadIndustries(): void {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: token });

    this.http
      .get(`${environment.apiUrl}/industries?per_page=100`, { headers })
      .subscribe({
        next: (response: any) => {
          this.industries = response.industries || [];
          console.log('Loaded industries:', this.industries);
        },
        error: (err) => {
          console.error('Failed to fetch industries:', err);
        },
      });
  }

  submitEmployerProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly',
      });
      return;
    }

    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    const formData = new FormData();

    // Append all form fields
    Object.keys(this.profileForm.value).forEach((key) => {
      const value = this.profileForm.value[key];
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    // Append work schedule as JSON string
    if (Object.keys(this.workSchedule).length > 0) {
      formData.append('work_schedule', JSON.stringify(this.workSchedule));
    }

    // Append logo if selected
    if (this.logoFile) {
      formData.append('logo', this.logoFile, this.logoFile.name);
    }

    const headers = new HttpHeaders({ Authorization: token });

    this.http
      .put(`${environment.apiUrl}/employers/me`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isUpdateProfileVisible = false;

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Company profile updated successfully',
          });

          this.getEmployerProfile();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to update profile:', err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.detail || 'Failed to update company profile',
          });
        },
      });
  }

  isDayActive(day: string): boolean {
    return (
      this.workSchedule[day] !== undefined && this.workSchedule[day] !== null
    );
  }

  toggleDayActive(day: string): void {
    if (this.isDayActive(day)) {
      this.workSchedule[day] = null;
    } else {
      this.workSchedule[day] = { start: '08:00', end: '17:00', breaks: [] };
    }
  }

  getDayStartTime(day: string): string {
    return this.workSchedule[day]?.start || '';
  }

  getDayEndTime(day: string): string {
    return this.workSchedule[day]?.end || '';
  }

  setDayStartTime(day: string, event: any): void {
    const time = event.target.value;
    if (!this.workSchedule[day]) {
      this.workSchedule[day] = { start: time, end: '17:00', breaks: [] };
    } else {
      this.workSchedule[day].start = time;
    }
  }

  setDayEndTime(day: string, event: any): void {
    const time = event.target.value;
    if (!this.workSchedule[day]) {
      this.workSchedule[day] = { start: '08:00', end: time, breaks: [] };
    } else {
      this.workSchedule[day].end = time;
    }
  }

  getDayBreaks(day: string): any[] {
    return this.workSchedule[day]?.breaks || [];
  }

  addBreak(day: string): void {
    if (!this.workSchedule[day]) {
      this.workSchedule[day] = { start: '08:00', end: '17:00', breaks: [] };
    }
    if (!this.workSchedule[day].breaks) {
      this.workSchedule[day].breaks = [];
    }
    this.workSchedule[day].breaks.push({ start: '12:00', end: '13:00' });
  }

  removeBreak(day: string, index: number): void {
    if (this.workSchedule[day]?.breaks) {
      this.workSchedule[day].breaks.splice(index, 1);
    }
  }

  setBreakStart(day: string, index: number, event: any): void {
    const time = event.target.value;
    if (this.workSchedule[day]?.breaks?.[index]) {
      this.workSchedule[day].breaks[index].start = time;
    }
  }

  setBreakEnd(day: string, index: number, event: any): void {
    const time = event.target.value;
    if (this.workSchedule[day]?.breaks?.[index]) {
      this.workSchedule[day].breaks[index].end = time;
    }
  }

  getWorkScheduleDays(): any[] {
    if (!this.companyProfile?.work_schedule) return [];

    try {
      const schedule = JSON.parse(this.companyProfile.work_schedule);
      return this.weekDays.map((day) => ({
        name: day,
        schedule: schedule[day],
      }));
    } catch {
      return [];
    }
  }

  previewMOA(): void {
    if (this.companyProfile?.moa_file) {
      const moaUrl = `${environment.apiUrl}${this.companyProfile.moa_file}`;
      window.open(moaUrl, '_blank');
    }
  }

  downloadMOA(): void {
    if (this.companyProfile?.moa_file) {
      const moaUrl = `${environment.apiUrl}${this.companyProfile.moa_file}`;
      const link = document.createElement('a');
      link.href = moaUrl;
      link.download = `MOA_${this.companyProfile.company_name}.pdf`;
      link.click();
    }
  }
}
