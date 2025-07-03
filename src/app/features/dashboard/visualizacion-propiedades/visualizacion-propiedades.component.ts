import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js'; // <-- MODIFICA ESTA LÍNEA

import { StatsService, DashboardStats } from '../services/stats.service';

@Component({
  selector: 'app-visualizacion-propiedades',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective
  ],
  templateUrl: './visualizacion-propiedades.component.html',
  styleUrl: './visualizacion-propiedades.component.css'
})
export class VisualizacionPropiedadesComponent implements OnInit {
  private statsService = inject(StatsService);

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 } }
    }
  };
  public barChartLabels: string[] = ['Propiedades Totales', 'Agentes Activos', 'Clientes Activos'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [],
        label: 'Estadísticas Totales',
        backgroundColor: ['#007bff', '#fd7e14', '#28a745'],
        borderRadius: 5
      }
    ]
  };

  constructor() {

    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getStats().subscribe((stats: DashboardStats) => {

      this.barChartData = {
        ...this.barChartData,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: [
              stats.totalProperties,
              stats.totalActiveAgents,
              stats.totalActiveUsers
            ]
          }
        ]
      };
    });
  }
}
