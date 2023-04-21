import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketMainFormComponent } from './socket-main-form.component';

describe('SocketMainFormComponent', () => {
  let component: SocketMainFormComponent;
  let fixture: ComponentFixture<SocketMainFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocketMainFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketMainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
