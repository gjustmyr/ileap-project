import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Add Authorization header if token exists
  const token = sessionStorage.getItem('auth_token');
  if (token && !req.url.includes('/auth/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors (expired or invalid token)
      if (error.status === 401) {
        console.warn('401 Unauthorized - Token expired or invalid');
        
        // Clear all authentication data
        sessionStorage.clear();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');

        // Redirect to login with expired session message
        router.navigate(['/login'], {
          queryParams: { expired: 'true' }
        });
      }

      // Handle 403 Forbidden errors (insufficient permissions)
      if (error.status === 403) {
        console.warn('403 Forbidden - Insufficient permissions');
      }

      return throwError(() => error);
    })
  );
};
