import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffListPayrollComponent } from './staff-list-payroll.component';

describe('StaffListPayrollComponent', () => {
  let component: StaffListPayrollComponent;
  let fixture: ComponentFixture<StaffListPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffListPayrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffListPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
