import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackColumnChartComponent } from './stack-column-chart.component';

describe('StackColumnChartComponent', () => {
  let component: StackColumnChartComponent;
  let fixture: ComponentFixture<StackColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackColumnChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
