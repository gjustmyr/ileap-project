import { Component, OnInit } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  DashboardFilters,
} from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [UIChart, Card, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  industries: any[] = [];
  companies: any[] = [];
  locations: string[] = [];
  campuses: any[] = [];
  programs: any[] = [];
  semesters: string[] = [];
  schoolYears: string[] = [];

  selectedCompany: number | null = null;
  selectedIndustry: number | null = null;
  selectedLocation: string = '';
  selectedCampus: number | null = null;
  selectedProgram: number | null = null;
  selectedSemester: string = '';
  selectedSchoolYear: string = '';

  // Summary stats
  totalInterns: number = 0;
  totalCompanies: number = 0;
  evaluatedInterns: number = 0;
  pendingEvaluations: number = 0;

  isLoading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadFilterOptions();
    this.loadDashboardData();
  }

  loadFilterOptions() {
    this.dashboardService.getFilterOptions().subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.campuses = response.data.campuses || [];
          this.programs = response.data.programs || [];
          this.industries = response.data.industries || [];
          this.companies = response.data.companies || [];
          this.locations = response.data.locations || [];
          this.semesters = response.data.semesters || [];
          this.schoolYears = response.data.school_years || [];
        }
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
      },
    });
  }

  loadDashboardData() {
    this.isLoading = true;

    const filters: DashboardFilters = {};
    if (this.selectedCampus) filters.campus_id = this.selectedCampus;
    if (this.selectedProgram) filters.program_id = this.selectedProgram;
    if (this.selectedIndustry) filters.industry_id = this.selectedIndustry;
    if (this.selectedCompany) filters.company_id = this.selectedCompany;
    if (this.selectedLocation) filters.location = this.selectedLocation;
    if (this.selectedSemester) filters.semester = this.selectedSemester;
    if (this.selectedSchoolYear) filters.school_year = this.selectedSchoolYear;

    this.dashboardService.getStatistics(filters).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          const data = response.data;

          // Update summary
          this.totalInterns = data.summary.total_interns;
          this.totalCompanies = data.summary.total_companies;
          this.evaluatedInterns = data.summary.evaluated_interns;
          this.pendingEvaluations = data.summary.pending_evaluations;

          // Update charts
          this.updateCampusChart(data.campus_distribution);
          this.updateProgramChart(data.program_distribution);
          this.updateCompletionChart(data.completion_by_program);
          this.updateIndustryChart(data.industry_distribution);
          this.updateTopCompaniesChart(data.top_companies);
          this.updateProgramMismatchChart(data.program_opportunity_mismatch);
          this.updateMonthlyChart(data.monthly_engagement);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }

  onFilterChange() {
    this.loadDashboardData();
  }

  resetFilters() {
    this.selectedSemester = '';
    this.selectedSchoolYear = '';
    this.selectedIndustry = null;
    this.selectedCompany = null;
    this.selectedLocation = '';
    this.selectedCampus = null;
    this.selectedProgram = null;
    this.loadDashboardData();
  }

  updateCampusChart(data: any[]) {
    this.campusChartData = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: 'Interns',
          backgroundColor: '#60A5FA',
          data: data.map((d) => d.count),
        },
      ],
    };
  }

  updateProgramChart(data: any[]) {
    this.programChartData = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: 'Interns',
          backgroundColor: '#34D399',
          data: data.map((d) => d.count),
        },
      ],
    };
  }

  updateCompletionChart(data: any[]) {
    this.ojtCompletionStackedChartData = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: 'Completed',
          data: data.map((d) => d.completion_rate),
          backgroundColor: '#10b981',
        },
        {
          label: 'Ongoing',
          data: data.map((d) => 100 - d.completion_rate),
          backgroundColor: '#f97316',
        },
      ],
    };
  }

  updateIndustryChart(data: any[]) {
    const colors = [
      '#4f46e5',
      '#22c55e',
      '#f59e0b',
      '#ec4899',
      '#8b5cf6',
      '#06b6d4',
    ];
    this.ojtListingsByIndustryChartData = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: 'Internship Listings',
          data: data.map((d) => d.count),
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    };
  }

  updateTopCompaniesChart(data: any[]) {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
    this.ojtTopCompaniesChartData = {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: 'Number of Interns',
          data: data.map((d) => d.count),
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    };
  }

  updateProgramMismatchChart(data: any[]) {
    this.ojtProgramOpportunityMismatch = {
      labels: data.map((d) => d.program),
      datasets: [
        {
          label: 'Enrolled Students',
          backgroundColor: '#3B82F6',
          data: data.map((d) => d.students),
        },
        {
          label: 'Internship Opportunities',
          backgroundColor: '#34D399',
          data: data.map((d) => d.opportunities),
        },
      ],
    };
  }

  updateMonthlyChart(data: any[]) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyData = new Array(12).fill(0);

    data.forEach((d) => {
      if (d.month >= 1 && d.month <= 12) {
        monthlyData[d.month - 1] = d.count;
      }
    });

    this.ojtMonthlyChartData = {
      labels: months,
      datasets: [
        {
          label: 'Internship Activities',
          data: monthlyData,
          fill: false,
          borderColor: '#3b82f6',
          tension: 0.4,
        },
      ],
    };
  }

  campusChartData = {
    labels: ['Main I', 'Main II', 'Lipa', 'Nasugbu'],
    datasets: [
      {
        label: 'Interns',
        backgroundColor: '#60A5FA',
        data: [35, 28, 40, 25],
      },
    ],
  };

  ojtCompletionStackedChartData = {
    labels: ['BSIT', 'BSBA', 'BSCE', 'BSA', 'BEED'],
    datasets: [
      {
        label: 'Completed',
        data: [80, 65, 75, 60, 90],
        backgroundColor: '#10b981',
      },
      {
        label: 'Pending',
        data: [20, 35, 25, 40, 10],
        backgroundColor: '#f97316',
      },
    ],
  };

  ojtCompletionStackedChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: {
          callback: (val: number) => `${val}%`,
          color: '#6b7280',
        },
      },
    },
  };

  ojtProgramOpportunityMismatchOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  ojtProgramOpportunityMismatch = {
    labels: ['BSIT', 'BSBA', 'BEED', 'BSECE', 'BSME'],
    datasets: [
      {
        label: 'Enrolled Students',
        backgroundColor: '#3B82F6',
        data: [120, 80, 45, 60, 100],
      },
      {
        label: 'Internship Opportunities',
        backgroundColor: '#34D399',
        data: [60, 50, 40, 20, 30],
      },
    ],
  };

  ojtTopCompaniesChartData = {
    labels: ['Company A', 'Company B', 'Company C', 'Company D', 'Company E'],
    datasets: [
      {
        label: 'Number of Interns',
        data: [45, 38, 30, 22, 18],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#6366F1',
        ],
      },
    ],
  };

  ojtMonthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Internship Activities',
        data: [15, 25, 18, 30, 22, 28],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  evaluationStatusChartData = {
    labels: ['Evaluated', 'Pending'],
    datasets: [
      {
        data: [73, 27],
        backgroundColor: ['#22c55e', '#f97316'],
      },
    ],
  };

  ojtListingsByIndustryChartData = {
    labels: ['IT', 'Engineering', 'Education', 'Healthcare'],
    datasets: [
      {
        label: 'Internship Listings',
        data: [40, 30, 20, 10],
        backgroundColor: ['#4f46e5', '#22c55e', '#f59e0b', '#ec4899'],
      },
    ],
  };

  programChartData = {
    labels: ['BSIT', 'BSCE', 'BSBA', 'BSA'],
    datasets: [
      {
        label: 'Interns',
        backgroundColor: '#34D399',
        data: [50, 25, 30, 23],
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' },
        grid: { color: '#E5E7EB' },
      },
      y: {
        ticks: { color: '#6B7280' },
        grid: { color: '#E5E7EB' },
      },
    },
  };
}
