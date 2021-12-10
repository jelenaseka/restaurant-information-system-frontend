import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegisteredUserDialogComponent } from './add-registered-user-dialog.component';

describe('AddManagerDialogComponent', () => {
  let component: AddRegisteredUserDialogComponent;
  let fixture: ComponentFixture<AddRegisteredUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegisteredUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegisteredUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
