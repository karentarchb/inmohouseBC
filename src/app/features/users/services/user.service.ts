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
   * Obtiene una lista de todos los usuarios con el rol de 'agente'.
   */
  getAgents(): Observable<User[]> {
    return this.http.get<User[]>(API_ROUTES.USERS.GET_AGENTS);
  }
}
