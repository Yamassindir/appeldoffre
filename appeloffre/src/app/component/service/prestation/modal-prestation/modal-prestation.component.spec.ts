import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrestationComponent } from './modal-prestation.component';

describe('ModalPrestationComponent', () => {
  let component: ModalPrestationComponent;
  let fixture: ComponentFixture<ModalPrestationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrestationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
