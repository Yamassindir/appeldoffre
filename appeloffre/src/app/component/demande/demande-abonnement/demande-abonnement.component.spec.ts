import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeAbonnementComponent } from './demande-abonnement.component';

describe('DemandeAbonnementComponent', () => {
  let component: DemandeAbonnementComponent;
  let fixture: ComponentFixture<DemandeAbonnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeAbonnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
