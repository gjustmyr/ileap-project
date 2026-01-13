import { Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { LoginComponent } from './auth/login/login.component';
import { ForceChangePasswordComponent } from './auth/force-change-password/force-change-password.component';
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
