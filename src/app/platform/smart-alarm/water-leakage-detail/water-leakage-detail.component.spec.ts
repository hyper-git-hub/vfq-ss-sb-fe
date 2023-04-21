import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterLeakageDetailComponent } from './water-leakage-detail.component';

describe('WaterLeakageDetailComponent', () => {
  let component: WaterLeakageDetailComponent;
  let fixture: ComponentFixture<WaterLeakageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterLeakageDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterLeakageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
