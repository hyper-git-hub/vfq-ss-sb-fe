import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyMeterDetailsComponent } from './energy-meter-details.component';

describe('EnergyMeterDetailsComponent', () => {
  let component: EnergyMeterDetailsComponent;
  let fixture: ComponentFixture<EnergyMeterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyMeterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyMeterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
