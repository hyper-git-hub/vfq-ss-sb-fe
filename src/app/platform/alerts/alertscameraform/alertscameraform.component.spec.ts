import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertscameraformComponent } from './alertscameraform.component';

describe('AlertscameraformComponent', () => {
  let component: AlertscameraformComponent;
  let fixture: ComponentFixture<AlertscameraformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertscameraformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertscameraformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
