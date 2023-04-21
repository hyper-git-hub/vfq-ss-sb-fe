import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSettingsComponent } from './card-settings.component';

describe('CardSettingsComponent', () => {
  let component: CardSettingsComponent;
  let fixture: ComponentFixture<CardSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
