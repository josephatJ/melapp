import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesAndFeedbackComponent } from './messages-and-feedback.component';

describe('MessagesAndFeedbackComponent', () => {
  let component: MessagesAndFeedbackComponent;
  let fixture: ComponentFixture<MessagesAndFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesAndFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesAndFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
