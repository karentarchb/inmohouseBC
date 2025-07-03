import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { API_ROUTES } from '../models/api-routes.const';
import { Credentials } from '../models/credentials.interface';
import { RegisterPayload } from '../models/register-payload.interface';
import { LoginResponse, RegisterResponse } from '../models/api-responses.interface';

import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private currentUser$ = new BehaviorSubject<User | null>(null);
  public user$ = this.currentUser$.asObservable();

  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  /**
   * Verifica si existe un token en localStorage.
   * @returns `true` si el token existe, de lo contrario `false`.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  constructor() {
    this.loadUserFromToken();
  }

  /**
   * Intenta cargar los datos del usuario desde el token en localStorage al recargar la página.
   */
  private loadUserFromToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decodedToken: { user: User, iat: number, exp: number } = jwtDecode(token);
      this.currentUser$.next(decodedToken.user);
      this._isAuthenticated.next(true);
    }
  }

  /**
   * Realiza la petición de login al backend.
   * @param credentials Las credenciales del usuario (email y password)
   * @returns Un Observable con la respuesta del login.
   */
  login(credentials: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          this.loadUserFromToken();
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
    return this.http.post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    this._isAuthenticated.next(false);
    this.currentUser$.next(null);
  }

  /**
   * Consulta al backend para verificar si el token actual pertenece a un administrador.
   * @returns Un Observable que emite `true` si el usuario es admin, y `false` en cualquier otro caso.
   */
  verifyAdminStatus(): Observable<boolean> {
    return this.http.get<{ success: boolean }>(API_ROUTES.AUTH.ADMIN_TEST).pipe(
      map(response => response.success === true),
      catchError(() => {
        return of(false);
      })
    );
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
