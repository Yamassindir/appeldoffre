import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationDemandeComponent } from './creation-demande.component';

describe('CreationDemandeComponent', () => {
  let component: CreationDemandeComponent;
  let fixture: ComponentFixture<CreationDemandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationDemandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
