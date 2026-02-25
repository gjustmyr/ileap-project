import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acceptance-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-wrapper">
      <!-- Warning if not hired -->
      <div *ngIf="!isHired()" style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin-bottom: 20px; text-align: center; border-radius: 5px;">
        <strong style="color: #856404; font-size: 14pt;">⚠️ WARNING: Student is not hired yet</strong>
        <p style="color: #856404; margin: 5px 0 0 0; font-size: 11pt;">This document cannot be completed until the student has been accepted for an internship.</p>
      </div>

      <table class="form-table">
        <!-- Hidden row for column width control -->
        <tr class="hidden-row">
          <td *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"></td>
        </tr>

        <!-- Header Row -->
        <tr class="header-row">
          <td rowspan="2" class="logo-cell" colspan="2">
            <img src="/assets/img/logo.png" alt="BatStateU Logo" class="logo" />
          </td>
          <td class="header-cell" colspan="8">
            Reference No.: BatStateU-FO-OJT-06
          </td>
          <td class="header-cell" colspan="6">
            Effectivity Date: May 18, 2022
          </td>
          <td class="header-cell" colspan="4">
            Revision No.: 01
          </td>
        </tr>

        <!-- Title Row -->
        <tr>
          <td colspan="18" class="title-cell">
            <strong>ON-THE-JOB TRAINEE ACCEPTANCE FORM</strong>
          </td>
        </tr>

        <!-- Date Row -->
        <tr>
          <td colspan="20" class="date-row">
            <div style="text-align: right;">
              Date {{ currentDate }}
            </div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td colspan="20" class="content-text">
            <p style="margin: 0 0 0 50px;">This is to certify that Mr./Ms. <u>{{ data?.first_name }} {{ data?.middle_name }} {{ data?.last_name }}</u> a <u>{{ data?.year_level }}</u> year</p>
            <p style="margin: 0 0 0 50px; font-style: italic; font-size: 9pt;"><span style="margin-left: 300px;">Name of Student</span><span style="margin-left: 150px;">Year Level</span></p>
            <p style="margin: 8px 0 0 0;"><u>{{ data?.program }}</u> student in the College of <u>{{ data?.college }}</u></p>
            <p style="margin: 0 0 0 30px; font-style: italic; font-size: 9pt;"><span style="margin-left: 40px;">Program</span><span style="margin-left: 350px;">Name of College</span></p>
            <p style="margin: 8px 0 0 0;">- <u>{{ data?.campus }}</u> Campus, has been officially accepted as STUDENT-TRAINEE at</p>
            <p style="margin: 0; font-style: italic; font-size: 9pt; margin-left: 70px;">Name of Campus</p>
            <p style="margin: 8px 0 0 30px;"><u>{{ data?.company_name }}</u> which is located at <u>{{ data?.company_address }}</u>.</p>
            <p style="margin: 0; font-style: italic; font-size: 9pt;"><span style="margin-left: 70px;">Name of Company</span><span style="margin-left: 150px;">Complete Address of the Company</span></p>
          </td>
        </tr>

        <!-- Assignment Details Header -->
        <tr>
          <td colspan="20" class="section-header">
            The details of his/her assignment are as follows:
          </td>
        </tr>

        <!-- Assignment Details Table -->
        <tr>
          <td colspan="10" class="detail-label">Branch Department/Section:</td>
          <td colspan="10" class="detail-field">{{ data?.company_department || '&nbsp;' }}</td>
        </tr>
        <tr>
          <td colspan="10" class="detail-label">Name of Supervisor:</td>
          <td colspan="10" class="detail-field">{{ data?.supervisor_name || '&nbsp;' }}</td>
        </tr>
        <tr>
          <td colspan="10" class="detail-label">Training Schedule (Hours and Days):</td>
          <td colspan="10" class="detail-field">{{ data?.training_schedule || '&nbsp;' }}</td>
        </tr>
        <tr>
          <td colspan="10" class="detail-label">Required Number of Hours:</td>
          <td colspan="10" class="detail-field">{{ data?.required_hours || '&nbsp;' }}</td>
        </tr>
        <tr>
          <td colspan="10" class="detail-label">Effective Date of Start:</td>
          <td colspan="10" class="detail-field">{{ formatDate(data?.ojt_start_date) }}</td>
        </tr>

        <!-- Privacy Statement -->
        <tr>
          <td colspan="20" class="privacy-text">
            Pursuant to Republic Act No. 10173, also known as the Data Privacy Act of 2012, the Batangas State University, the National Engineering University, recognizes its commitment to protect and respect the privacy of its customers and/or stakeholders and ensure that all information collected from them are all processed in accordance with the principles of transparency, legitimate purpose and proportionality mandated under the Data Privacy Act of 2012.
          </td>
        </tr>

        <!-- Signature Section -->
        <tr>
          <td colspan="10" class="signature-section" style="vertical-align: top;">
            <p style="margin: 0;">Noted by:</p>
            <div style="margin-top: 60px;">
              <div class="signature-line"></div>
              <p style="margin: 2px 0; text-align: center;">Company Representative</p>
              <p style="margin: 2px 0; text-align: center;">(Signature over Printed Name)</p>
              <p style="margin: 2px 0;">Date:</p>
              <p style="margin: 2px 0;">Position:</p>
              <p style="margin: 2px 0;">Department:</p>
              <p style="margin: 2px 0;">Contact Number:</p>
              <p style="margin: 2px 0;">Email Address:</p>
            </div>
          </td>
          <td colspan="10" class="signature-section" style="vertical-align: top;">
            <p style="margin: 0;">Conforme:</p>
            <div style="display: flex; gap: 20px; margin-top: 60px;">
              <div style="flex: 1;">
                <div class="signature-line"></div>
                <p style="margin: 2px 0; text-align: center;">{{ data?.first_name }} {{ data?.last_name }}</p>
                <p style="margin: 2px 0; text-align: center;">(Signature over Printed Name)</p>
                <p style="margin: 2px 0; text-align: center;">Date:</p>
              </div>
              <div style="flex: 1;">
                <div class="signature-line"></div>
                <p style="margin: 2px 0; text-align: center;">{{ getParentGuardianName() }}</p>
                <p style="margin: 2px 0; text-align: center;">(Signature over Printed Name)</p>
                <p style="margin: 2px 0; text-align: center;">Date:</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .document-wrapper {
      width: 8.5in;
      min-height: 13in;
      margin: 0 auto;
      padding: 0.75in;
      font-family: "Times New Roman", Times, serif;
      font-size: 11pt;
      background: white;
    }
    
    .form-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid black;
    }
    
    .form-table tr:first-child td {
      width: 5%;
    }
    
    .form-table td {
      border: 1px solid black;
      vertical-align: top;
    }
    
    .hidden-row {
      height: 0;
      visibility: collapse;
    }
    
    .hidden-row td {
      border: none;
      padding: 0;
      height: 0;
      visibility: hidden;
    }
    
    .header-row {
      border-top: 2px solid black;
    }
    
    .logo-cell {
      text-align: center;
      vertical-align: middle;
    }
    
    .logo {
      width: 70px;
      height: auto;
    }
    
    .header-cell {
      font-size: 10pt;
      text-align: center;
      vertical-align: middle;
      padding: 2px;
      border: none !important;
    }
    
    .title-cell {
      text-align: center;
      font-size: 13pt;
      font-weight: bold;
      padding: 8px;
    }
    
    .date-row {
      padding: 8px;
    }
    
    .content-text {
      text-align: justify;
      padding: 16px 18px;
      font-size: 11pt;
    }
    
    .section-header {
      padding: 12px 22px;
      font-size: 11pt;
    }
    
    .detail-label {
      padding: 10px 22px;
      font-size: 11pt;
    }
    
    .detail-field {
      padding: 10px 22px;
      font-size: 11pt;
    }
    
    .privacy-text {
      text-align: justify;
      padding: 14px 22px;
      font-size: 10pt;
    }
    
    .underline-space {
      display: inline-block;
      border-bottom: 1px solid black;
      min-width: 200px;
    }
    
    .underline-space-short {
      display: inline-block;
      border-bottom: 1px solid black;
      min-width: 100px;
    }
    
    .signature-section {
      text-align: left;
      padding: 20px;
      vertical-align: top;
    }
    
    .signature-line {
      border-bottom: 1px solid black;
      margin-top: 40px;
      margin-bottom: 4px;
    }
    
    .signature-label {
      font-size: 9pt;
      margin-top: 2px;
    }
  `]
})
export class AcceptanceFormComponent {
  @Input() data: any;
  
  get currentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  isHired(): boolean {
    // Check if student has OJT start date (meaning they're hired)
    // Also check for company name as a fallback
    return !!(this.data?.ojt_start_date || this.data?.company_name);
  }

  getParentGuardianName(): string {
    // Prefer mother's name first
    if (this.data?.mother_name && !this.isDeceased(this.data.mother_name)) {
      return this.data.mother_name;
    } 
    // If mother is deceased or not available, use father
    else if (this.data?.father_name && !this.isDeceased(this.data.father_name)) {
      return this.data.father_name;
    } 
    // If both parents are deceased or not available, use guardian
    else if (this.data?.guardian_name) {
      return this.data.guardian_name;
    }
    return '';
  }

  isDeceased(name: string): boolean {
    // Check if the name contains "deceased" (case insensitive)
    return !!(name && name.toLowerCase().includes('deceased'));
  }

  formatDate(dateString: string): string {
    if (!dateString) return '&nbsp;';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
