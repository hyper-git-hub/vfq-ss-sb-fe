import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneComponent } from './geozone.component';

describe('GeozoneComponent', () => {
  let component: GeozoneComponent;
  let fixture: ComponentFixture<GeozoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeozoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
