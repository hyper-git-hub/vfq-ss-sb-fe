import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureDetailComponent } from './temperature-detail.component';

describe('TemperatureDetailComponent', () => {
  let component: TemperatureDetailComponent;
  let fixture: ComponentFixture<TemperatureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
