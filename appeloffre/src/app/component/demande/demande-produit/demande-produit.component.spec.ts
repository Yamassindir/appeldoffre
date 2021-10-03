import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeProduitComponent } from './demande-produit.component';

describe('DemandeProduitComponent', () => {
  let component: DemandeProduitComponent;
  let fixture: ComponentFixture<DemandeProduitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeProduitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
