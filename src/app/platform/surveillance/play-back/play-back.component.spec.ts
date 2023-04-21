import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBackComponent } from './play-back.component';

describe('PlayBackComponent', () => {
  let component: PlayBackComponent;
  let fixture: ComponentFixture<PlayBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
