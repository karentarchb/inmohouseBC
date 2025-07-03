import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user.interface';
import { API_ROUTES } from '../../../features/auth/models/api-routes.const';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  /**
   * Obtiene una lista de todos los usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ROUTES.USERS.GET_ALL);
  }

  /**
   * Obtiene una lista de todos los usuarios con el rol de 'agente'.
   */
  getAgents(): Observable<User[]> {
    return this.http.get<User[]>(API_ROUTES.USERS.GET_AGENTS);
  }

  /**
   * Crea un nuevo usuario.
   */
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(API_ROUTES.USERS.CREATE, userData);
  }

  /**
   * Actualiza un usuario existente.
   */
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(API_ROUTES.USERS.UPDATE(id), userData);
  }

  /**
   * Borra un usuario.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.USERS.DELETE(id));
  }
}
