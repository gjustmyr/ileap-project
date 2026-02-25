import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  /**
   * Validate file size
   * @param file File to validate
   * @param maxSize Maximum size in bytes (default 5MB)
   * @returns true if valid, false otherwise
   */
  validateFileSize(file: File, maxSize: number = this.MAX_FILE_SIZE): boolean {
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB.`,
        confirmButtonColor: '#ef4444'
      });
      return false;
    }
    return true;
  }

  /**
   * Validate file type
   * @param file File to validate
   * @param allowedTypes Array of allowed MIME types or extensions
   * @returns true if valid, false otherwise
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValid = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      return file.type === type;
    });

    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: `Please select a valid file type: ${allowedTypes.join(', ')}`,
        confirmButtonColor: '#ef4444'
      });
    }
    return isValid;
  }

  /**
   * Get file preview URL for images and PDFs
   * @param file File to preview
   * @returns Promise with preview URL or null
   */
  async getFilePreview(file: File): Promise<string | null> {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    } else if (file.type === 'application/pdf') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    }
    return null;
  }

  /**
   * Format file size to human readable format
   * @param bytes File size in bytes
   * @returns Formatted string (e.g., "2.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
