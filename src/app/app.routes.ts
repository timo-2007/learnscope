import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'modules',
    loadComponent: () => import('./modules/modules.page').then((m) => m.ModulesPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
