import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedTimesheetsComponent } from './submitted-timesheets.component';

describe('SubmittedTimesheetsComponent', () => {
  let component: SubmittedTimesheetsComponent;
  let fixture: ComponentFixture<SubmittedTimesheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedTimesheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
