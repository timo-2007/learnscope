import { Routes } from '@angular/router';
import { routes as tabsRoutes } from './tabs/tabs.routes';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  ...tabsRoutes,
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
 {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
