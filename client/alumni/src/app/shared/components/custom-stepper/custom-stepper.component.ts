import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  icon?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-custom-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-stepper.component.html',
  styleUrl: './custom-stepper.component.css'
})
export class CustomStepperComponent {
  @Input() steps: Step[] = [];
  @Input() activeStep: number = 0;
  @Input() linear: boolean = true; // Requires completing steps in order
  @Output() activeStepChange = new EventEmitter<number>();
  @Output() stepClick = new EventEmitter<number>();

  goToStep(index: number) {
    if (this.canNavigateToStep(index)) {
      this.activeStep = index;
      this.activeStepChange.emit(index);
      this.stepClick.emit(index);
    }
  }

  canNavigateToStep(index: number): boolean {
    if (!this.linear) return true;
    
    // Can navigate to current step or previous steps
    if (index <= this.activeStep) return true;
    
    // Can navigate to next step if current step is completed
    if (index === this.activeStep + 1 && this.steps[this.activeStep]?.completed) {
      return true;
    }
    
    return false;
  }

  next() {
    if (this.activeStep < this.steps.length - 1) {
      this.goToStep(this.activeStep + 1);
    }
  }

  previous() {
    if (this.activeStep > 0) {
      this.goToStep(this.activeStep - 1);
    }
  }

  isStepClickable(index: number): boolean {
    return this.canNavigateToStep(index);
  }

  getStepClass(index: number): string {
    if (index === this.activeStep) return 'active';
    if (this.steps[index]?.completed) return 'completed';
    if (index < this.activeStep) return 'completed';
    return '';
  }
}
