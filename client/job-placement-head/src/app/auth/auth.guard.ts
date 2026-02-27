import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = sessionStorage.getItem('auth_token');

  // If no token exists, redirect to login immediately
  if (!token) {
    console.warn('No authentication token found. Redirecting to login.');
    router.navigate(['/login']);
    return of(false);
  }

  // Validate token with backend
  return authService.validateToken().pipe(
    map((response) => {
      console.log('Token validation successful');
      return true;
    }),
    catchError((error) => {
      console.error('Token validation failed:', error);
      
      // Clear all authentication data
      sessionStorage.clear();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      
      // Redirect to login
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url, expired: 'true' }
      });
      
      return of(false);
    })
  );
};
