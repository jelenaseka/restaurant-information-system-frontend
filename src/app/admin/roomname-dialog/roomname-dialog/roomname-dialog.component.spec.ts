import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomnameDialogComponent } from './roomname-dialog.component';

describe('RoomnameDialogComponent', () => {
  let component: RoomnameDialogComponent;
  let fixture: ComponentFixture<RoomnameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomnameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomnameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
