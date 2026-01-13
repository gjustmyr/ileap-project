import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-downloads',
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.css'
})
export class DownloadsComponent {
  requirementsList: any[] = [
    {
      preOjt: [
        { name: 'Resume', url: '#' },
        { name: 'Application Letter', url: '#' }
      ],
      postOjt: [
        { name: 'Accomplishment Report', url: '#' },
        { name: 'Certificate of Completion', url: '#' }
      ]
    }
  ];
}

