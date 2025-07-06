import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbpsTrackerComponent } from './sbps-tracker.component';

describe('SbpsTrackerComponent', () => {
  let component: SbpsTrackerComponent;
  let fixture: ComponentFixture<SbpsTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbpsTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SbpsTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
