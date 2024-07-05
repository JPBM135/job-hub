import type { Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';
import { unauthenticationGuard } from './core/guards/unauthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: async () =>
      (await import('./pages/login/login.component')).LoginComponent,
    canActivate: [unauthenticationGuard],
  },
  {
    path: 'dashboard',
    loadComponent: async () =>
      (await import('./pages/dashboard/dashboard.component'))
        .DashboardComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
