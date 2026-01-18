import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForceChangePasswordComponent } from './auth/force-change-password/force-change-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainComponent } from './core/main/main.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { RequirementsComponent } from './features/requirements/requirements.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
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
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'dashboard',
    component: MainComponent,
  },
];
