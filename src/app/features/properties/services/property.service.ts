import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.interface';
import { API_ROUTES } from '../../../features/auth/models/api-routes.const';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);

  /**
   * Obtiene todas las propiedades desde el backend.
   * Nuestro AuthInterceptor se encargará de añadir el token automáticamente.
   * @returns Un Observable con un array de propiedades.
   */
  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(API_ROUTES.PROPERTIES.GET_ALL);
  }
  /**
   * Crea una nueva propiedad.
   */
  createProperty(propertyData: Omit<Property, 'id' | 'created_at'>): Observable<Property> {
    return this.http.post<Property>(API_ROUTES.PROPERTIES.CREATE, propertyData);
  }

  /**
   * Actualiza una propiedad existente.
   */
  updateProperty(id: number, propertyData: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(API_ROUTES.PROPERTIES.UPDATE(id), propertyData);
  }

  /**
   * Borra una propiedad.
   */
  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.PROPERTIES.DELETE(id));
  }
}
