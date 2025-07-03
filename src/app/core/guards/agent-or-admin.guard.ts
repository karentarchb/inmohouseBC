import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.services';

export const agentOrAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user && (user.role === 'administrador' || user.role === 'agente')) {
        return true;
      }

      console.warn('Acceso denegado: se requiere rol de Agente o Administrador.');
      return router.createUrlTree(['/dashboard']);
    })
  );
};
