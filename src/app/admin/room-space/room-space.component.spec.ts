import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSpaceComponent } from './room-space.component';

describe('RoomSpaceComponent', () => {
  let component: RoomSpaceComponent;
  let fixture: ComponentFixture<RoomSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
