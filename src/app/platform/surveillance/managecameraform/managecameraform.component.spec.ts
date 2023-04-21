import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecameraformComponent } from './managecameraform.component';

describe('ManagecameraformComponent', () => {
  let component: ManagecameraformComponent;
  let fixture: ComponentFixture<ManagecameraformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagecameraformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagecameraformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
