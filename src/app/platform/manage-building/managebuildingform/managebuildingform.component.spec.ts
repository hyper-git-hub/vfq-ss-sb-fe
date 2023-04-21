import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagebuildingformComponent } from './managebuildingform.component';

describe('ManagebuildingformComponent', () => {
  let component: ManagebuildingformComponent;
  let fixture: ComponentFixture<ManagebuildingformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagebuildingformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagebuildingformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
