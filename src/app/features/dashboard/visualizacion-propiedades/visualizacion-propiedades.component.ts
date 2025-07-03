import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

import { StatsService, DashboardStats } from '../services/stats.service';
import { UserService } from '../../users/services/user.service';
import { User } from '../../auth/models/user.interface';

@Component({
  selector: 'app-visualizacion-propiedades',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    BaseChartDirective
  ],
  templateUrl: './visualizacion-propiedades.component.html',
  styleUrl: './visualizacion-propiedades.component.css'
})
export class VisualizacionPropiedadesComponent implements OnInit {
  private statsService = inject(StatsService);
  private userService = inject(UserService);

  public agentOfTheMonth = signal<User | null>(null);

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } },
    plugins: { legend: { display: false } }
  };
  public barChartLabels: string[] = ['Propiedades', 'Agentes', 'Clientes'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [{
      data: [],
      backgroundColor: ['#4a00e0', '#8e2de2', '#007bff'],
      borderRadius: 5,
      barThickness: 30
    }]
  };

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      stats: this.statsService.getStats(),
      agents: this.userService.getAgents()
    }).subscribe(({ stats, agents }) => {
      this.barChartData = {
        ...this.barChartData,
        datasets: [{
          ...this.barChartData.datasets[0],
          data: [stats.totalProperties, stats.totalActiveAgents, stats.totalActiveUsers]
        }]
      };

      if (agents && agents.length > 0) {
        this.agentOfTheMonth.set(agents[0]);
      }
    });
  }
}
