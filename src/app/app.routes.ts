import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { agentOrAdminGuard } from './core/guards/agent-or-admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component')
      .then(c => c.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(c => c.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'visualizacion',
        pathMatch: 'full'
      },
      {
        path: 'visualizacion',
        loadComponent: () => import('./features/dashboard/visualizacion-propiedades/visualizacion-propiedades.component').then(c => c.VisualizacionPropiedadesComponent)
      },
      {
      path: 'visualizacion/avanzada',
      loadComponent: () => import('./features/dashboard/visualizacion-avanzada/visualizacion-avanzada.component').then(c => c.VisualizacionAvanzadaComponent)
    },
      {
        path: 'gestion',
        loadComponent: () => import('./features/dashboard/gestion-propiedades/gestion-propiedades.component').then(c => c.GestionPropiedadesComponent),
        canActivate: [authGuard, agentOrAdminGuard]
      }
    ]
  },
   {
    path: 'admin',
    loadComponent: () => import('./features/dashboard/admin-panel/admin-panel.component').then(c => c.AdminPanelComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/components/register/register.component')
      .then(c => c.RegisterComponent),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
