import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

interface StudentData {
  // Personal Information
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: number;
  sex?: string;
  height?: string;
  weight?: string;
  complexion?: string;
  disability?: string;
  birthdate?: string;
  birthplace?: string;
  citizenship?: string;
  civil_status?: string;
  
  // Contact Information
  present_address?: string;
  tel_no_present?: string;
  provincial_address?: string;
  tel_no_provincial?: string;
  
  // Family Background
  father_name?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_occupation?: string;
  parents_address?: string;
  parents_tel_no?: string;
  guardian_name?: string;
  guardian_tel_no?: string;
  
  // Emergency Contact
  emergency_contact_address?: string;
  emergency_contact_tel?: string;
  
  // School Information
  program?: string;
  major?: string;
  department?: string;
  year_level?: string;
  length_of_program?: string;
  school_address?: string;
  campus_name?: string;
  
  // Staff Information
  ojt_coordinator?: string;
  ojt_coordinator_tel?: string;
  ojt_head?: string;
  ojt_head_tel?: string;
}

@Component({
  selector: 'app-personal-history-statement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-history-statement.component.html',
  styleUrls: ['./personal-history-statement.component.css']
})
export class PersonalHistoryStatementComponent implements OnInit {
  studentData: StudentData | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<{status: string, data: StudentData}>(`${environment.apiUrl}/students/personal-history-statement-data`, { headers })
      .subscribe({
        next: (response) => {
          this.studentData = response.data;
          this.isLoading = false;
          console.log('Student data loaded:', this.studentData);
        },
        error: (error) => {
          console.error('Error loading student data:', error);
          this.errorMessage = 'Failed to load student data. Please try again.';
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load student data. Please try again later.'
          });
        }
      });
  }

  async downloadDocument(): Promise<void> {
    if (!this.studentData) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'Please wait for your data to load before downloading.'
      });
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      // Draw main border
      doc.setLineWidth(0.3);
      doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2));

      // Set default font to Times New Roman
      doc.setFont('times', 'normal');

      // Header row - cells with vertical dividers
      const headerHeight = 18;
      const logoCell = 30;
      const refCell = 72;
      const effCell = 63;
      
      // Vertical lines for header
      doc.line(margin + logoCell, y, margin + logoCell, y + headerHeight);
      doc.line(margin + logoCell + refCell, y, margin + logoCell + refCell, y + headerHeight);
      doc.line(margin + logoCell + refCell + effCell, y, margin + logoCell + refCell + effCell, y + headerHeight);
      doc.line(margin, y + headerHeight, pageWidth - margin, y + headerHeight);

      // Logo
      try {
        const logoData = await this.loadImage('/assets/img/logo.png');
        doc.addImage(logoData, 'PNG', margin + 3, y + 2, 20, 14);
      } catch (error) {
        console.warn('Logo not found');
      }

      // Header text
      doc.setFontSize(8);
      doc.setFont('times', 'normal');
      doc.text('Reference No.: BatStateU-FO-OJT-02', margin + logoCell + 2, y + 9);
      doc.text('Effectivity Date: May 18, 2022', margin + logoCell + refCell + 2, y + 9);
      doc.text('Revision No.: 02', margin + logoCell + refCell + effCell + 2, y + 9);

      y += headerHeight;

      // Title and Picture row
      const titleRowHeight = 25;
      const pictureWidth = 32;
      
      // Vertical line for picture box
      doc.line(pageWidth - margin - pictureWidth, y, pageWidth - margin - pictureWidth, y + titleRowHeight);
      doc.line(margin, y + titleRowHeight, pageWidth - margin, y + titleRowHeight);
      
      // Picture box
      doc.rect(pageWidth - margin - pictureWidth + 3, y + 3, pictureWidth - 6, 20);
      doc.setFontSize(7);
      doc.text('"1X1"', pageWidth - margin - pictureWidth / 2, y + 11, { align: 'center' });
      doc.text('PICTURE', pageWidth - margin - pictureWidth / 2, y + 15, { align: 'center' });

      // Title
      doc.setFontSize(11);
      doc.setFont('times', 'bold');
      doc.text("STUDENT TRAINEE'S PERSONAL HISTORY STATEMENT", pageWidth / 2, y + 13, { align: 'center' });
      
      y += titleRowHeight;

      // Student Information header
      const sectionHeight = 6;
      doc.setFontSize(8);
      doc.setFont('times', 'bold');
      doc.text('Student Information', margin + 1, y + 4);
      doc.setFont('times', 'normal');
      doc.line(margin, y + sectionHeight, pageWidth - margin, y + sectionHeight);
      y += sectionHeight;

      doc.setFontSize(7);

      // NAME row with underlines
      const nameRowHeight = 9;
      doc.text('NAME:', margin + 1, y + 6);
      
      // Draw underlines for name fields
      const nameStartX = margin + 35;
      const lastNameEnd = nameStartX + 60;
      const firstNameEnd = lastNameEnd + 60;
      const middleNameEnd = pageWidth - margin - 2;
      
      doc.line(nameStartX, y + 7, lastNameEnd, y + 7);
      doc.line(lastNameEnd + 5, y + 7, firstNameEnd, y + 7);
      doc.line(firstNameEnd + 5, y + 7, middleNameEnd, y + 7);
      
      // Labels above underlines
      doc.text('LAST', nameStartX + 25, y + 2, { align: 'center' });
      doc.text('FIRST', lastNameEnd + 30, y + 2, { align: 'center' });
      doc.text('MIDDLE', firstNameEnd + 25, y + 2, { align: 'center' });
      
      // Data
      if (this.studentData.last_name) doc.text(this.studentData.last_name, nameStartX + 2, y + 6);
      if (this.studentData.first_name) doc.text(this.studentData.first_name, lastNameEnd + 7, y + 6);
      if (this.studentData.middle_name) doc.text(this.studentData.middle_name, firstNameEnd + 7, y + 6);
      
      doc.line(margin, y + nameRowHeight, pageWidth - margin, y + nameRowHeight);
      y += nameRowHeight;

      // AGE, SEX row with vertical line
      const fieldRowHeight = 6;
      const ageWidth = 45;
      
      doc.text('AGE:', margin + 1, y + 4);
      doc.line(margin + 10, y + 4.5, margin + ageWidth - 2, y + 4.5);
      if (this.studentData.age) doc.text(this.studentData.age.toString(), margin + 12, y + 4);
      
      // Vertical line between AGE and SEX
      doc.line(margin + ageWidth, y, margin + ageWidth, y + fieldRowHeight);
      
      doc.text('SEX:', margin + ageWidth + 2, y + 4);
      doc.rect(margin + ageWidth + 12, y + 1.5, 3, 3);
      doc.text('MALE', margin + ageWidth + 16, y + 4);
      doc.rect(margin + ageWidth + 32, y + 1.5, 3, 3);
      doc.text('FEMALE', margin + ageWidth + 36, y + 4);
      
      if (this.studentData.sex?.toLowerCase() === 'male') {
        doc.text('✓', margin + ageWidth + 12.8, y + 4);
      } else if (this.studentData.sex?.toLowerCase() === 'female') {
        doc.text('✓', margin + ageWidth + 32.8, y + 4);
      }
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // HEIGHT, WEIGHT, COMPLEXION row with vertical lines
      const heightWidth = 55;
      const weightWidth = 55;
      
      doc.text('HEIGHT:', margin + 1, y + 4);
      doc.line(margin + 17, y + 4.5, margin + heightWidth - 2, y + 4.5);
      if (this.studentData.height) doc.text(this.studentData.height, margin + 19, y + 4);
      
      // Vertical line between HEIGHT and WEIGHT
      doc.line(margin + heightWidth, y, margin + heightWidth, y + fieldRowHeight);
      
      doc.text('WEIGHT:', margin + heightWidth + 2, y + 4);
      doc.line(margin + heightWidth + 19, y + 4.5, margin + heightWidth + weightWidth - 2, y + 4.5);
      if (this.studentData.weight) doc.text(this.studentData.weight, margin + heightWidth + 21, y + 4);
      
      // Vertical line between WEIGHT and COMPLEXION
      doc.line(margin + heightWidth + weightWidth, y, margin + heightWidth + weightWidth, y + fieldRowHeight);
      
      doc.text('COMPLEXION:', margin + heightWidth + weightWidth + 2, y + 4);
      doc.line(margin + heightWidth + weightWidth + 24, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.complexion) doc.text(this.studentData.complexion, margin + heightWidth + weightWidth + 26, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // DISABILITY row
      doc.text('DISABILITY(IF ANY)', margin + 1, y + 4);
      doc.line(margin + 38, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.disability) doc.text(this.studentData.disability, margin + 40, y + 4);
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // BIRTHDATE, BIRTHPLACE row with vertical line
      const bdRowHeight = 8;
      const birthdateWidth = 95;
      
      doc.text('BIRTHDATE:', margin + 1, y + 5);
      
      const bdX = margin + 24;
      const boxSize = 4.5;
      const boxGap = 1;
      
      // Month boxes
      doc.rect(bdX, y + 2, boxSize, boxSize);
      doc.rect(bdX + boxSize + boxGap, y + 2, boxSize, boxSize);
      doc.setFontSize(6);
      doc.text('m', bdX + 1.5, y + 0.5);
      doc.text('m', bdX + boxSize + boxGap + 1.5, y + 0.5);
      
      // Day boxes  
      const dayX = bdX + (boxSize + boxGap) * 2 + 2;
      doc.rect(dayX, y + 2, boxSize, boxSize);
      doc.rect(dayX + boxSize + boxGap, y + 2, boxSize, boxSize);
      doc.text('d', dayX + 1.5, y + 0.5);
      doc.text('d', dayX + boxSize + boxGap + 1.5, y + 0.5);
      
      // Year boxes
      const yearX = dayX + (boxSize + boxGap) * 2 + 2;
      doc.rect(yearX, y + 2, boxSize, boxSize);
      doc.rect(yearX + boxSize + boxGap, y + 2, boxSize, boxSize);
      doc.text('y', yearX + 1.5, y + 0.5);
      doc.text('y', yearX + boxSize + boxGap + 1.5, y + 0.5);
      
      doc.setFontSize(7);
      if (this.studentData.birthdate) {
        const date = new Date(this.studentData.birthdate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        
        doc.text(month[0], bdX + 1.3, y + 5);
        doc.text(month[1], bdX + boxSize + boxGap + 1.3, y + 5);
        doc.text(day[0], dayX + 1.3, y + 5);
        doc.text(day[1], dayX + boxSize + boxGap + 1.3, y + 5);
        doc.text(year[0], yearX + 1.3, y + 5);
        doc.text(year[1], yearX + boxSize + boxGap + 1.3, y + 5);
      }

      // Vertical line between BIRTHDATE and BIRTHPLACE
      doc.line(margin + birthdateWidth, y, margin + birthdateWidth, y + bdRowHeight);
      
      doc.text('BIRTHPLACE:', margin + birthdateWidth + 2, y + 5);
      doc.line(margin + birthdateWidth + 24, y + 5.5, pageWidth - margin - 2, y + 5.5);
      if (this.studentData.birthplace) doc.text(this.studentData.birthplace, margin + birthdateWidth + 26, y + 5);
      
      doc.line(margin, y + bdRowHeight, pageWidth - margin, y + bdRowHeight);
      y += bdRowHeight;

      // CITIZENSHIP, CIVIL STATUS row with vertical line
      const citizenshipWidth = 95;
      
      doc.text('CITIZENSHIP:', margin + 1, y + 4);
      doc.line(margin + 26, y + 4.5, margin + citizenshipWidth - 2, y + 4.5);
      if (this.studentData.citizenship) doc.text(this.studentData.citizenship, margin + 28, y + 4);
      
      // Vertical line between CITIZENSHIP and CIVIL STATUS
      doc.line(margin + citizenshipWidth, y, margin + citizenshipWidth, y + fieldRowHeight);
      
      doc.text('CIVIL STATUS:', margin + citizenshipWidth + 2, y + 4);
      doc.line(margin + citizenshipWidth + 25, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.civil_status) doc.text(this.studentData.civil_status, margin + citizenshipWidth + 27, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // PRESENT ADDRESS, TEL. NO. row with vertical line
      const presentAddrWidth = 135;
      
      doc.text('PRESENT ADDRESS:', margin + 1, y + 4);
      doc.line(margin + 38, y + 4.5, margin + presentAddrWidth - 2, y + 4.5);
      if (this.studentData.present_address) {
        const addr = doc.splitTextToSize(this.studentData.present_address, 85);
        doc.text(addr[0], margin + 40, y + 4);
      }
      
      // Vertical line between ADDRESS and TEL. NO.
      doc.line(margin + presentAddrWidth, y, margin + presentAddrWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.', margin + presentAddrWidth + 2, y + 4);
      doc.line(margin + presentAddrWidth + 20, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.tel_no_present with vertical line
      const provincialAddrWidth = 135;
      
      doc.text('PROVINCIAL ADDRESS:', margin + 1, y + 4);
      doc.line(margin + 42, y + 4.5, margin + provincialAddrWidth - 2, y + 4.5);
      if (this.studentData.provincial_address) {
        const addr = doc.splitTextToSize(this.studentData.provincial_address, 80);
        doc.text(addr[0], margin + 44, y + 4);
      }
      
      // Vertical line between ADDRESS and TEL. NO.
      doc.line(margin + provincialAddrWidth, y, margin + provincialAddrWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.', margin + provincialAddrWidth + 2, y + 4);
      doc.line(margin + provincialAddrWidth + 20, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.tel_no_provincial) doc.text(this.studentData.tel_no_provincial, margin + provincialAddrWidth + 22
      }
      
      doc.text('TEL. NO.', margin + 130, y + 4);
      doc.line(margin + 148, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.tel_no_provincial) doc.text(this.studentData.tel_no_provincial, margin + 150, y + 4);
      times', 'bold');
      doc.setFontSize(7);
      const fbHeaderHeight = 8;
      doc.text('Family Background (if parents are deceased, give data for the nearest relative and indicate relationship to applicant)', margin + 1, y + 5);
      doc.line(margin, y + fbHeaderHeight, pageWidth - margin, y + fbHeaderHeight);
      y += fbHeaderHeight;

      doc.setFont('times 8;
      doc.text('Family Background (if parents are deceased, give data for the nearest relative and indicate relationship to applicant)', margin + 1, y + 5);
      doc.line(margin, y + fbHeaderHeight, pageWidth - margin, y + fbHeaderHeight);
      y += fbHeaderHeight;

      doc.setFont('helvetica', 'normal');

      // FATHER'S NAME, OCCUPATION row with vertical line
      const familyNameWidth = 115;
      
      doc.text("FATHER'S NAME:", margin + 1, y + 4);
      doc.line(margin + 32, y + 4.5, margin + familyNameWidth - 2, y + 4.5);
      if (this.studentData.father_name) doc.text(this.studentData.father_name, margin + 34, y + 4);
      
      // Vertical line
      doc.line(margin + familyNameWidth, y, margin + familyNameWidth, y + fieldRowHeight);
      
      doc.text('OCCUPATION:', margin + familyNameWidth + 2, y + 4);
      doc.line(margin + familyNameWidth + 25, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.father_occupation) doc.text(this.studentData.father_occupation, margin + familyNameWidth + 27, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // MOTHER'S NAME, OCCUPATION row with vertical line
      doc.text("MOTHER'S NAME:", margin + 1, y + 4);
      doc.line(margin + 33, y + 4.5, margin + familyNameWidth - 2, y + 4.5);
      if (this.studentData.mother_name) doc.text(this.studentData.mother_name, margin + 35, y + 4);
      
      // Vertical line
      doc.line(margin + familyNameWidth, y, margin + familyNameWidth, y + fieldRowHeight);
      
      doc.text('OCCUPATION:', margin + familyNameWidth + 2, y + 4);
      doc.line(margin + familyNameWidth + 25, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.mother_occupation) doc.text(this.studentData.mother_occupation, margin + familyNameWidth + 27, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // ADDRESS OF PARENTS, TEL. NO. row with vertical line
      doc.text('ADDRESS OF PARENTS:', margin + 1, y + 4);
      doc.line(margin + 42, y + 4.5, margin + familyNameWidth - 2, y + 4.5);
      if (this.studentData.parents_address) doc.text(this.studentData.parents_address, margin + 44, y + 4);
      
      // Vertical line
      doc.line(margin + familyNameWidth, y, margin + familyNameWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.:', margin + familyNameWidth + 2, y + 4);
      doc.line(margin + familyNameWidth + 18, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.parents_tel_no) doc.text(this.studentData.parents_tel_no, margin + familyNameWidth + 20, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // GUARDIAN'S NAME, TEL. NO. row with vertical line
      doc.text("GUARDIAN'S NAME:", margin + 1, y + 4);
      doc.line(margtimes', 'bold');
      doc.text('SCHOOL INFORMATION', margin + 1, y + 4);
      doc.setFont('times', 'normal');
      doc.line(margin, y + sectionHeight, pageWidth - margin, y + sectionHeight);
      y += sectionHeight;

      // PROGRAM, YEAR LEVEL row with vertical line
      const schoolFieldWidth = 115;
      
      doc.text('PROGRAM:', margin + 1, y + 4);
      doc.line(margin + 20, y + 4.5, margin + schoolFieldWidth - 2, y + 4.5);
      if (this.studentData.program) {
        const prog = doc.splitTextToSize(this.studentData.program, 82);
        doc.text(prog[0], margin + 22, y + 4);
      }
      
      // Vertical line
      doc.line(margin + schoolFieldWidth, y, margin + schoolFieldWidth, y + fieldRowHeight);
      
      doc.text('YEAR LEVEL:', margin + schoolFieldWidth + 2, y + 4);
      doc.line(margin + schoolFieldWidth + 23, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.year_level) doc.text(this.studentData.year_level, margin + schoolFieldWidth + 25, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // MAJOR, LENGTH OF PROGRAM row with vertical line
      doc.text('MAJOR:', margin + 1, y + 4);
      doc.line(margin + 15, y + 4.5, margin + schoolFieldWidth - 2, y + 4.5);
      if (this.studentData.major) doc.text(this.studentData.major, margin + 17, y + 4);
      
      // Vertical line
      doc.line(margin + schoolFieldWidth, y, margin + schoolFieldWidth, y + fieldRowHeight);
      
      doc.text('LENGTH OF PROGRAM:', margin + schoolFieldWidth + 2, y + 4);
      doc.line(margin + schoolFieldWidth + 38, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.length_of_program) doc.text(this.studentData.length_of_program, margin + schoolFieldWidth + 40, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // DEPARTMENT, SCHOOL ADDRESS row with vertical line
      doc.text('DEPARTMENT:', margin + 1, y + 4);
      doc.line(margin + 27, y + 4.5, margin + schoolFieldWidth - 2, y + 4.5);
      if (this.studentData.department) doc.text(this.studentData.department, margin + 29, y + 4);
      
      // Vertical line
      doc.line(margin + schoolFieldWidth, y, margin + schoolFieldWidth, y + fieldRowHeight);
      
      doc.text('SCHOOL ADDRESS:', margin + schoolFieldWidth + 2, y + 4);
      doc.line(margin + schoolFieldWidth + 35, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.school_address) doc.text(this.studentData.school_address, margin + schoolFieldWidth + 37, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // OJT COORDINATOR, TEL. NO. row with vertical line
      doc.text('OJT COORDINATOR:', margin + 1, y + 4);
      doc.line(margin + 38, y + 4.5, margin + schoolFieldWidth - 2, y + 4.5);
      if (this.studentData.ojt_coordinator) doc.text(this.studentData.ojt_coordinator, margin + 40, y + 4);
      
      // Vertical line
      doc.line(margin + schoolFieldWidth, y, margin + schoolFieldWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.:', margin + schoolFieldWidth + 2, y + 4);
      doc.line(margin + schoolFieldWidth + 18, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.ojt_coordinator_tel) doc.text(this.studentData.ojt_coordinator_tel, margin + schoolFieldWidth + 20, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // OJT HEAD, TEL. NO. row with vertical line
      doc.text('OJT HEAD:', margin + 1, y + 4);
      doc.line(margin + 20, y + 4.5, margin + schoolFieldWidth - 2, y + 4.5);
      if (this.studentData.ojt_head) doc.text(this.studentData.ojt_head, margin + 22, y + 4);
      
      // Vertical line
      doc.line(margin + schoolFieldWidth, y, margin + schoolFieldWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.:', margin + schoolFieldWidth + 2, y + 4);
      doc.line(margtimes', 'bold');
      doc.text('In case of emergency, notify', margin + 1, y + 4);
      doc.setFont('times', 'normal');
      doc.line(margin, y + sectionHeight, pageWidth - margin, y + sectionHeight);
      y += sectionHeight;

      // NAME, RELATIONSHIP row with vertical line
      const emergencyNameWidth = 115;
      
      doc.text('NAME:', margin + 1, y + 4);
      doc.line(margin + 13, y + 4.5, margin + emergencyNameWidth - 2, y + 4.5);
      
      // Vertical line
      doc.line(margin + emergencyNameWidth, y, margin + emergencyNameWidth, y + fieldRowHeight);
      
      doc.text('RELATIONSHIP:', margin + emergencyNameWidth + 2, y + 4);
      doc.line(margin + emergencyNameWidth + 30, y + 4.5, pageWidth - margin - 2, y + 4.5);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // ADDRESS, TEL. NO. row with vertical line
      doc.text('ADDRESS:', margin + 1, y + 4);
      doc.line(margin + 19, y + 4.5, margin + emergencyNameWidth - 2, y + 4.5);
      if (this.studentData.emergency_contact_address) {
        const addr = doc.splitTextToSize(this.studentData.emergency_contact_address, 85);
        doc.text(addr[0], margin + 21, y + 4);
      }
      
      // Vertical line
      doc.line(margin + emergencyNameWidth, y, margin + emergencyNameWidth, y + fieldRowHeight);
      
      doc.text('TEL. NO.:', margin + emergencyNameWidth + 2, y + 4);
      doc.line(margin + emergencyNameWidth + 18, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studentData.emergency_contact_tel) doc.text(this.studentData.emergency_contact_tel, margin + emergencyNameWidth + 2
      doc.text('TEL. NO.:', margin + 110, y + 4);
      doc.line(margin + 128, y + 4.5, pageWidth - margin - 2, y + 4.5);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // In case of emergency, notify header
      doc.setFont('helvetica', 'bold');
      doc.text('In case of emergency, notify', margin + 1, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.line(margin, y + sectionHeight, pageWidth - margin, y + sectionHeight);
      y += sectionHeight;

      // NAME, RELATIONSHIP row
      doc.text('NAME:', margin + 1, y + 4);
      doc.line(margin + 13, y + 4.5, margin + 105, y + 4.5);
      
      doc.text('RELATIONSHIP:', margin + 110, y + 4);
      doc.line(margin + 142, y + 4.5, pageWidth - margin - 2, y + 4.5);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight;

      // ADDRESS, TEL. NO. row
      doc.text('ADDRESS:', margin + 1, y + 4);
      doc.line(margin + 19, y + 4.5, margin + 105, y + 4.5);
      if (this.studentData.emergency_contact_address) {
        const addr = doc.splitTextToSize(this.studentData.emergency_contact_address, 75);
        doc.text(addr[0], margin + 21, y + 4);
      }
      
      doc.text('TEL. NO.:', margin + 110, y + 4);
      doc.line(margin + 128, y + 4.5, pageWidth - margin - 2, y + 4.5);
      if (this.studtimesmergency_contact_tel) doc.text(this.studentData.emergency_contact_tel, margin + 130, y + 4);
      
      doc.line(margin, y + fieldRowHeight, pageWidth - margin, y + fieldRowHeight);
      y += fieldRowHeight + 2;

      // Privacy Notice
      doc.setFontSize(6);
      const privacyText = 'Pursuant to Republic Act No. 10173, also known as the Data Privacy Act of 2012, the Batangas State University, the National Engineering University, recognizes its commitment to protect and respect the privacy of its customers and/or stakeholders and ensure that all information collected from them are all processed in accordance with the principles of transparency, legitimate purpose and proportionality mandated under the Data Privacy Act of 2012.';
      const privacyLines = doc.splitTextToSize(privacyText, contentWidth - 4);
      doc.text(privacyLines, margin + 2, y + 2);
      y += privacyLines.length * 2.5 + 3;

      // Certification
      doc.setFontSize(7);
      doc.text('I hereby certify that the foregoing answers are true and correct to the best to my knowledge, belief and ability.', margin + 2, y + 2);
      y += 7;

      // Signed at and Date row
      doc.text('Signed at:', margin + 2, y + 3);
      doc.line(margin + 20, y + 3.5, margin + 90, y + 3.5);
      
      doc.text('Date:', pageWidth / 2 + 10, y + 3);
      doc.line(pageWidth / 2 + 20, y + 3.5, pageWidth - margin - 2, y + 3.5);
      y += 13;

      // Signature line
      doc.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.text("Applicant's Signature over Printed Name", pageWidth / 2, y, { align: 'center' });

      // Save the PDF
      const fileName = `Personal_History_Statement_${this.studentData.last_name}_${this.studentData.first_name}.pdf`;
      doc.save(fileName);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your Personal History Statement has been downloaded successfully.',
        timer: 2000
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate PDF. Please try again.'
      });
    }
  }

  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }
}
