import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, CommonModule, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
})
export class MainComponent implements OnInit {
  userEmail: string = '';
  userName: string = 'Super Admin';
  isUserDropdownOpen: boolean = false;
  currentDateTime: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.startClock();
  }

  startClock(): void {
    // Update time immediately
    this.updateDateTime();
    
    // Update every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime(): void {
    const now = new Date();
    
    // Format time (12-hour format with AM/PM)
    const time = now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Format date
    const date = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    this.currentDateTime = `${time} - ${date}`;
  }

  loadUserInfo(): void {
    // Try to get user profile from API first
    this.authService.getUserProfile().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const userData = response.data;
          this.userEmail = userData.email || '';
          
          // Use full_name if available, otherwise construct from first/last name
          if (userData.full_name) {
            this.userName = userData.full_name;
          } else if (userData.first_name && userData.last_name) {
            this.userName = `${userData.first_name} ${userData.last_name}`;
          } else if (userData.first_name) {
            this.userName = userData.first_name;
          } else {
            // Fallback to email-based name extraction
            this.extractNameFromEmail();
          }
        } else {
          // Fallback to email-based name extraction
          this.extractNameFromEmail();
        }
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        // Fallback to email-based name extraction
        this.extractNameFromEmail();
      }
    });
  }

  private extractNameFromEmail(): void {
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
