import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSelectUserComponent } from './ngx-select-user.component';

describe('NgxSelectUserComponent', () => {
  let component: NgxSelectUserComponent;
  let fixture: ComponentFixture<NgxSelectUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSelectUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSelectUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
