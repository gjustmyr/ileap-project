import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-preview-modal.component.html',
  styleUrls: ['./file-preview-modal.component.css']
})
export class FilePreviewModalComponent {
  @Input() show: boolean = false;
  @Input() fileUrl: string = '';
  @Input() fileName: string = 'File Preview';
  @Input() fileType: string = 'pdf'; // 'pdf', 'image', 'doc'
  @Output() closeModal = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  close(): void {
    this.closeModal.emit();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isPdf(): boolean {
    return this.fileType === 'pdf' || this.fileUrl.toLowerCase().endsWith('.pdf');
  }

  isImage(): boolean {
    return this.fileType === 'image' || 
           this.fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) !== null;
  }

  isDoc(): boolean {
    return this.fileUrl.toLowerCase().match(/\.(doc|docx)$/i) !== null;
  }

  getGoogleDocsViewerUrl(): SafeResourceUrl {
    const encodedUrl = encodeURIComponent(this.fileUrl);
    return this.getSafeUrl(`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`);
  }
}
