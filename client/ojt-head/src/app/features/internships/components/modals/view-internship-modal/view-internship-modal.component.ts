import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-view-internship-modal',
  imports: [CommonModule, DialogModule],
  templateUrl: './view-internship-modal.component.html',
  styleUrl: './view-internship-modal.component.css',
})
export class ViewInternshipModalComponent {
  @Input() isVisible = false;
  @Input() internship: any = null;
  @Input() isApproving = false;
  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<any>();
  @Output() reject = new EventEmitter<any>();

  handleClose() {
    this.close.emit();
  }

  handleApprove() {
    this.approve.emit(this.internship);
  }

  handleReject() {
    this.reject.emit(this.internship);
  }

  canApproveOrReject(): boolean {
    return this.internship?.status === 'pending';
  }
}
