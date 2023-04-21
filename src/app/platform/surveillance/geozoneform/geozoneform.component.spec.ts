import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeozoneformComponent } from './geozoneform.component';

describe('GeozoneformComponent', () => {
  let component: GeozoneformComponent;
  let fixture: ComponentFixture<GeozoneformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeozoneformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeozoneformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
