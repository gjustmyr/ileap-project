import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  sidebarItems: SidebarItem[] = [
    {
      label: 'School Information',
      icon: 'pi pi-book',
      route: '/school-information',
    },
    {
      label: 'Job Placement Office',
      icon: 'pi pi-briefcase',
      route: '/job-placement',
    },
    {
      label: 'OJT Head',
      icon: 'pi pi-user',
      route: '/ojt-head',
    },
    {
      label: 'OJT Coordinator',
      icon: 'pi pi-users',
      route: '/ojt-coordinator',
    },
    {
      label: 'Employer',
      icon: 'pi pi-building',
      route: '/employer',
    },
    {
      label: 'Student Trainees',
      icon: 'pi pi-users',
      route: '/student-trainees',
    },
    {
      label: 'Alumni',
      icon: 'pi pi-users',
      route: '/alumni',
    },
    {
      label: 'Industries',
      icon: 'pi pi-sitemap',
      route: '/industries',
    },
  ];

  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
