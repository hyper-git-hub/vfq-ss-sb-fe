import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulbDetailComponent } from './bulb-detail.component';

describe('BulbDetailComponent', () => {
  let component: BulbDetailComponent;
  let fixture: ComponentFixture<BulbDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulbDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulbDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
