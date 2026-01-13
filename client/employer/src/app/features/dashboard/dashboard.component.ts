import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UIChart } from 'primeng/chart';
import { Card } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, UIChart, Card, DropdownModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @Output() tabChange = new EventEmitter<number>();

  // Filters
  selectedYear: number = new Date().getFullYear();
  selectedStatus: string = 'all';
  
  yearOptions: any[] = [];
  statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Completed', value: 'Completed' }
  ];

  stats = {
    totalJobListings: 0,
    totalApplications: 0,
    pendingApplications: 0,
    activeTrainees: 0,
    totalSupervisors: 0,
    ongoingTrainees: 0,
    scheduledTrainees: 0,
    completedTrainees: 0
  };

  recentApplications: any[] = [];

  // Chart data
  ojtStatusChartData: any;
  applicationsByPositionChartData: any;
  applicationStatusChartData: any;
  monthlyProgressChartData: any;

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeCharts();
    this.loadDashboardStats();
    this.loadRecentApplications();
  }

  initializeFilters(): void {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    
    // Generate year options (current year and 2 years back)
    for (let i = 0; i < 3; i++) {
      const year = currentYear - i;
      this.yearOptions.push({ label: year.toString(), value: year });
    }
  }

  onFilterChange(): void {
    this.loadDashboardStats();
    this.loadRecentApplications();
  }

  loadDashboardStats(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Authorization': token || '' });

    // Load job listings count
    this.http.get(`${environment.apiUrl}/internships`, { headers })
      .subscribe({
        next: (response: any) => {
          this.stats.totalJobListings = response.data?.length || 0;
          this.updateApplicationsByPositionChart(response.data || []);
        },
        error: (error) => console.error('Error loading job listings:', error)
      });

    // Load applications count
    this.http.get(`${environment.apiUrl}/internships/applications`, { headers })
      .subscribe({
        next: (response: any) => {
          const applications = response.data || [];
          this.stats.totalApplications = applications.length;
          this.stats.pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
          this.updateApplicationStatusChart(applications);
        },
        error: (error) => console.error('Error loading applications:', error)
      });

    // Load supervisors count
    this.http.get(`${environment.apiUrl}/employers/supervisors`, { headers })
      .subscribe({
        next: (response: any) => {
          this.stats.totalSupervisors = response.data?.length || 0;
        },
        error: (error) => console.error('Error loading supervisors:', error)
      });

    // Load OJT monitoring data
    this.http.get(`${environment.apiUrl}/internships/employer/ongoing-ojts`, { headers })
      .subscribe({
        next: (response: any) => {
          let ojts = response.ongoing_ojts || [];
          
          // Apply status filter
          if (this.selectedStatus !== 'all') {
            ojts = ojts.filter((ojt: any) => ojt.ojt_status === this.selectedStatus);
          }
          
          this.stats.activeTrainees = ojts.length;
          this.stats.ongoingTrainees = ojts.filter((ojt: any) => ojt.ojt_status === 'Ongoing').length;
          this.stats.scheduledTrainees = ojts.filter((ojt: any) => ojt.ojt_status === 'Scheduled').length;
          this.stats.completedTrainees = ojts.filter((ojt: any) => ojt.ojt_status === 'Completed').length;
          this.updateOjtStatusChart();
          this.updateMonthlyProgressChart(response.ongoing_ojts || []);
        },
        error: (error) => console.error('Error loading OJT data:', error)
      });
  }

  loadRecentApplications(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Authorization': token || '' });

    this.http.get(`${environment.apiUrl}/internships/applications`, { headers })
      .subscribe({
        next: (response: any) => {
          const applications = response.data || [];
          // Map API fields to match template
          this.recentApplications = applications
            .map((app: any) => ({
              ...app,
              position: app.internship_title,
              applied_date: app.applied_at
            }))
            .sort((a: any, b: any) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime())
            .slice(0, 10);
        },
        error: (error) => console.error('Error loading recent applications:', error)
      });
  }

  initializeCharts(): void {
    // Initialize with default data
    this.ojtStatusChartData = {
      labels: ['Ongoing', 'Scheduled', 'Completed'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#3B82F6', '#EAB308', '#10B981'],
        label: 'OJT Status'
      }]
    };

    this.applicationsByPositionChartData = {
      labels: ['Loading...'],
      datasets: [{
        label: 'Applications',
        data: [0],
        backgroundColor: '#8B5CF6'
      }]
    };

    this.applicationStatusChartData = {
      labels: ['Pending', 'Accepted', 'Rejected'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#EAB308', '#10B981', '#EF4444'],
        label: 'Status'
      }]
    };

    this.monthlyProgressChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Active Trainees',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  updateOjtStatusChart(): void {
    this.ojtStatusChartData = {
      labels: ['Ongoing', 'Scheduled', 'Completed'],
      datasets: [{
        data: [
          this.stats.ongoingTrainees,
          this.stats.scheduledTrainees,
          this.stats.completedTrainees
        ],
        backgroundColor: ['#3B82F6', '#EAB308', '#10B981']
      }]
    };
    
    // Force chart update
    this.ojtStatusChartData = {...this.ojtStatusChartData};
  }

  updateMonthlyProgressChart(ojts: any[]): void {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthData = new Array(12).fill(0);

    // Filter by selected year and status
    const filteredOjts = ojts.filter(ojt => {
      const matchesYear = ojt.ojt_start_date && new Date(ojt.ojt_start_date).getFullYear() === this.selectedYear;
      const matchesStatus = this.selectedStatus === 'all' || ojt.ojt_status === this.selectedStatus;
      return matchesYear && matchesStatus && ojt.ojt_status === 'Ongoing';
    });

    // Count ongoing trainees per month based on OJT start date
    filteredOjts.forEach(ojt => {
      if (ojt.ojt_start_date) {
        const startDate = new Date(ojt.ojt_start_date);
        const monthIndex = startDate.getMonth();
        monthData[monthIndex]++;
      }
    });

    // Show last 6 months with year
    const currentMonth = now.getMonth();
    const last6Months = [];
    const last6MonthsData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const yearForMonth = (currentMonth - i < 0) ? this.selectedYear - 1 : this.selectedYear;
      last6Months.push(`${months[monthIndex]} ${yearForMonth}`);
      last6MonthsData.push(monthData[monthIndex]);
    }

    this.monthlyProgressChartData = {
      labels: last6Months,
      datasets: [{
        label: 'Active Trainees',
        data: last6MonthsData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    // Force chart update
    this.monthlyProgressChartData = {...this.monthlyProgressChartData};
  }

  updateApplicationsByPositionChart(internships: any[]): void {
    const positionCounts: { [key: string]: number } = {};
    
    internships.forEach((internship: any) => {
      const position = internship.position || 'Other';
      positionCounts[position] = (positionCounts[position] || 0) + (internship.application_count || 0);
    });

    const labels = Object.keys(positionCounts);
    const data = Object.values(positionCounts);

    this.applicationsByPositionChartData = {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [{
        label: 'Applications',
        data: data.length > 0 ? data : [0],
        backgroundColor: '#8B5CF6'
      }]
    };
    
    // Force chart update
    this.applicationsByPositionChartData = {...this.applicationsByPositionChartData};
  }

  updateApplicationStatusChart(applications: any[]): void {
    const pending = applications.filter((app: any) => app.status === 'pending').length;
    const accepted = applications.filter((app: any) => app.status === 'accepted').length;
    const rejected = applications.filter((app: any) => app.status === 'rejected').length;

    this.applicationStatusChartData = {
      labels: ['Pending', 'Accepted', 'Rejected'],
      datasets: [{
        data: [pending, accepted, rejected],
        backgroundColor: ['#EAB308', '#10B981', '#EF4444']
      }]
    };
    
    // Force chart update
    this.applicationStatusChartData = {...this.applicationStatusChartData};
  }

  navigateToTab(tabIndex: number): void {
    this.tabChange.emit(tabIndex);
  }
}
