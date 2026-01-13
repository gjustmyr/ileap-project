import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './core/main/main.component';
import { CampusesComponent } from './features/school-info/campuses/campuses.component';
import { DepartmentsComponent } from './features/school-info/departments/departments.component';
import { ProgramsComponent } from './features/school-info/programs/programs.component';
import { JobPlacementComponent } from './features/job-placement/job-placement.component';
import { OjtHeadComponent } from './features/ojt-head/ojt-head.component';
import { OjtCoordinatorComponent } from './features/ojt-coordinator/ojt-coordinator.component';
import { EmployerComponent } from './features/employer/employer.component';
import { IndustriesComponent } from './features/industries/industries.component';
import { StudentTraineesComponent } from './features/student-trainees/student-trainees.component';
import { AlumniComponent } from './features/alumni/alumni.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'school-information',
    redirectTo: 'school-information/campuses',
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
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'school-information/campuses',
        pathMatch: 'full',
      },
      {
        path: 'school-information',
        data: { title: 'School Information' },
        children: [
          {
            path: 'campuses',
            component: CampusesComponent,
            data: { title: 'Campuses' },
          },
          {
            path: 'departments',
            component: DepartmentsComponent,
            data: { title: 'Departments' },
          },
          {
            path: 'programs',
            component: ProgramsComponent,
            data: { title: 'Programs' },
          },
        ],
      },
      {
        path: 'job-placement',
        component: JobPlacementComponent,
        data: { title: 'Job Placement' },
      },
      {
        path: 'ojt-head',
        component: OjtHeadComponent,
        data: { title: 'OJT Head' },
      },
      {
        path: 'ojt-coordinator',
        component: OjtCoordinatorComponent,
        data: { title: 'OJT Coordinator' },
      },
      {
        path: 'employer',
        component: EmployerComponent,
        data: { title: 'Employers' },
      },
      {
        path: 'industries',
        component: IndustriesComponent,
        data: { title: 'Industries' },
      },
      {
        path: 'student-trainees',
        component: StudentTraineesComponent,
        data: { title: 'Student Trainees' },
      },
      {
        path: 'alumni',
        component: AlumniComponent,
        data: { title: 'Alumni' },
      },
    ],
  },
];
