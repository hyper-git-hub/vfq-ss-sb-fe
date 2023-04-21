import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTreemapComponent } from './simple-treemap.component';

describe('SimpleTreemapComponent', () => {
  let component: SimpleTreemapComponent;
  let fixture: ComponentFixture<SimpleTreemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTreemapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTreemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
