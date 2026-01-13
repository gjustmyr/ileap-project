import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForceChangePasswordComponent } from './auth/force-change-password/force-change-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainComponent } from './core/main/main.component';
import { CompanyProfileComponent } from './features/company-profile/company-profile.component';
import { JobListingsComponent } from './features/job-listings/job-listings.component';
import { TraineeSupervisorsComponent } from './features/trainee-supervisors/trainee-supervisors.component';

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
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        component: DashboardComponent,
      },
      {
        path: 'company-profile',
        data: { title: 'Company Profile' },
        component: CompanyProfileComponent,
      },
      {
        path: 'job-listings',
        data: { title: 'Job Listing' },
        component: JobListingsComponent,
      },
      {
        path: 'trainee-supervisors',
        data: { title: 'Trainee Supervisors' },
        component: TraineeSupervisorsComponent,
      },
    ],
  },
];
