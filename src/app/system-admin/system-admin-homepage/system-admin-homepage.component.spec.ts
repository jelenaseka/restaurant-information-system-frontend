import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminHomepageComponent } from './system-admin-homepage.component';

describe('SystemAdminHomepageComponent', () => {
  let component: SystemAdminHomepageComponent;
  let fixture: ComponentFixture<SystemAdminHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAdminHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
