import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Login Guard - Prevents authenticated users from accessing login/register pages
 * If user already has a valid token, redirect them to the main portal
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth_token');

  // If token exists, user is already logged in
  if (token) {
    console.log('User already authenticated. Redirecting to portal.');
    router.navigate(['/alumni']);
    return false;
  }

  // No token, allow access to login/register page
  return true;
};
