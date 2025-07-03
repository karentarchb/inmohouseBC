import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacionPropiedadesComponent } from './visualizacion-propiedades.component';

describe('VisualizacionPropiedadesComponent', () => {
  let component: VisualizacionPropiedadesComponent;
  let fixture: ComponentFixture<VisualizacionPropiedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacionPropiedadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizacionPropiedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
