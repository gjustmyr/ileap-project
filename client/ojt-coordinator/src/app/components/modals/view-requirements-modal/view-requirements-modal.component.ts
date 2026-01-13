import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-requirements-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-requirements-modal.component.html',
  styleUrl: './view-requirements-modal.component.css',
  standalone: true,
})
export class ViewRequirementsModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() selectedStudent: any = null;
  @Input() preOjtRequirements: string[] = [];
  @Input() postOjtRequirements: string[] = [];
  @Input() requirementsList: any[] = [];

  @Output() onClose = new EventEmitter<void>();
  @Output() onValidateRequirement = new EventEmitter<{
    requirementId: number;
    requirementName: string;
  }>();
  @Output() onValidateAll = new EventEmitter<void>();
  @Output() onPreviewRequirement = new EventEmitter<{
    requirement: any;
    requirementName: string;
  }>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.onClose.emit();
  }

  validateRequirement(requirementId: number, requirementName: string): void {
    this.onValidateRequirement.emit({ requirementId, requirementName });
  }

  validateAllRequirements(): void {
    this.onValidateAll.emit();
  }

  openPreviewRequirement(requirement: any, requirementName: string): void {
    this.onPreviewRequirement.emit({ requirement, requirementName });
  }

  isRequirementSubmitted(requirementId: number): boolean {
    return this.requirementsList.some(
      (r: any) =>
        r.requirement_id === requirementId &&
        r.status === 'submitted' &&
        !r.returned
    );
  }

  isRequirementValidated(requirementId: number): boolean {
    const requirement = this.requirementsList.find(
      (r: any) => r.requirement_id === requirementId
    );
    return requirement?.validated || false;
  }

  getRequirementSubmission(requirementId: number): any {
    return this.requirementsList.find(
      (r: any) => r.requirement_id === requirementId
    );
  }
}
