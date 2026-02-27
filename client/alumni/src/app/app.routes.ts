import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
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
    data: {
      title: 'Alumni Registration',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    data: {
      title: 'Alumni Login',
    },
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  // Temporary: Alumni portal main page redirects to login until components are built
  {
    path: 'alumni',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
