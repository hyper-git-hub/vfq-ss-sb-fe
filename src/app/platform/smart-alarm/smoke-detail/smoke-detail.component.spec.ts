import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokeDetailComponent } from './smoke-detail.component';

describe('SmokeDetailComponent', () => {
  let component: SmokeDetailComponent;
  let fixture: ComponentFixture<SmokeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmokeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmokeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
