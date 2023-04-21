import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsIconCardSmartComponent } from './stats-icon-card-smart.component';

describe('StatsIconCardSmartComponent', () => {
  let component: StatsIconCardSmartComponent;
  let fixture: ComponentFixture<StatsIconCardSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsIconCardSmartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsIconCardSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
