import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictorialFractionChartComponent } from './pictorial-fraction-chart.component';

describe('PictorialFractionChartComponent', () => {
  let component: PictorialFractionChartComponent;
  let fixture: ComponentFixture<PictorialFractionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PictorialFractionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PictorialFractionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
