import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../../../features/auth/models/api-routes.const';

export interface DashboardStats {
  totalActiveUsers: number;
  totalActiveAgents: number;
  totalProperties: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(API_ROUTES.STATS.GET_SUMMARY);
  }
}
