import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauxCatalogueComponent } from './nouveaux-catalogue.component';

describe('NouveauxCatalogueComponent', () => {
  let component: NouveauxCatalogueComponent;
  let fixture: ComponentFixture<NouveauxCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouveauxCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouveauxCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
