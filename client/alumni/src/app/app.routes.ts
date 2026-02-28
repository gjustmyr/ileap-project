import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [loginGuard],
    data: { title: 'Alumni Registration' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginGuard],
    data: { title: 'Alumni Login' },
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
    canActivate: [loginGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'alumni',
    loadComponent: () =>
      import('./core/main/main.component').then((m) => m.MainComponent),
    canActivate: [authGuard],
    data: { title: 'Alumni Portal' },
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./auth/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
