import { Routes } from '@angular/router';
import { routes as tabsRoutes } from './tabs/tabs.routes';

export const routes: Routes = [
  ...tabsRoutes,
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
