import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = sessionStorage.getItem('auth_token');

  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }

  return authService.validateToken().pipe(
    map(() => true),
    catchError(() => {
      sessionStorage.clear(); // Clear token if invalid
      router.navigate(['/login']);
      return of(false);
    })
  );
};
