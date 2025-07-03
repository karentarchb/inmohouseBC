import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { finalize, forkJoin } from 'rxjs';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { PropertyFormDialogComponent } from '../../properties/components/property-form-dialog/property-form-dialog.component';
import { PropertyService } from '../../properties/services/property.service';
import { UserService } from '../../users/services/user.service';
import { Property } from '../../properties/models/property.interface';

@Component({
  selector: 'app-gestion-propiedades',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatPaginatorModule, MatSortModule, MatCardModule
  ],
  templateUrl: './gestion-propiedades.component.html',
  styleUrl: './gestion-propiedades.component.css'
})
export class GestionPropiedadesComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public isLoading = signal(true);
  public displayedColumns: string[] = ['id', 'title', 'city', 'price', 'agentName', 'actions'];
  public dataSource = new MatTableDataSource<Property>();
  private agentsMap = new Map<number, string>();

  public totalProperties = signal(0);
  public totalAgents = signal(0);
  public propertiesForSale = signal(0);
  public propertiesForRent = signal(0);

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor() {
    this.setupSorting();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

   loadInitialData(): void {
    this.isLoading.set(true);
    forkJoin({
      properties: this.propertyService.getProperties(),
      agents: this.userService.getAgents()
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: ({ properties, agents }) => {
        this.totalProperties.set(properties.length);
        this.totalAgents.set(agents.length);

        let forSaleCount = 0;
        let forRentCount = 0;
        properties.forEach((prop, index) => {
          if (index % 2 === 0) {
            forSaleCount++;
          } else {
            forRentCount++;
          }
        });
        this.propertiesForSale.set(forSaleCount);
        this.propertiesForRent.set(forRentCount);

        agents.forEach(agent => this.agentsMap.set(agent.id, agent.name));
        this.dataSource.data = properties;
      },
      error: (err) => {
        console.error("Error al cargar datos iniciales", err);
        this.snackBar.open('Error al cargar los datos de la página.', 'Cerrar', { duration: 3000 });
      }
    });
  }

   /**
   * Configura el acceso a datos personalizado para el ordenamiento de la tabla.
   */
  setupSorting(): void {
    this.dataSource.sortingDataAccessor = (item: Property, property: string) => {
      switch (property) {
        case 'agentName': return this.getAgentName(item.agent_id);
        default: return (item as any)[property];
      }
    };
  }

  refreshProperties(): void {
    this.isLoading.set(true);
    this.propertyService.getProperties()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  getAgentName(agentId: number): string {
    const agentName = this.agentsMap.get(agentId);
    return agentName || 'Por Asignar';
  }

  /**
   * Abre el diálogo para crear o editar una propiedad.
   */
  openPropertyDialog(property?: Property): void {
    const dialogRef = this.dialog.open(PropertyFormDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { property }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const operation$ = property?.id
          ? this.propertyService.updateProperty(property.id, result)
          : this.propertyService.createProperty(result);

        operation$.subscribe(() => {
          this.refreshProperties();
          this.snackBar.open(`Propiedad ${property?.id ? 'actualizada' : 'creada'} con éxito`, 'Cerrar', { duration: 3000 });
        });
      }
    });
  }

  deleteProperty(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar esta propiedad?')) {
      this.propertyService.deleteProperty(id).subscribe(() => {
        this.refreshProperties();
        this.snackBar.open('Propiedad eliminada con éxito', 'Cerrar', { duration: 3000 });
      });
    }
  }
}
