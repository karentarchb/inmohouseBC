import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AUTH_API_ROUTES } from '../models/api-routes.const';
import { Credentials } from '../models/credentials.interface';
import { RegisterPayload } from '../models/register-payload.interface';
import { LoginResponse, RegisterResponse } from '../models/api-responses.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  /**
   * Verifica si existe un token en localStorage.
   * @returns `true` si el token existe, de lo contrario `false`.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Realiza la petición de login al backend.
   * @param credentials Las credenciales del usuario (email y password)
   * @returns Un Observable con la respuesta del login.
   */
  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AUTH_API_ROUTES.LOGIN, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          this._isAuthenticated.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Realiza la petición de registro al backend.
   * @param payload Los datos para registrar un nuevo usuario.
   * @returns Un Observable con el mensaje y el usuario creado.
   */
  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(AUTH_API_ROUTES.REGISTER, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    this._isAuthenticated.next(false);
  }

  /**
   * Manejador de errores de HTTP centralizado.
   * @param error El objeto de error de la petición HTTP.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Tenemos un error sin revisión.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Revisa tus credenciales de ingreso, miremos que pasó.';
      } else if (error.status === 409) {
        errorMessage = error.error.message || 'Este usuario ya se encuentra en nuestras bases de datos.';
      } else {
        errorMessage = `El servidor envió el siguiente codigo de error: ${error.status}, El mensaje de error es: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
