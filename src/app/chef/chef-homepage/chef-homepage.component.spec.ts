import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefHomepageComponent } from './chef-homepage.component';

describe('ChefHomepageComponent', () => {
  let component: ChefHomepageComponent;
  let fixture: ComponentFixture<ChefHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChefHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
