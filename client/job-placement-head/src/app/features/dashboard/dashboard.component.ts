import { Component, OnInit } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UIChart, Card, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  industries: any[] = [];

  selectedIndustry: number | null = null;

  // Summary stats
  totalAlumni: number = 0;
  totalEmployers: number = 0;
  totalJobPostings: number = 0;
  activeJobPostings: number = 0;
  pendingJobPostings: number = 0;
  totalApplications: number = 0;

  isLoading: boolean = false;

  // Chart data
  employersByIndustryData: any = {};
  jobPostingsByStatusData: any = {};
  jobPostingsByIndustryData: any = {};
  monthlyJobPostingsData: any = {};
  topEmployersData: any = {};

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    const filters: any = {};
    if (this.selectedIndustry) filters.industry_id = this.selectedIndustry;

    this.dashboardService.getStatistics(filters).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          const data = response.data;

          // Update summary
          this.totalAlumni = data.summary?.total_alumni || 0;
          this.totalEmployers = data.summary?.total_employers || 0;
          this.totalJobPostings = data.summary?.total_job_postings || 0;
          this.activeJobPostings = data.summary?.active_job_postings || 0;
          this.pendingJobPostings = data.summary?.pending_job_postings || 0;
          this.totalApplications = data.summary?.total_applications || 0;

          // Update charts
          this.updateEmployersByIndustryChart(data.employers_by_industry || []);
          this.updateJobPostingsByStatusChart(
            data.job_postings_by_status || [],
          );
          this.updateJobPostingsByIndustryChart(
            data.job_postings_by_industry || [],
          );
          this.updateMonthlyJobPostingsChart(data.monthly_job_postings || []);
          this.updateTopEmployersChart(data.top_employers || []);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }

  onFilterChange() {
    this.loadDashboardData();
  }

  resetFilters() {
    this.selectedIndustry = null;
    this.loadDashboardData();
  }

  updateEmployersByIndustryChart(data: any[]) {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#6366F1',
      '#8B5CF6',
    ];
    this.employersByIndustryData = {
      labels: data.map((d) => d.industry_name || 'Unknown'),
      datasets: [
        {
          label: 'Employers',
          backgroundColor: colors.slice(0, data.length),
          data: data.map((d) => d.count),
        },
      ],
    };
  }

  updateJobPostingsByStatusChart(data: any[]) {
    const statusColors: any = {
      open: '#10B981',
      pending: '#F59E0B',
      closed: '#EF4444',
      draft: '#6B7280',
    };

    this.jobPostingsByStatusData = {
      labels: data.map(
        (d) => d.status.charAt(0).toUpperCase() + d.status.slice(1),
      ),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: data.map((d) => statusColors[d.status] || '#6B7280'),
        },
      ],
    };
  }

  updateJobPostingsByIndustryChart(data: any[]) {
    const colors = [
      '#4f46e5',
      '#22c55e',
      '#f59e0b',
      '#ec4899',
      '#8b5cf6',
      '#06b6d4',
    ];
    this.jobPostingsByIndustryData = {
      labels: data.map((d) => d.industry_name || 'Unknown'),
      datasets: [
        {
          label: 'Job Postings',
          data: data.map((d) => d.count),
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    };
  }

  updateMonthlyJobPostingsChart(data: any[]) {
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

    data.forEach((d: any) => {
      if (d.month >= 1 && d.month <= 12) {
        monthlyData[d.month - 1] = d.count;
      }
    });

    this.monthlyJobPostingsData = {
      labels: months,
      datasets: [
        {
          label: 'Job Postings',
          data: monthlyData,
          fill: false,
          borderColor: '#3b82f6',
          tension: 0.4,
        },
      ],
    };
  }

  updateTopEmployersChart(data: any[]) {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
    this.topEmployersData = {
      labels: data.map((d) => d.company_name),
      datasets: [
        {
          label: 'Job Postings',
          data: data.map((d) => d.count),
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    };
  }
}
