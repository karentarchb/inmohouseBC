import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacionAvanzadaComponent } from './visualizacion-avanzada.component';

describe('VisualizacionAvanzadaComponent', () => {
  let component: VisualizacionAvanzadaComponent;
  let fixture: ComponentFixture<VisualizacionAvanzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacionAvanzadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizacionAvanzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
