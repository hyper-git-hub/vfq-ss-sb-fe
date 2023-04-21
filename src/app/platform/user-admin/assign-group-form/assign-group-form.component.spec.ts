import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupFormComponent } from './assign-group-form.component';

describe('AssignGroupFormComponent', () => {
  let component: AssignGroupFormComponent;
  let fixture: ComponentFixture<AssignGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
