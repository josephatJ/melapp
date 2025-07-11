import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendedActivitiesComponent } from './attended-activities.component';

describe('AttendedActivitiesComponent', () => {
  let component: AttendedActivitiesComponent;
  let fixture: ComponentFixture<AttendedActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendedActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
