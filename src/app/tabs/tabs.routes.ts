import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../core/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'modules',
        loadComponent: () => import('../modules/modules.page').then((m) => m.ModulesPage),
      },
      {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () => import('../admin/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
