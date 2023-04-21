import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFilterComponent } from './device-filter.component';

describe('DeviceFilterComponent', () => {
  let component: DeviceFilterComponent;
  let fixture: ComponentFixture<DeviceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
