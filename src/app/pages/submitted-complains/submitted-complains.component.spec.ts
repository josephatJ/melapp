import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedComplainsComponent } from './submitted-complains.component';

describe('SubmittedComplainsComponent', () => {
  let component: SubmittedComplainsComponent;
  let fixture: ComponentFixture<SubmittedComplainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedComplainsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedComplainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
