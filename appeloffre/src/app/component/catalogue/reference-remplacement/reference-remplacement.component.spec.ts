import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceRemplacementComponent } from './reference-remplacement.component';

describe('ReferenceRemplacementComponent', () => {
  let component: ReferenceRemplacementComponent;
  let fixture: ComponentFixture<ReferenceRemplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceRemplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceRemplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
