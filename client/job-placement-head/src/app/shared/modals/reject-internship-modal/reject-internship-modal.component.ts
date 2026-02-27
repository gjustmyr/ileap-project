import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reject-internship-modal',
  imports: [CommonModule, FormsModule, DialogModule],
  templateUrl: './reject-internship-modal.component.html',
  styleUrl: './reject-internship-modal.component.css'
})
export class RejectInternshipModalComponent {
  @Input() isVisible = false;
  @Input() internship: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();

  rejectRemarks = '';

  handleClose() {
    this.close.emit();
    this.rejectRemarks = '';
  }

  handleConfirm() {
    this.confirm.emit(this.rejectRemarks);
  }
}
