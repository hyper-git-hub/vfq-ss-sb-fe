import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Building1Component } from './building1.component';

describe('Building1Component', () => {
  let component: Building1Component;
  let fixture: ComponentFixture<Building1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Building1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Building1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
