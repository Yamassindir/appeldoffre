import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMaintenanceComponent } from './modal-maintenance.component';

describe('ModalMaintenanceComponent', () => {
  let component: ModalMaintenanceComponent;
  let fixture: ComponentFixture<ModalMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
