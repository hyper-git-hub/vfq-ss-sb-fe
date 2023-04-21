import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulbFormComponent } from './bulb-form.component';

describe('BulbFormComponent', () => {
  let component: BulbFormComponent;
  let fixture: ComponentFixture<BulbFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulbFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulbFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
