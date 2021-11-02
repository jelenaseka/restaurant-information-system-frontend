import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterHomepageComponent } from './waiter-homepage.component';

describe('WaiterHomepageComponent', () => {
  let component: WaiterHomepageComponent;
  let fixture: ComponentFixture<WaiterHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaiterHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
