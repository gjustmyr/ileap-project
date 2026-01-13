import { Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { LoginComponent } from './auth/login/login.component';

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
    path: 'main',
    component: MainComponent,
  },
];
