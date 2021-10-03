import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutRefRempComponent } from './ajout-ref-remp.component';

describe('AjoutRefRempComponent', () => {
  let component: AjoutRefRempComponent;
  let fixture: ComponentFixture<AjoutRefRempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutRefRempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutRefRempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
