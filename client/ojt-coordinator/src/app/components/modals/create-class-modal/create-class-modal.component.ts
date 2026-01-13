import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-class-modal',
  imports: [],
  templateUrl: './create-class-modal.component.html',
  styleUrl: './create-class-modal.component.css',
})
export class CreateClassModalComponent {
  @Input() showCreateClassModal: boolean = false;
  @Output() showCreateClassModalChange = new EventEmitter<boolean>();
}
