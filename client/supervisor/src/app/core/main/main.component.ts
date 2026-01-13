import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AttendanceComponent } from '../../features/attendance/attendance.component';
import { RequirementsComponent } from '../../features/requirements/requirements.component';
import { ProfileComponent } from '../../features/profile/profile.component';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    CommonModule,
    AttendanceComponent,
    RequirementsComponent,
    ProfileComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  activeTab: number = 0;
  dateTime: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      const now = new Date();

      const time = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      this.dateTime = `${date}, ${time}`;
    }, 1000);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
