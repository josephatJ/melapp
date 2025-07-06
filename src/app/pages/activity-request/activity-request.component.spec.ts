import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRequestComponent } from './activity-request.component';

describe('ActivityRequestComponent', () => {
  let component: ActivityRequestComponent;
  let fixture: ComponentFixture<ActivityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
