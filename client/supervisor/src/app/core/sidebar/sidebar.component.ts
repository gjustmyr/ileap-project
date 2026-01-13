import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-gauge',
      route: '/dashboard',
    },
    {
      label: 'Company Profile',
      icon: 'pi pi-id-card',
      route: '/company-profile',
    },
    {
      label: 'Job Listings',
      icon: 'pi pi-briefcase',
      route: '/job-listings',
    },
    {
      label: 'Applications',
      icon: 'pi pi-file-edit',
      route: '/applications',
    },
    {
      label: 'Student Trainees',
      icon: 'pi pi-users',
      route: '/student-trainees',
    },
    {
      label: 'Supervisor',
      icon: 'pi pi-user',
      route: '/trainee-supervisors',
    },
  ];

  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
