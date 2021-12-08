import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHomepageComponent } from './report-homepage.component';

describe('ReportHomepageComponent', () => {
  let component: ReportHomepageComponent;
  let fixture: ComponentFixture<ReportHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
