import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.services';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifyAdminStatus().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true;
      }

      console.error('Acceso denegado por el servidor: no tienes permisos de administrador.');
      return router.createUrlTree(['/dashboard']);
    })
  );
};
