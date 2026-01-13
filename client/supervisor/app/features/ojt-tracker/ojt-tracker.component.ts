import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ojt-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './ojt-tracker.component.html',
  styleUrl: './ojt-tracker.component.css',
  standalone: true,
})
export class OjtTrackerComponent implements OnInit {
  hasOngoingOJT: boolean = false;
  canStartOJT: boolean = false;
  isHired: boolean = false;
  allRequirementsValidated: boolean = false;
  hasOJTStarted: boolean = false;
  employerInfo: any = null;

  // OJT Progress
  hoursCompleted: number = 0;
  hoursRequired: number = 486; // Standard OJT hours
  totalDays: number = 0;
  progressPercentage: number = 0;
  remainingHours: number = 486;
  ojtStatus: string = 'Not Started';

  // Additional info
  coordinatorName: string = 'To be assigned';
  supervisorName: string = 'To be assigned';
  presumedEndDate: Date | null = null;

  // Logs data
  dailyLogs: any[] = [];
  studentName: string = '';
  campusName: string = '';
  departmentName: string = '';

  // Filter dates
  filterStartDate: string = '';
  filterEndDate: string = '';
  today: Date = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkOJTStatus();
    this.loadStudentProfile();
    this.loadClassInfo();
  }

  loadClassInfo(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http
      .get(`${environment.apiUrl}/students/class-info`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('📚 Class Info Response:', response);
          if (response && response.data) {
            const classInfo = response.data;

            // Set OJT coordinator from class info
            if (classInfo.ojt_coordinator) {
              this.coordinatorName = `${classInfo.ojt_coordinator.first_name} ${classInfo.ojt_coordinator.last_name}`;
            }
          }
        },
        error: (error) => {
          console.error('Error loading class info:', error);
          // Keep default "To be assigned" if error
        },
      });
  }

  loadStudentProfile(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http
      .get(`${environment.apiUrl}/students/profile`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('📝 Profile Response:', response);
          if (response.status === 'success' && response.data) {
            const data = response.data;
            this.studentName = `${data.last_name}, ${data.first_name}${
              data.middle_name ? ' ' + data.middle_name.charAt(0) + '.' : ''
            }`;
            this.campusName = data.campus_name || 'Not Available';
            this.departmentName = data.department || 'Not Available';
          }
        },
        error: (error) => {
          console.error('Error loading student profile:', error);
        },
      });
  }

  checkOJTStatus(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    // Check hiring and requirements status
    this.http
      .get(`${environment.apiUrl}/students/hiring-status`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('📊 OJT Status Response:', response);
          this.isHired = response.is_hired;
          this.employerInfo = response.employer_info;
          this.allRequirementsValidated = response.all_requirements_validated;
          this.canStartOJT = response.can_start_ojt;
          this.hasOJTStarted = response.has_ojt_started || false;

          // Set supervisor name from employer assignment
          if (this.employerInfo?.supervisor_name) {
            this.supervisorName = this.employerInfo.supervisor_name;
          }

          // OJT is ongoing if it has started
          this.hasOngoingOJT = this.hasOJTStarted;

          console.log('✅ Can Start OJT:', this.canStartOJT);
          console.log('🚀 Has OJT Started:', this.hasOJTStarted);

          this.ojtStatus = this.hasOJTStarted ? 'In Progress' : 'Not Started';

          // Load OJT logs if started
          if (this.hasOJTStarted) {
            this.loadOJTLogs();
          }
        },
        error: (error) => {
          console.error('Error checking OJT status:', error);
        },
      });
  }

  loadOJTLogs(): void {
    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    this.http.get(`${environment.apiUrl}/oeams/logs`, { headers }).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.dailyLogs = response.data.logs || [];
          
          // Calculate hours from ALL logs (including those with warnings)
          // Warnings are just alerts, not invalidations - hours still count
          this.hoursCompleted = this.dailyLogs.reduce((sum, log) => sum + (log.total_hours || 0), 0);
          this.totalDays = this.dailyLogs.length;
          
          this.remainingHours = Math.max(
            0,
            this.hoursRequired - this.hoursCompleted
          );
          this.progressPercentage = Math.round(
            (this.hoursCompleted / this.hoursRequired) * 100
          );

          // Calculate dynamic presumed end date based on actual progress
          this.calculatePresumedEndDate();

          const logsWithWarnings = this.dailyLogs.filter(log => log.validation_warning);
          console.log('📈 OJT Progress:', {
            completed: this.hoursCompleted,
            required: this.hoursRequired,
            remaining: this.remainingHours,
            percentage: this.progressPercentage,
            days: this.totalDays,
            totalLogs: this.dailyLogs.length,
            logsWithWarnings: logsWithWarnings.length,
            logs: this.dailyLogs,
          });
        }
      },
      error: (error) => {
        console.error('Error loading OJT logs:', error);
      },
    });
  }

  calculatePresumedEndDate(): void {
    if (!this.employerInfo?.ojt_start_date) {
      this.presumedEndDate = null;
      return;
    }

    const startDate = new Date(this.employerInfo.ojt_start_date);
    const today = new Date();
    
    // If no hours logged yet, use default estimate
    if (this.hoursCompleted === 0 || this.totalDays === 0) {
      this.presumedEndDate = new Date(startDate);
      this.presumedEndDate.setDate(this.presumedEndDate.getDate() + 90); // ~3 months default
      return;
    }

    // Calculate remaining working days assuming 8 hours/day going forward
    // This assumes student will work full days from now on to complete OJT
    const hoursPerWorkday = 8;
    const workingDaysNeeded = Math.ceil(this.remainingHours / hoursPerWorkday);
    
    // Add buffer for weekends (assume 5 working days per week)
    // weekendDays = workingDaysNeeded / 5 * 2 (for every 5 working days, add 2 weekend days)
    const weekendBuffer = Math.floor(workingDaysNeeded / 5) * 2;
    const totalCalendarDays = workingDaysNeeded + weekendBuffer;
    
    // Set presumed end date from today + calendar days
    this.presumedEndDate = new Date(today);
    this.presumedEndDate.setDate(this.presumedEndDate.getDate() + totalCalendarDays);
    
    console.log('📅 Presumed End Date Calculation:', {
      startDate: startDate.toISOString(),
      today: today.toISOString(),
      hoursCompleted: this.hoursCompleted,
      remainingHours: this.remainingHours,
      workingDaysNeeded,
      weekendBuffer,
      totalCalendarDays,
      presumedEndDate: this.presumedEndDate.toISOString()
    });
  }

  getDayOfWeek(dateString: string): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }

  get filteredLogs(): any[] {
    if (!this.filterStartDate && !this.filterEndDate) {
      return this.dailyLogs;
    }

    return this.dailyLogs.filter((log) => {
      const logDate = new Date(log.log_date);
      const startDate = this.filterStartDate
        ? new Date(this.filterStartDate)
        : null;
      const endDate = this.filterEndDate ? new Date(this.filterEndDate) : null;

      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });
  }

  get filteredTotalHours(): number {
    // Count ALL filtered logs, including those with warnings
    return this.filteredLogs.reduce((sum, log) => sum + (log.total_hours || 0), 0);
  }
  
  get filteredValidDays(): number {
    return this.filteredLogs.length;
  }

  generatePDF(): void {
    const element = document.getElementById('printable-report');
    if (!element) {
      console.error('Printable report element not found');
      return;
    }

    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    // Replace all Tailwind classes with inline RGB styles
    const replaceClasses = (el: Element) => {
      if (!(el instanceof HTMLElement)) return;

      // Map of Tailwind classes to hex values
      const colorMap: {
        [key: string]: { bg?: string; color?: string; border?: string };
      } = {
        'bg-orange-500': { bg: '#f97316', color: '#ffffff' },
        'bg-white': { bg: '#ffffff' },
        'text-white': { color: '#ffffff' },
        'text-black': { color: '#000000' },
        'text-gray-800': { color: '#1f2937' },
        'text-gray-500': { color: '#6b7280' },
        'border-black': { border: '#000000' },
        'border-2': { border: '#000000' },
      };

      // Apply colors based on classes
      Object.keys(colorMap).forEach((className) => {
        if (el.classList.contains(className)) {
          const colors = colorMap[className];
          if (colors.bg) el.style.backgroundColor = colors.bg;
          if (colors.color) el.style.color = colors.color;
          if (colors.border) el.style.borderColor = colors.border;
        }
      });

      // Ensure all borders are visible
      if (el.tagName === 'TD' || el.tagName === 'TH') {
        el.style.borderColor = 'rgb(0, 0, 0)';
        el.style.borderWidth = '2px';
        el.style.borderStyle = 'solid';
      }

      // Ensure table borders
      if (el.tagName === 'TABLE') {
        el.style.borderCollapse = 'collapse';
      }

      // Process all children recursively
      Array.from(el.children).forEach((child) => replaceClasses(child));
    };

    replaceClasses(clone);

    // Configure PDF options
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Accomplishment_Report_${this.studentName.replace(
        /\s+/g,
        '_'
      )}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'legal' as const,
        orientation: 'portrait' as const,
      },
    };

    // Generate PDF from clone
    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(clone);
      })
      .catch((error: any) => {
        console.error('PDF generation error:', error);
        document.body.removeChild(clone);
      });
  }
}
