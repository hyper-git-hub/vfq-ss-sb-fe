import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketScheduleFormComponent } from './socket-schedule-form.component';

describe('SocketScheduleFormComponent', () => {
  let component: SocketScheduleFormComponent;
  let fixture: ComponentFixture<SocketScheduleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocketScheduleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
