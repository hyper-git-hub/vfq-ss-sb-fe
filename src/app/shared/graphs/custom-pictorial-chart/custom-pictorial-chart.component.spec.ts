import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPictorialChartComponent } from './custom-pictorial-chart.component';

describe('CustomPictorialChartComponent', () => {
  let component: CustomPictorialChartComponent;
  let fixture: ComponentFixture<CustomPictorialChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPictorialChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPictorialChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
