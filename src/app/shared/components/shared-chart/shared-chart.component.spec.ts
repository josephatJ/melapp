import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedChartComponent } from './shared-chart.component';

describe('SharedChartComponent', () => {
  let component: SharedChartComponent;
  let fixture: ComponentFixture<SharedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
