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
    path: 'modules/:moduleId',
    loadComponent: () => import('./modules/subjects/subjects.page').then((m) => m.SubjectsPage),
  },
  {
    path: 'modules/:moduleId/:subjectId',
    loadComponent: () => import('./modules/topics/topics.page').then((m) => m.TopicsPage),
  },
  {
    path: 'modules/:moduleId/:subjectId/:topicId',
    loadComponent: () => import('./modules/topic-detail/topic-detail.page').then((m) => m.TopicDetailPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'admin/topics/new/:subjectId',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/topic-editor/topic-editor.page').then((m) => m.TopicEditorPage),
  },
  {
    path: 'admin/topics/:topicId/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/topic-editor/topic-editor.page').then((m) => m.TopicEditorPage),
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
