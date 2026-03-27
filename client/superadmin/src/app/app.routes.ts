import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@auth/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    data: {
      title: 'Login',
    },
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('@auth/components/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@auth/components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@auth/components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'superadmin',
    loadComponent: () =>
      import('@core/layouts/main/main.component').then((m) => m.MainComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'school-information',
        pathMatch: 'full',
      },
      {
        path: 'school-information',
        loadComponent: () =>
          import('@features/school-info/campuses/campuses.component').then(
            (m) => m.CampusesComponent,
          ),
        data: { title: 'School Information' },
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('@features/school-info/departments/departments.component').then(
            (m) => m.DepartmentsComponent,
          ),
        data: { title: 'Departments' },
      },
      {
        path: 'programs',
        loadComponent: () =>
          import('@features/school-info/programs/programs.component').then(
            (m) => m.ProgramsComponent,
          ),
        data: { title: 'Programs' },
      },
      {
        path: 'job-placement',
        loadComponent: () =>
          import('@features/job-placement/job-placement.component').then(
            (m) => m.JobPlacementComponent,
          ),
        data: { title: 'Job Placement Office' },
      },
      {
        path: 'ojt-head',
        loadComponent: () =>
          import('@features/ojt-head/ojt-head.component').then(
            (m) => m.OjtHeadComponent,
          ),
        data: { title: 'OJT Head' },
      },
      {
        path: 'ojt-coordinator',
        loadComponent: () =>
          import('@features/ojt-coordinator/ojt-coordinator.component').then(
            (m) => m.OjtCoordinatorComponent,
          ),
        data: { title: 'OJT Coordinator' },
      },
      {
        path: 'employer',
        loadComponent: () =>
          import('@features/employer/employer.component').then(
            (m) => m.EmployerComponent,
          ),
        data: { title: 'Employers' },
      },
      {
        path: 'industries',
        loadComponent: () =>
          import('@features/industries/industries.component').then(
            (m) => m.IndustriesComponent,
          ),
        data: { title: 'Industries' },
      },
      {
        path: 'student-trainees',
        loadComponent: () =>
          import('@features/student-trainees/student-trainees.component').then(
            (m) => m.StudentTraineesComponent,
          ),
        data: { title: 'Student Trainees' },
      },
      {
        path: 'alumni',
        loadComponent: () =>
          import('@features/alumni/alumni.component').then(
            (m) => m.AlumniComponent,
          ),
        data: { title: 'Alumni' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
        data: { title: 'Settings' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
