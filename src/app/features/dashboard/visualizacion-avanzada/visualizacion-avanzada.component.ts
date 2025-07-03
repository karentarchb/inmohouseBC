import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { PropertyService } from '../../properties/services/property.service';
import { Property } from '../../properties/models/property.interface';

@Component({
  selector: 'app-visualizacion-avanzada',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, ReactiveFormsModule, MatCardModule,
    MatProgressSpinnerModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './visualizacion-avanzada.component.html',
  styleUrl: './visualizacion-avanzada.component.css'
})
export class VisualizacionAvanzadaComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);

  // --- State Management con Signals ---
  private allProperties = signal<Property[]>([]);
  public filteredProperties = signal<Property[]>([]);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  // --- Filtros ---
  public filterForm = this.fb.group({
    city: [''],
    type: [''],
    priceRange: ['']
  });

  // Opciones para los select, se calculan automáticamente
  public availableCities = computed(() => this.getUniqueValues('city'));
  public availableTypes = computed(() => this.getUniqueValues('type'));
  public priceRanges = [
    { value: '0-300000', label: 'Hasta $300,000' },
    { value: '300001-600000', label: '$300,001 - $600,000' },
    { value: '600001-1000000', label: '$600,001 - $1,000,000' },
    { value: '1000001-99999999', label: 'Más de $1,000,000' }
  ];

  ngOnInit(): void {
    this.loadProperties();
    this.listenToFilterChanges();
  }

  loadProperties(): void {
    this.isLoading.set(true);
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.allProperties.set(data);
        this.filteredProperties.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar las propiedades.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  listenToFilterChanges(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let properties = this.allProperties();

    if (filters.city) {
      properties = properties.filter(p => p.city === filters.city);
    }
    if (filters.type) {
      properties = properties.filter(p => p.type === filters.type);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      properties = properties.filter(p => {
        const price = +p.price;
        return price >= min && price <= max;
      });
    }

    this.filteredProperties.set(properties);
  }

  clearFilters(): void {
    this.filterForm.reset({ city: '', type: '', priceRange: '' });
  }

  private getUniqueValues(key: keyof Property): string[] {
    const values = this.allProperties().map(p => p[key]);
    return [...new Set(values)] as string[];
  }

  getPropertyImageUrl(property: Property): string {
    const query = `${property.type}, ${property.city}`;
    return `https://source.unsplash.com/featured/?${encodeURIComponent(query)}&${property.id}`;
  }
}
