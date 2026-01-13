import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  selectedSection: string | null = null;
  selectedProgram: string | null = null;
  selectedSemester: string | null = null;

  sectionOptions: any[] = [];
  programOptions: any[] = [];
  semesterOptions = [
    { label: 'First Semester', value: 'FIRST' },
    { label: 'Second Semester', value: 'SECOND' },
    { label: 'Summer', value: 'SUMMER' },
  ];

  metrics = [
    {
      label: 'Total Students',
      value: '0',
      icon: 'pi pi-users',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active OJT',
      value: '0',
      icon: 'pi pi-briefcase',
      iconColor: 'text-green-600',
    },
    {
      label: 'Completed',
      value: '0',
      icon: 'pi pi-check-circle',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Pending',
      value: '0',
      icon: 'pi pi-clock',
      iconColor: 'text-orange-600',
    },
  ];

  ojtStatusData: any;
  ojtProgressData: any;
  chartOptions: any;
  barChartOptions: any;

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    this.ojtStatusData = {
      labels: ['Ongoing', 'Completed', 'Not Started'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        },
      ],
    };

    this.ojtProgressData = {
      labels: ['Group A', 'Group B', 'Group C'],
      datasets: [
        {
          label: 'Completed Hours',
          data: [0, 0, 0],
          backgroundColor: '#10b981',
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }

  applyDashboardFilters() {
    console.log('Dashboard filters applied:', {
      section: this.selectedSection,
      program: this.selectedProgram,
      semester: this.selectedSemester,
    });
    Swal.fire({
      icon: 'success',
      title: 'Filters Applied',
      text: 'Dashboard data has been filtered',
      confirmButtonColor: '#10b981',
      timer: 1500,
    });
  }

  resetDashboardFilters() {
    this.selectedSection = null;
    this.selectedProgram = null;
    this.selectedSemester = null;
    Swal.fire({
      icon: 'info',
      title: 'Filters Reset',
      text: 'All filters have been cleared',
      confirmButtonColor: '#10b981',
      timer: 1500,
    });
  }
}
