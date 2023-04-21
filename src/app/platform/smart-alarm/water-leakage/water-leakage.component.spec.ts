import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterLeakageComponent } from './water-leakage.component';

describe('WaterLeakageComponent', () => {
  let component: WaterLeakageComponent;
  let fixture: ComponentFixture<WaterLeakageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterLeakageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterLeakageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
