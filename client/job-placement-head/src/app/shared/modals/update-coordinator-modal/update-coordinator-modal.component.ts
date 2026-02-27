import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-update-coordinator-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-coordinator-modal.component.html',
  styleUrl: './update-coordinator-modal.component.css',
})
export class UpdateCoordinatorModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() campuses: any[] = [];
  @Input() departments: any[] = [];
  @Input() coordinatorData: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Output() campusChange = new EventEmitter<number>();

  coordinatorUpdateForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.coordinatorUpdateForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email_address: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      contact_number: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
      ],
      position_title: ['', Validators.required],
      campus_id: ['', Validators.required],
      department_id: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['coordinatorData'] && this.coordinatorData) {
      this.coordinatorUpdateForm.patchValue(this.coordinatorData);
    }
  }

  onCampusChange(event: any) {
    const campusId = event?.target?.value;
    if (campusId) {
      this.campusChange.emit(parseInt(campusId));
      this.coordinatorUpdateForm.patchValue({ department_id: null });
    }
  }

  handleClose() {
    this.close.emit();
  }

  handleSubmit() {
    if (this.coordinatorUpdateForm.valid) {
      this.submit.emit(this.coordinatorUpdateForm.value);
    }
  }
}
