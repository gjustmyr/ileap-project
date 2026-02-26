import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internship-agreement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-wrapper">
      <!-- Warning if not hired -->
      <div
        *ngIf="!isHired()"
        style="background-color: #fffbeb; border: 1px solid #fbbf24; padding: 15px; margin-bottom: 20px; text-align: center; border-radius: 5px;"
      >
        <strong style="color: #92400e; font-size: 14pt;"
          >⚠️ WARNING: Student is not hired yet</strong
        >
        <p style="color: #92400e; margin: 5px 0 0 0; font-size: 11pt;">
          This document cannot be completed until the student has been accepted
          for an internship.
        </p>
      </div>

      <table class="form-table">
        <!-- Hidden row for column width control -->
        <tr>
          <td
            *ngFor="
              let i of [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20,
              ]
            "
          ></td>
        </tr>

        <!-- Header Row -->
        <tr class="header-row">
          <td rowspan="2" class="logo-cell" colspan="2">
            <img src="assets/img/logo.png" alt="BatStateU Logo" class="logo" />
          </td>
          <td class="header-cell" colspan="8">
            Reference No.: BatStateU-1OR-IAC
          </td>
          <td class="header-cell" colspan="6">
            Effectivity Date: May 18, 2022
          </td>
          <td class="header-cell" colspan="4">Revision No.: 01</td>
        </tr>

        <!-- Title Row -->
        <tr>
          <td colspan="18" class="title-cell">
            <strong>INTERNSHIP AGREEMENT</strong>
          </td>
        </tr>

        <tr>
          <td colspan="20" class="content-text">
            The <u>COMPANY/AGENCY</u>,
            <u>{{
              data?.company_name || '__________________________________'
            }}</u
            >, with company/agency address at
            <u>{{
              data?.company_address || '__________________________________'
            }}</u
            >, represented by Company/Agency Representative,
            <u>{{
              data?.company_representative ||
                '__________________________________________'
            }}</u>
            agrees to accommodate the STUDENT TRAINEE,
            <u
              >{{ data?.first_name }} {{ data?.middle_name }}
              {{ data?.last_name }}</u
            >, who is a
            <u>{{ data?.program || '__________________________________' }}</u>
            student of the College of
            <u>{{
              data?.college || '_____________________________________________'
            }}</u>
            of Batangas State University, the National Engineering University,
            for the purpose of providing training in various departments of the
            COMPANY/AGENCY.
          </td>
        </tr>

        <!-- Training Period -->
        <tr>
          <td colspan="20" class="content-text">
            This training period will begin on
            <span class="underline-space-short">{{
              formatDate(data?.ojt_start_date)
            }}</span>
            and will end on
            <span class="underline-space-short">{{
              formatDate(data?.ojt_end_date)
            }}</span
            >.
          </td>
        </tr>

        <!-- Terms Introduction -->
        <tr>
          <td colspan="20" class="content-text">
            The following terms and conditions shall govern this agreement:
          </td>
        </tr>

        <!-- Term 1 -->
        <tr>
          <td colspan="20" class="content-text">
            1. The COMPANY/AGENCY shall provide the STUDENT TRAINEE orientation
            and training&nbsp;&nbsp; on the areas pertinent to his / her line of
            specialization.
          </td>
        </tr>

        <!-- Term 2 -->
        <tr>
          <td colspan="20" class="content-text">
            2. The training agreement shall not, in any way, constitute an
            employee-employer relationship and the STUDENT TRAINEE shall leave
            the COMPANY/AGENCY free and harmless from any demand, claim or
            complaint, whatsoever arising from this training agreement, except
            in cases of gross negligence, malicious acts and criminal acts by
            the COMPANY/AGENCY or any of its officers and employees.
          </td>
        </tr>

        <!-- Term 3 -->
        <tr>
          <td colspan="20" class="content-text">
            3. The status of the STUDENT TRAINEE while on training shall be that
            of STUDENT TRAINEE. As such, he/she shall not be entitled to any
            compensation and to any of the benefits accorded to an employee.
          </td>
        </tr>

        <!-- Term 4 -->
        <tr>
          <td colspan="20" class="content-text">
            4. The COMPANY/AGENCY may grant the STUDENT TRAINEE a training
            allowance based on COMPANY policies.
          </td>
        </tr>

        <!-- Term 5 -->
        <tr>
          <td colspan="20" class="content-text">
            5. The STUDENT TRAINEE shall conform to all the rules and
            regulations of the COMPANY/AGENCY while on training.
          </td>
        </tr>

        <!-- Term 6 -->
        <tr>
          <td colspan="20" class="content-text">
            6. The STUDENT TRAINEE shall not divulge any information that he/she
            may have access to, and any such information will only be used for
            academic purposes.
          </td>
        </tr>

        <!-- Term 7 -->
        <tr>
          <td colspan="20" class="content-text">
            7. Both the COMPANY/AGENCY and the STUDENT TRAINEE have the right to
            pre terminate the on the-job training if:
          </td>
        </tr>

        <!-- Term 7a -->
        <tr>
          <td colspan="20" class="content-text">
            <span class="indent"></span>
            a. the STUDENT TRAINEE does not show the required interest,
            maturity, or discipline during the training period, or if there is
            serious misconduct
          </td>
        </tr>

        <!-- Term 7b -->
        <tr>
          <td colspan="20" class="content-text">
            <span class="indent"></span>
            b. the COMPANY/AGENCY does not provide the kind of responsible
            training as agreed upon.
          </td>
        </tr>

        <!-- Closing Paragraph -->
        <tr>
          <td colspan="20" class="content-text">
            The terminating party will inform the On-the-Job Training Office
            through its OJT Coordinator before any decision to terminate is made
            and finalized. The OJT Coordinator will intervene in order to
            rectify the situation in the interest of all parties concerned.
          </td>
        </tr>

        <!-- Signature Section -->
        <tr>
          <td colspan="10" class="signature-cell">
            <div class="signature-label" style="margin-bottom: 2px;">
              {{ getCompanyRepresentative() }}
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">
              (Signature over Printed Name of Company/Agency Representative)
            </div>
            <div class="signature-label">Date:</div>
          </td>
          <td colspan="10" class="signature-cell">
            <div class="signature-label" style="margin-bottom: 2px;">
              {{ data?.first_name }} {{ data?.middle_name }}
              {{ data?.last_name }}
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">
              (Signature over Printed Name of Student Trainee)
            </div>
            <div class="signature-label">Date:</div>
          </td>
        </tr>

        <!-- Second Signature Row -->
        <tr>
          <td colspan="10" class="signature-cell">
            <div class="signature-label" style="margin-bottom: 2px;">
              {{ data?.ojt_coordinator || '&nbsp;' }}
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">
              (Signature over Printed Name of OJT Coordinator)
            </div>
            <div class="signature-label">Date:</div>
          </td>
          <td colspan="10" class="signature-cell">
            <div class="signature-label" style="margin-bottom: 2px;">
              {{ getParentGuardianName() }}
            </div>
            <div class="signature-line"></div>
            <div class="signature-label">
              (Signature over Printed Name of Parent/Guardian)
            </div>
            <div class="signature-label">Date:</div>
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [
    `
      .document-wrapper {
        width: 8.5in;
        min-height: 12in;
        margin: 0 auto;
        padding: 0.75in;
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
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
        font-size: 12pt;
        text-align: center;
        vertical-align: middle;
        padding: 2px;
        border: none !important;
      }

      .title-cell {
        text-align: center;
        font-size: 12pt;
        font-weight: bold;
        padding: 8px;
      }

      .content-text {
        text-align: justify;
        padding: 10px 19px;
        font-size: 12pt;
      }

      .indent {
        padding-left: 60px;
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

      .signature-cell {
        text-align: left;
        padding: 40px 20px 10px 20px;
        vertical-align: bottom;
      }

      .signature-line {
        border-bottom: 1px solid black;
        margin-bottom: 4px;
      }

      .signature-label {
        font-size: 9pt;
        margin-top: 2px;
      }
    `,
  ],
})
export class InternshipAgreementComponent {
  @Input() data: any;

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
    else if (
      this.data?.father_name &&
      !this.isDeceased(this.data.father_name)
    ) {
      return this.data.father_name;
    }
    // If both parents are deceased or not available, use guardian
    else if (this.data?.guardian_name) {
      return this.data.guardian_name;
    }
    return '&nbsp;';
  }

  isDeceased(name: string): boolean {
    // Check if the name contains "deceased" (case insensitive)
    return !!(name && name.toLowerCase().includes('deceased'));
  }

  getCompanyRepresentative(): string {
    return this.data?.company_representative || '&nbsp;';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '&nbsp;';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }
}
