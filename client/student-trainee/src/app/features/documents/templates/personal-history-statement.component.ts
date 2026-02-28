import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-history-statement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-wrapper">
      <table class="form-table">
        <!-- Column Structure -->
        <tr class="hidden-row">
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
          <td class="logo-cell" colspan="2">
            <img
              src="assets/img/logo.png"
              alt="Batangas State University Logo"
              class="logo"
            />
          </td>
          <td class="header-cell" colspan="8">
            Reference No.: BatStateU-FO-OJT-02
          </td>
          <td class="header-cell" colspan="6">
            Effectivity Date: May 18, 2022
          </td>
          <td class="header-cell" colspan="4">Revision No.: 02</td>
        </tr>

        <tr>
          <td class="title-cell" colspan="17">
            <strong>STUDENT TRAINEE'S PERSONAL HISTORY STATEMENT</strong>
          </td>
          <td class="picture-cell" colspan="3">
            <img
              *ngIf="data?.profile_picture"
              [src]="getProfilePictureUrl()"
              alt="Student Photo"
              class="student-photo"
              crossorigin="anonymous"
            />
            <div *ngIf="!data?.profile_picture" class="no-photo">
              <p>Paste</p>
              <p>"1X1"</p>
              <p>PICTURE</p>
              <p>here</p>
            </div>
          </td>
        </tr>

        <!-- Student Information Section -->
        <tr>
          <td class="section-header" colspan="20">
            <strong>Student Information</strong>
          </td>
        </tr>

        <!-- NAME Row -->
        <tr>
          <td class="field-row name-cell" colspan="20">
            <div class="name-wrapper">
              <span class="field-label">NAME:</span>
              <div class="field-container name-fields">
                <span class="field-input">
                  <span class="keep-underline">{{
                    data?.last_name || '&nbsp;'
                  }}</span>
                  <span class="field-sublabel">LAST</span>
                </span>
                <span class="field-input">
                  <span class="keep-underline">{{
                    data?.first_name || '&nbsp;'
                  }}</span>
                  <span class="field-sublabel">FIRST</span>
                </span>
                <span class="field-input">
                  <span class="keep-underline">{{
                    data?.middle_name || '&nbsp;'
                  }}</span>
                  <span class="field-sublabel">MIDDLE</span>
                </span>
              </div>
            </div>
          </td>
        </tr>

        <!-- AGE and SEX Row -->
        <tr>
          <td class="field-row" colspan="9">
            <span class="field-label">AGE:</span>
            <span>{{ data?.age || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="11">
            <span class="field-label">SEX:</span>
            <label
              ><input type="checkbox" [checked]="data?.sex === 'Male'" />
              MALE</label
            >
            <label
              ><input type="checkbox" [checked]="data?.sex === 'Female'" />
              FEMALE</label
            >
          </td>
        </tr>

        <!-- HEIGHT, WEIGHT, COMPLEXION Row -->
        <tr>
          <td class="field-row" colspan="6">
            <span class="field-label">HEIGHT:</span>
            <span
              >&nbsp;{{ data?.height ? data.height + ' cm' : '&nbsp;' }}</span
            >
          </td>
          <td class="field-row" colspan="6">
            <span class="field-label">WEIGHT:</span>
            <span
              >&nbsp;{{ data?.weight ? data.weight + ' kg' : '&nbsp;' }}</span
            >
          </td>
          <td class="field-row" colspan="8">
            <span class="field-label">COMPLEXION:</span>
            <span>&nbsp;{{ data?.complexion || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- DISABILITY Row -->
        <tr>
          <td class="field-row" colspan="20">
            <span class="field-label">DISABILITY (IF ANY)</span>
            <span>&nbsp;{{ data?.disability || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- BIRTHDATE and BIRTHPLACE Row -->
        <tr>
          <td class="field-row birthdate-cell" colspan="9">
            <span class="field-label birthdate-label">BIRTHDATE:</span>
            <div class="date-boxes">
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(0)"
                  readonly
                />
                <div class="date-label">m</div>
              </div>
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(1)"
                  readonly
                />
                <div class="date-label">m</div>
              </div>
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(2)"
                  readonly
                />
                <div class="date-label">d</div>
              </div>
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(3)"
                  readonly
                />
                <div class="date-label">d</div>
              </div>
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(4)"
                  readonly
                />
                <div class="date-label">y</div>
              </div>
              <div>
                <input
                  type="text"
                  maxlength="1"
                  class="date-box"
                  [value]="getBirthdateDigit(5)"
                  readonly
                />
                <div class="date-label">y</div>
              </div>
            </div>
          </td>
          <td class="field-row birthplace-cell" colspan="11">
            <span class="field-label">BIRTHPLACE:</span>
            <span>&nbsp;{{ data?.birthplace || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- CITIZENSHIP and CIVIL STATUS Row -->
        <tr>
          <td class="field-row" colspan="10">
            <span class="field-label">CITIZENSHIP:</span>
            <span>&nbsp;{{ data?.citizenship || 'Filipino' }}</span>
          </td>
          <td class="field-row" colspan="10">
            <span class="field-label">CIVIL STATUS:</span>
            <span>&nbsp;{{ data?.civil_status || 'Single' }}</span>
          </td>
        </tr>

        <!-- PRESENT ADDRESS Row -->
        <tr>
          <td class="field-row" colspan="14">
            <span class="field-label">PRESENT ADDRESS:</span>
            <span>&nbsp;{{ data?.present_address || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="6">
            <span class="field-label">TEL. NO.</span>
            <span>&nbsp;{{ data?.contact_number || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- PROVINCIAL ADDRESS Row -->
        <tr>
          <td class="field-row" colspan="14">
            <span class="field-label">PROVINCIAL ADDRESS:</span>
            <span
              >&nbsp;{{
                data?.provincial_address || data?.present_address || '&nbsp;'
              }}</span
            >
          </td>
          <td class="field-row" colspan="6">
            <span class="field-label">TEL. NO.</span>
            <span>&nbsp;{{ data?.tel_no_provincial || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- Family Background Section -->
        <tr>
          <td class="section-header" colspan="20">
            <strong>Family Background</strong> (if parents are deceased, give
            data for the nearest relative and indicate relationship to
            applicant)
          </td>
        </tr>

        <!-- FATHER'S NAME Row -->
        <tr>
          <td class="field-row" colspan="12">
            <span class="field-label">FATHER'S NAME:</span>
            <span>&nbsp;{{ data?.father_name || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="8">
            <span class="field-label">OCCUPATION:</span>
            <span>&nbsp;{{ data?.father_occupation || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- MOTHER'S NAME Row -->
        <tr>
          <td class="field-row" colspan="12">
            <span class="field-label">MOTHER'S NAME:</span>
            <span>&nbsp;{{ data?.mother_name || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="8">
            <span class="field-label">OCCUPATION:</span>
            <span>&nbsp;{{ data?.mother_occupation || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- ADDRESS OF PARENTS Row -->
        <tr>
          <td class="field-row" colspan="12">
            <span class="field-label">ADDRESS OF PARENTS:</span>
            <span
              >&nbsp;{{
                data?.parents_address || data?.present_address || '&nbsp;'
              }}</span
            >
          </td>
          <td class="field-row" colspan="8">
            <span class="field-label">TEL. NO.:</span>
            <span>&nbsp;{{ data?.parents_tel_no || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- GUARDIAN'S NAME Row -->
        <tr>
          <td class="field-row" colspan="12">
            <span class="field-label">GUARDIAN'S NAME:</span>
            <span>&nbsp;{{ data?.guardian_name || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="8">
            <span class="field-label">TEL. NO.:</span>
            <span>&nbsp;{{ data?.guardian_tel_no || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- SCHOOL INFORMATION Section -->
        <tr>
          <td class="section-header" colspan="20">
            <strong>SCHOOL INFORMATION</strong>
          </td>
        </tr>

        <!-- PROGRAM Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">PROGRAM:</span>
            <span>&nbsp;{{ data?.program || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">YEAR LEVEL:</span>
            <span>&nbsp;{{ data?.year_level || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- MAJOR Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">MAJOR:</span>
            <span>&nbsp;{{ data?.major || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">LENGTH OF PROGRAM:</span>
            <span>&nbsp;{{ data?.program_length || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- DEPARTMENT Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">DEPARTMENT:</span>
            <span>&nbsp;{{ data?.department || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">SCHOOL ADDRESS:</span>
            <span>&nbsp;{{ data?.school_address || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- OJT COORDINATOR Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">OJT COORDINATOR:</span>
            <span>&nbsp;{{ data?.ojt_coordinator || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">TEL. NO.:</span>
            <span>&nbsp;{{ data?.ojt_coordinator_tel || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- OJT HEAD Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">OJT HEAD:</span>
            <span>&nbsp;{{ data?.ojt_head || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">TEL. NO.:</span>
            <span>&nbsp;{{ data?.ojt_head_tel || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- DEAN Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">DEAN:</span>
            <span>&nbsp;{{ data?.dean || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">TEL. NO.:</span>
            <span>&nbsp;{{ data?.dean_tel || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- Emergency Contact Section -->
        <tr>
          <td class="field-row" colspan="20">
            <span class="field-label">In case of emergency, notify</span>
          </td>
        </tr>

        <!-- Emergency NAME Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">NAME:</span>
            <span>{{ data?.emergency_contact_name || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">RELATIONSHIP:</span>
            <span>{{ data?.emergency_contact_relationship || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- Emergency ADDRESS Row -->
        <tr>
          <td class="field-row" colspan="11">
            <span class="field-label">ADDRESS:</span>
            <span>{{ data?.emergency_contact_address || '&nbsp;' }}</span>
          </td>
          <td class="field-row" colspan="9">
            <span class="field-label">TEL. NO.:</span>
            <span>{{ data?.emergency_contact_tel || '&nbsp;' }}</span>
          </td>
        </tr>

        <!-- Data Privacy Statement -->
        <tr>
          <td class="privacy-text" colspan="20">
            Pursuant to Republic Act No. 10173, also known as the Data Privacy
            Act of 2012, the Batangas State University, the National Engineering
            University, recognizes its commitment to protect and respect the
            privacy of its customers and/or stakeholders and ensure that all
            information collected from them are all processed in accordance with
            the principles of transparency, legitimate purpose and
            proportionality mandated under the Data Privacy Act of 2012.
          </td>
        </tr>

        <!-- Certification Statement -->
        <tr>
          <td class="certification-text" colspan="20">
            I hereby certify that the foregoing answers are true and correct to
            the best to my knowledge, belief and ability.
          </td>
        </tr>

        <!-- Signature Row -->
        <tr class="signature-row">
          <td class="signature-cell signed-at-cell" colspan="11">
            Signed at:
            <span class="keep-underline"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
            >
          </td>
          <td class="signature-cell date-cell" colspan="9">
            Date:
            <span class="keep-underline"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
            >
          </td>
        </tr>

        <!-- Blank space for signature -->
        <tr>
          <td class="signature-space" colspan="20">&nbsp;</td>
        </tr>

        <!-- Signature line -->
        <tr>
          <td class="signature-line" colspan="20">
            <div class="signature-border">
              {{ data?.first_name }} {{ data?.middle_name }}
              {{ data?.last_name }}
            </div>
            <div class="signature-label font-bold mb-3">
              Applicant's Signature over Printed Name
            </div>
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [
    `
      .document-wrapper {
        width: 8.5in;
        height: 13in;
        margin: 0 auto;
        padding: 0.5in;
        font-family: 'Times New Roman', Times, serif;
        font-size: 11px;
        background: white;
        box-sizing: border-box;
      }

      .form-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #000;
      }

      .form-table tr:first-child td {
        width: 5%;
      }

      .form-table td {
        border: 1px solid #000;
        padding: 3px 4px;
        vertical-align: middle;
        font-size: 11px;
      }

      .hidden-row {
        height: 0;
        visibility: hidden;
      }

      .hidden-row td {
        border: none !important;
        padding: 0 !important;
        visibility: hidden;
      }

      .logo-cell {
        white-space: nowrap;
        text-align: center;
        width: 60px;
      }

      .logo {
        height: 35px;
        object-fit: contain;
        display: block;
        margin: 0 auto;
      }

      .header-cell {
        font-size: 10px;
        text-align: left;
        padding: 4px;
        vertical-align: middle;
      }

      .header-row {
        border-top: 2px solid #000;
      }

      .title-cell {
        text-align: center;
        font-size: 13pt;
        padding: 6px;
        font-weight: bold;
      }

      .picture-cell {
        text-align: center;
        vertical-align: middle;
        font-size: 10px;
        padding: 4px;
        height: 100px;
      }

      .student-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        margin: 0 auto;
      }

      .no-photo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .no-photo p {
        margin: 2px 0;
      }

      .section-header {
        padding: 4px 6px;
        font-size: 11px;
      }

      .field-row {
        padding: 3px 6px;
        font-size: 11px;
      }

      .field-container {
        display: flex;
        align-items: flex-end;
        gap: 20px;
      }

      .field-label {
        font-weight: normal;
        margin-right: 5px;
      }

      .field-input {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }

      .field-sublabel {
        font-size: 9px;
        margin-top: 1px;
      }

      .keep-underline {
        display: inline-block;
        border-bottom: 1px solid #000;
        padding-bottom: 1px;
        padding-top: 12px;
        min-width: 150px;
      }

      input[type='checkbox'] {
        margin-right: 5px;
        margin-left: 10px;
      }

      label {
        margin-right: 15px;
      }

      .privacy-text,
      .certification-text {
        padding: 10px 12px;
        font-size: 10px;
        text-align: justify;
        line-height: 1.3;
        border-top: 1px solid #000 !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
      }

      .signature-space {
        height: 40px;
        border: none !important;
      }

      .signature-line {
        text-align: center;
        padding: 6px;
        border: none !important;
      }

      .signature-border {
        margin: 0 auto;
        width: 250px;
        font-weight: normal;
        border-bottom: 1px solid #000;
        padding-bottom: 2px;
      }

      .signature-label {
        margin-top: 3px;
        font-size: 11px;
      }

      .name-cell {
        text-align: left;
        vertical-align: top;
      }

      .name-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
      }

      .name-fields {
        display: flex;
        flex-direction: row;
        margin-left: 10px;
      }

      .birthdate-cell {
        vertical-align: top;
      }

      .birthdate-label {
        vertical-align: top;
      }

      .birthplace-cell {
        vertical-align: top;
      }

      .signature-row {
        border-bottom: none !important;
        border-top: none !important;
      }

      .certification-text {
        border-bottom: none !important;
      }

      .signed-at-cell {
        border-bottom: none !important;
        border-right: none !important;
        border-left: none !important;
        border-top: none !important;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 12px;
        text-align: right;
        font-size: 11px;
      }

      .date-cell {
        border-bottom: none !important;
        border-left: none !important;
        border-right: none !important;
        border-top: none !important;
        padding-left: 12px !important;
        padding-right: 12px;
        padding-top: 12px;
        font-size: 11px;
      }

      .signature-cell {
        padding: 40px 20px 10px 20px;
        vertical-align: bottom;
      }

      .date-boxes {
        display: inline-flex;
        align-items: flex-start;
        gap: 2px;
        vertical-align: middle;
      }

      .date-box {
        width: 18px;
        height: 18px;
        border: 1px solid #000;
        text-align: center;
        font-size: 11px;
        background: white;
      }

      .date-label {
        font-size: 9px;
        text-align: center;
        margin-top: 1px;
      }
    `,
  ],
})
export class PersonalHistoryStatementComponent {
  @Input() data: any;

  getBirthdateDigit(index: number): string {
    if (!this.data?.birthdate) return '';

    // Convert birthdate to MMDDYY format
    const date = new Date(this.data.birthdate);
    if (isNaN(date.getTime())) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const mmddyy = month + day + year;
    return mmddyy[index] || '';
  }

  getProfilePictureUrl(): string {
    if (!this.data?.profile_picture) return '';

    // If it's already a full URL, return it
    if (this.data.profile_picture.startsWith('http')) {
      return this.data.profile_picture;
    }

    // Otherwise, construct the URL
    return `http://47.128.70.19:3000/${this.data.profile_picture}`;
  }
}
