import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        Job Placement Dashboard
      </h2>
      <p class="text-gray-600">
        Welcome to the Job Placement Portal dashboard. Statistics and overview
        will be displayed here.
      </p>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {}
