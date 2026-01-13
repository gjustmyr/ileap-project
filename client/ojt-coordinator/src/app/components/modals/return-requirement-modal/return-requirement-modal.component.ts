import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-requirement-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './return-requirement-modal.component.html',
  styleUrl: './return-requirement-modal.component.css',
  standalone: true,
})
export class ReturnRequirementModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() selectedRequirement: any = null;
  @Input() returnRemarks: string = '';
  @Output() returnRemarksChange = new EventEmitter<string>();

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onClose.emit();
  }

  submitReturn(): void {
    this.onSubmit.emit();
  }

  updateRemarks(value: string): void {
    this.returnRemarks = value;
    this.returnRemarksChange.emit(value);
  }
}
