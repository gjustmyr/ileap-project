import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OjtMonitoringService } from './ojt-monitoring.service';

@Component({
  selector: 'app-ojt-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ojt-monitoring.component.html',
  styleUrl: './ojt-monitoring.component.css',
})
export class OjtMonitoringComponent implements OnInit {
  ongoingOjts: any[] = [];
  filteredOjts: any[] = [];
  supervisors: any[] = [];
  isLoading: boolean = false;
  searchKeyword: string = '';
  statusFilter: string = 'all';

  // Modal state
  showAssignModal: boolean = false;
  selectedOjt: any = null;
  selectedSupervisorId: string = '';

  constructor(private ojtService: OjtMonitoringService) {}

  ngOnInit(): void {
    this.loadOngoingOjts();
    this.loadSupervisors();
  }

  loadSupervisors(): void {
    this.ojtService.getSupervisors().subscribe({
      next: (response) => {
        console.log('📋 Supervisors loaded:', response);
        this.supervisors = response.data || [];
        if (this.supervisors.length === 0) {
          console.warn(
            '⚠️ No supervisors found. Please add supervisors first.'
          );
        }
      },
      error: (error) => {
        console.error('❌ Error loading supervisors:', error);
      },
    });
  }

  openAssignSupervisorModal(ojt: any): void {
    this.selectedOjt = ojt;
    this.selectedSupervisorId = ojt.assigned_supervisor_id || '';
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedOjt = null;
    this.selectedSupervisorId = '';
  }

  assignSupervisor(): void {
    if (!this.selectedSupervisorId || !this.selectedOjt) return;

    console.log('🔄 Assigning supervisor:', {
      student_id: this.selectedOjt.student_id,
      supervisor_id: this.selectedSupervisorId,
      application_id: this.selectedOjt.application_id,
    });

    this.ojtService
      .assignSupervisor(
        this.selectedOjt.student_id,
        parseInt(this.selectedSupervisorId),
        this.selectedOjt.application_id
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Supervisor assigned:', response);
          const supervisor = this.supervisors.find(
            (s) => s.supervisor_id == this.selectedSupervisorId
          );
          if (supervisor) {
            // Update the selected OJT object
            this.selectedOjt.supervisor_name = supervisor.full_name;
            this.selectedOjt.assigned_supervisor_id = this.selectedSupervisorId;

            // Also update in the main arrays to ensure UI refresh
            const updateOjt = (ojt: any) => {
              if (
                ojt.student_id === this.selectedOjt.student_id &&
                ojt.application_id === this.selectedOjt.application_id
              ) {
                ojt.supervisor_name = supervisor.full_name;
                ojt.assigned_supervisor_id = this.selectedSupervisorId;
              }
            };

            this.ongoingOjts.forEach(updateOjt);
            this.filteredOjts.forEach(updateOjt);
          }
          alert('Supervisor assigned successfully!');
          this.closeAssignModal();
        },
        error: (error) => {
          console.error('❌ Error assigning supervisor:', error);
          alert(
            error.error?.detail ||
              'Failed to assign supervisor. Please try again.'
          );
        },
      });
  }

  loadOngoingOjts(): void {
    this.isLoading = true;
    this.ojtService.getOngoingOjts().subscribe({
      next: (response) => {
        this.ongoingOjts = response.ongoing_ojts || [];
        this.filteredOjts = [...this.ongoingOjts];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ongoing OJTs:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredOjts = this.ongoingOjts.filter((ojt) => {
      const matchesSearch =
        !this.searchKeyword ||
        ojt.student_name
          .toLowerCase()
          .includes(this.searchKeyword.toLowerCase()) ||
        ojt.sr_code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        ojt.position.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'all' || ojt.ojt_status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Pending Requirements':
        return 'bg-yellow-100 text-yellow-700';
      case 'Accepted - No Start Date Set':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getProgressPercentage(ojt: any): number {
    if (!ojt.hours_required || ojt.hours_required === 0) return 0;
    return Math.round((ojt.hours_completed / ojt.hours_required) * 100);
  }

  getOngoingCount(): number {
    return this.filteredOjts.filter((ojt) => ojt.ojt_status === 'Ongoing')
      .length;
  }

  getScheduledCount(): number {
    return this.filteredOjts.filter((ojt) => ojt.ojt_status === 'Scheduled')
      .length;
  }

  getPendingRequirementsCount(): number {
    return this.filteredOjts.filter(
      (ojt) => ojt.ojt_status === 'Pending Requirements'
    ).length;
  }
}
