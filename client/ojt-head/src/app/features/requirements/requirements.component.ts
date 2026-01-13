import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
})
export class RequirementsComponent implements OnInit {
  environment = environment;
  requirements: any[] = [];
  filteredRequirements: any[] = [];
  filterType: string = 'all'; // 'all', 'pre', 'post'
  searchKeyword: string = '';
  isLoading: boolean = false;

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedRequirement: any = null;

  // Accessible roles options
  availableRoles = [
    { value: 'student', label: 'Student' },
    { value: 'coordinator', label: 'OJT Coordinator' },
    { value: 'employer', label: 'Employer' },
  ];
  selectedRoles: string[] = [];

  // Form data
  formData: any = {
    requirement_id: null,
    title: '',
    description: '',
    type: 'pre',
    is_required: true,
    order_index: 1,
    accessible_to: 'student,coordinator',
  };
  templateFile: File | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements(): void {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    this.http
      .get(`${environment.apiUrl}/requirement-templates`, { headers })
      .subscribe({
        next: (response: any) => {
          this.requirements = response.data || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading requirements:', error);
          this.isLoading = false;
          Swal.fire('Error', 'Failed to load requirements', 'error');
        },
      });
  }

  applyFilters(): void {
    this.filteredRequirements = this.requirements.filter((req) => {
      const matchesType =
        this.filterType === 'all' || req.type === this.filterType;
      const matchesSearch =
        !this.searchKeyword ||
        req.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        req.description
          ?.toLowerCase()
          .includes(this.searchKeyword.toLowerCase());
      return matchesType && matchesSearch;
    });
  }

  openAddModal(): void {
    this.formData = {
      requirement_id: this.getNextRequirementId(),
      title: '',
      description: '',
      type: 'pre',
      is_required: true,
      order_index: this.requirements.length + 1,
      accessible_to: 'student,coordinator',
    };
    this.selectedRoles = ['student', 'coordinator'];
    this.templateFile = null;
    this.showAddModal = true;
  }

  openEditModal(requirement: any): void {
    this.selectedRequirement = requirement;
    this.formData = { ...requirement };
    this.selectedRoles = requirement.accessible_to
      ? requirement.accessible_to.split(',')
      : [];
    this.templateFile = null;
    this.showEditModal = true;
  }

  onFileSelected(event: any): void {
    this.templateFile = event.target.files[0];
  }

  getNextRequirementId(): number {
    if (this.requirements.length === 0) return 1;
    const maxId = Math.max(...this.requirements.map((r) => r.requirement_id));
    return maxId + 1;
  }

  toggleRole(role: string): void {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
    this.formData.accessible_to = this.selectedRoles.join(',');
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  saveRequirement(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ Authorization: token || '' });

    // Update accessible_to from selected roles
    this.formData.accessible_to = this.selectedRoles.join(',');

    const formData = new FormData();
    Object.keys(this.formData).forEach((key) => {
      if (this.formData[key] !== null) {
        formData.append(key, this.formData[key]);
      }
    });

    if (this.templateFile) {
      formData.append('template_file', this.templateFile);
    }

    const url = this.showEditModal
      ? `${environment.apiUrl}/requirement-templates/${this.selectedRequirement.template_id}`
      : `${environment.apiUrl}/requirement-templates`;

    const request = this.showEditModal
      ? this.http.put(url, formData, { headers })
      : this.http.post(url, formData, { headers });

    request.subscribe({
      next: () => {
        Swal.fire(
          'Success',
          `Requirement ${
            this.showEditModal ? 'updated' : 'created'
          } successfully`,
          'success'
        );
        this.loadRequirements();
        this.closeModals();
      },
      error: (error) => {
        console.error('Error saving requirement:', error);
        Swal.fire(
          'Error',
          error.error?.detail || 'Failed to save requirement',
          'error'
        );
      },
    });
  }

  deleteRequirement(template_id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the requirement template',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders({ Authorization: token || '' });

        this.http
          .delete(
            `${environment.apiUrl}/requirement-templates/${template_id}`,
            { headers }
          )
          .subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'Requirement deleted successfully',
                'success'
              );
              this.loadRequirements();
            },
            error: (error) => {
              console.error('Error deleting requirement:', error);
              Swal.fire('Error', 'Failed to delete requirement', 'error');
            },
          });
      }
    });
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.templateFile = null;
    this.selectedRoles = [];
    this.formData = {
      requirement_id: this.getNextRequirementId(),
      title: '',
      description: '',
      type: 'pre',
      is_required: true,
      order_index: this.requirements.length + 1,
      accessible_to: 'student,coordinator',
    };
  }
}
