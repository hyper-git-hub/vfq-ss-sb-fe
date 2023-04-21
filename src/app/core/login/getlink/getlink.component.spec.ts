import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetlinkComponent } from './getlink.component';

describe('GetlinkComponent', () => {
  let component: GetlinkComponent;
  let fixture: ComponentFixture<GetlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetlinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
