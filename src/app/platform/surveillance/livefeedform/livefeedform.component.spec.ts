import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivefeedformComponent } from './livefeedform.component';

describe('LivefeedformComponent', () => {
  let component: LivefeedformComponent;
  let fixture: ComponentFixture<LivefeedformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivefeedformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivefeedformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
