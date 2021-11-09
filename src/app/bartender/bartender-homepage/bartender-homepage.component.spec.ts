import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderHomepageComponent } from './bartender-homepage.component';

describe('BartenderHomepageComponent', () => {
  let component: BartenderHomepageComponent;
  let fixture: ComponentFixture<BartenderHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BartenderHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BartenderHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
