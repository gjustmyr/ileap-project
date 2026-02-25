import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PersonalHistoryStatementComponent } from './templates/personal-history-statement.component';
import { AcceptanceFormComponent } from './templates/acceptance-form.component';
import { InternshipAgreementComponent } from './templates/internship-agreement.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    PersonalHistoryStatementComponent,
    AcceptanceFormComponent,
    InternshipAgreementComponent
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit, OnDestroy {
  studentData: any = null;
  isLoading = false;
  selectedDocument: string | null = null;
  isGenerating = false;

  constructor(private http: HttpClient) {
    console.log('DocumentsComponent initialized');
  }

  ngOnInit(): void {
    this.loadStudentData();
  }

  ngOnDestroy(): void {
    // Reset state when component is destroyed (tab changed)
    this.resetComponent();
  }

  resetComponent(): void {
    this.selectedDocument = null;
    this.isGenerating = false;
  }

  reloadData(): void {
    this.resetComponent();
    this.loadStudentData();
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Student data has been refreshed',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  loadStudentData() {
    this.isLoading = true;
    console.log('Loading student data from:', `${environment.apiUrl}/student-trainee/personal-history-statement-data`);
    
    this.http.get(`${environment.apiUrl}/student-trainee/personal-history-statement-data`).subscribe({
      next: (response: any) => {
        console.log('Student data response:', response);
        if (response.status === 'success') {
          this.studentData = response.data;
          console.log('Student data loaded:', this.studentData);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading student data:', error);
        this.isLoading = false;
        this.studentData = {};
      }
    });
  }

  generatePersonalHistoryStatement() {
    if (!this.studentData) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'Please complete your profile first'
      });
      return;
    }
    this.selectedDocument = 'phs';
  }

  generateAcceptanceForm() {
    if (!this.studentData) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'Please complete your profile first'
      });
      return;
    }
    this.selectedDocument = 'acceptance';
  }

  generateInternshipAgreement() {
    if (!this.studentData) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'Please complete your profile first'
      });
      return;
    }
    this.selectedDocument = 'agreement';
  }

  closePreview() {
    this.selectedDocument = null;
  }

  async downloadPDF() {
    const element = document.getElementById('document-content');
    if (!element) return;

    this.isGenerating = true;

    try {
      // Get the actual document wrapper element
      const docWrapper = element.querySelector('.document-wrapper') as HTMLElement;
      if (!docWrapper) {
        throw new Error('Document wrapper not found');
      }

      // Show loading message
      Swal.fire({
        title: 'Generating Document',
        text: 'Please wait while we generate your PDF...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Capture at higher scale for better quality
      const canvas = await html2canvas(docWrapper, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: docWrapper.scrollWidth,
        height: docWrapper.scrollHeight
      });

      // Determine page size based on document type
      let pageWidth = 215.9; // 8.5 inches in mm
      let pageHeight = 330.2; // 13 inches in mm (Long Bond)
      
      if (this.selectedDocument === 'agreement') {
        pageHeight = 304.8; // 12 inches in mm
      }

      const pdf = new jsPDF('p', 'mm', [pageWidth, pageHeight]);
      
      // Calculate dimensions to fit the page
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // If content fits on one page
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Content spans multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const fileName = this.getDocumentFileName();
      pdf.save(fileName);

      Swal.fire({
        icon: 'success',
        title: 'Downloaded!',
        text: 'Document has been downloaded successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate PDF'
      });
    } finally {
      this.isGenerating = false;
    }
  }

  getDocumentFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    const name = this.studentData?.last_name || 'document';
    
    switch (this.selectedDocument) {
      case 'phs':
        return `Personal_History_Statement_${name}_${date}.pdf`;
      case 'acceptance':
        return `Acceptance_Form_${name}_${date}.pdf`;
      case 'agreement':
        return `Internship_Agreement_${name}_${date}.pdf`;
      default:
        return `Document_${date}.pdf`;
    }
  }

  getDocumentTitle(): string {
    switch (this.selectedDocument) {
      case 'phs':
        return 'Personal History Statement';
      case 'acceptance':
        return 'Acceptance Form';
      case 'agreement':
        return 'Internship Agreement';
      default:
        return 'Document';
    }
  }
}
