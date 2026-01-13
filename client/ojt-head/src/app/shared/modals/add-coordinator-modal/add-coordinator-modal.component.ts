import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coordinator-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-coordinator-modal.component.html',
  styleUrl: './add-coordinator-modal.component.css',
})
export class AddCoordinatorModalComponent {
  @Input() isVisible = false;
  @Input() campuses: any[] = [];
  @Input() departments: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Output() campusChange = new EventEmitter<number>();

  coordinatorForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.coordinatorForm = this.fb.group({
      email_address: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact_number: [''],
      position_title: [''],
      campus_id: [null, Validators.required],
      department_id: [null, Validators.required],
    });
  }

  ngOnChanges() {
    if (!this.isVisible) {
      this.coordinatorForm.reset();
    }
  }

  onCampusChange(event: any) {
    const campusId = event?.target?.value;
    if (campusId) {
      this.campusChange.emit(parseInt(campusId));
      this.coordinatorForm.patchValue({ department_id: null });
    }
  }

  handleClose() {
    this.close.emit();
  }

  handleSubmit() {
    if (this.coordinatorForm.invalid) {
      this.coordinatorForm.markAllAsTouched();
      return;
    }

    this.submit.emit(this.coordinatorForm.value);
  }
}
