import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    /**
     * RUTA PROTEGIDA: El guard se ejecuta antes de activar esta ruta.
     */
    canActivate: [authGuard]
  },
  {
    /**
     * Redirección por defecto: Intenta ir al dashboard.
     * El guard se encargará de redirigir a /login si no hay sesión.
     */
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    /**
     * Wildcard/Comodín: Cualquier otra ruta no definida
     * redirige al dashboard.
     */
    path: '**',
    redirectTo: '/dashboard'
  }
];
