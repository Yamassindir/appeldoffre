import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeMaintenanceComponent } from './demande-maintenance.component';

describe('DemandeMaintenanceComponent', () => {
  let component: DemandeMaintenanceComponent;
  let fixture: ComponentFixture<DemandeMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
