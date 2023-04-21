import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsCamerasComponent } from './alerts-cameras.component';

describe('AlertsCamerasComponent', () => {
  let component: AlertsCamerasComponent;
  let fixture: ComponentFixture<AlertsCamerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsCamerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsCamerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
