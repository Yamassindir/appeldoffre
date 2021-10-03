import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCatalogueComponent } from './modal-catalogue.component';

describe('ModalCatalogueComponent', () => {
  let component: ModalCatalogueComponent;
  let fixture: ComponentFixture<ModalCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
