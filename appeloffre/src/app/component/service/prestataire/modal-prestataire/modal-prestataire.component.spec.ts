import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrestataireComponent } from './modal-prestataire.component';

describe('ModalPrestataireComponent', () => {
  let component: ModalPrestataireComponent;
  let fixture: ComponentFixture<ModalPrestataireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrestataireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrestataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
