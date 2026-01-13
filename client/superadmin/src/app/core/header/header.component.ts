import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  pageTitle: string = '';

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Even if logout fails, clear local session and redirect
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getDeepestRoute(this.activatedRoute);
        this.pageTitle = currentRoute.snapshot.data['title'] || 'ILEAP';
      });
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
