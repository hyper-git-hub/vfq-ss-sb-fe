import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupFormComponent } from './add-group-form.component';

describe('AddGroupFormComponent', () => {
  let component: AddGroupFormComponent;
  let fixture: ComponentFixture<AddGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
