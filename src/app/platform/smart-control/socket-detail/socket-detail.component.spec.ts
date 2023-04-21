import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketDetailComponent } from './socket-detail.component';

describe('SocketDetailComponent', () => {
  let component: SocketDetailComponent;
  let fixture: ComponentFixture<SocketDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocketDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
