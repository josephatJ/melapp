import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffManagementFormComponent } from './staff-management-form.component';

describe('StaffManagementFormComponent', () => {
  let component: StaffManagementFormComponent;
  let fixture: ComponentFixture<StaffManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffManagementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
