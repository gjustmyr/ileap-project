import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-requirement-modal',
  imports: [CommonModule],
  templateUrl: './preview-requirement-modal.component.html',
  styleUrl: './preview-requirement-modal.component.css',
  standalone: true,
})
export class PreviewRequirementModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() selectedRequirement: any = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onValidate = new EventEmitter<{
    requirementId: number;
    requirementName: string;
  }>();
  @Output() onReturn = new EventEmitter<{
    requirement: any;
    requirementName: string;
  }>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onClose.emit();
  }

  validateRequirement(): void {
    if (this.selectedRequirement) {
      this.onValidate.emit({
        requirementId: this.selectedRequirement.requirement_id,
        requirementName: this.selectedRequirement.name,
      });
    }
  }

  returnRequirement(): void {
    if (this.selectedRequirement) {
      this.closeModal();
      this.onReturn.emit({
        requirement: this.selectedRequirement,
        requirementName: this.selectedRequirement.name,
      });
    }
  }
}
