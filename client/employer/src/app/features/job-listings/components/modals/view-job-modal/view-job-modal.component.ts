import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-job-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-job-modal.component.html',
  styleUrl: './view-job-modal.component.css'
})
export class ViewJobModalComponent {
  @Input() visible: boolean = false;
  @Input() internship: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onStatusChange = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }

  changeStatus(newStatus: string) {
    this.onStatusChange.emit(newStatus);
  }

  editInternship() {
    this.onEdit.emit(this.internship);
    this.close();
  }
}
