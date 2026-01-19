import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, CommonModule, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  dateTime: string = '';
  userEmail: string = '';
  userName: string = 'Super Admin';
  isUserDropdownOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserInfo();

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

  loadUserInfo(): void {
    this.userEmail = sessionStorage.getItem('user_email') || '';

    // Extract name from email (before @)
    if (this.userEmail) {
      const emailName = this.userEmail.split('@')[0];
      this.userName =
        emailName
          .split('.')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || 'Super Admin';
    } else {
      this.userName = 'Super Admin';
    }
  }

  navigateToTab(route: string) {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout() {
    this.isUserDropdownOpen = false;
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
