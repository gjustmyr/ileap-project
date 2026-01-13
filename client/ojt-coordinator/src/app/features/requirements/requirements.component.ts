import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.css',
})
export class RequirementsComponent implements OnInit {
  environment = environment;

  // Template downloads
  requirementTemplates: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequirementTemplates();
  }

  loadRequirementTemplates(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/requirement-templates`, { headers })
      .subscribe({
        next: (response: any) => {
          this.requirementTemplates = response.data || [];
        },
        error: (error) => {
          console.error('Error loading templates:', error);
        },
      });
  }

  previewTemplate(template: any): void {
    const templateUrl = `${environment.apiUrl}${template.template_url}`;
    window.open(templateUrl, '_blank');
  }

  downloadTemplate(template: any): void {
    const templateUrl = `${environment.apiUrl}${template.template_url}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = template.title || 'template';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
