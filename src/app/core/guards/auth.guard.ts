import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.services';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      /**
       * Si el usuario está autenticado, permite el acceso a la ruta.
       */
      if (isAuthenticated) {
        return true;
      }

      /**
       * Si no está autenticado, redirige a la página de login
       * y deniega el acceso a la ruta protegida.
       */
      return router.createUrlTree(['/login']);
    })
  );
};
