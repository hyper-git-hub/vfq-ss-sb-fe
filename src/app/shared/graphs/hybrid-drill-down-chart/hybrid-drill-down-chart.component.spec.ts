import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HybridDrillDownChartComponent } from './hybrid-drill-down-chart.component';

describe('HybridDrillDownChartComponent', () => {
  let component: HybridDrillDownChartComponent;
  let fixture: ComponentFixture<HybridDrillDownChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HybridDrillDownChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HybridDrillDownChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
