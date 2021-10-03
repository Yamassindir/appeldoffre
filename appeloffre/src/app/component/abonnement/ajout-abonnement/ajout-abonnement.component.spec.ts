import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAbonnementComponent } from './ajout-abonnement.component';

describe('AjoutAbonnementComponent', () => {
  let component: AjoutAbonnementComponent;
  let fixture: ComponentFixture<AjoutAbonnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutAbonnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
