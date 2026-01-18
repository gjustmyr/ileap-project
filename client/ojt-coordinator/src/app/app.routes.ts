import { Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClassListingComponent } from './features/class-listing/class-listing.component';
import { JobListingComponent } from './features/job-listing/job-listing.component';
import { RequirementsComponent } from './features/requirements/requirements.component';
import { DownloadsComponent } from './features/downloads/downloads.component';

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
    path: 'ojt-coordinator',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'class-listing',
        component: ClassListingComponent,
        data: {
          title: 'Class Listing',
        },
      },
      {
        path: 'job-listing',
        component: JobListingComponent,
        data: {
          title: 'Job Listing',
        },
      },
      {
        path: 'requirements',
        component: RequirementsComponent,
        data: {
          title: 'Requirements',
        },
      },
      {
        path: 'downloads',
        component: DownloadsComponent,
        data: {
          title: 'Downloads',
        },
      },
    ],
  },
];
