import { Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { LoginComponent } from './auth/login/login.component';
import { ForceChangePasswordComponent } from './auth/force-change-password/force-change-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RequirementsComponent } from './features/requirements/requirements.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'force-change-password',
    component: ForceChangePasswordComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'ojt-head',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'requirements',
        component: RequirementsComponent,
        data: {
          title: 'OJT Requirements',
        },
      },
    ],
  },
];
