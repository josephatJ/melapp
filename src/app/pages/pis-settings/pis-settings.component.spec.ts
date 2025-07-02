import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PisSettingsComponent } from './pis-settings.component';

describe('PisSettingsComponent', () => {
  let component: PisSettingsComponent;
  let fixture: ComponentFixture<PisSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PisSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PisSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
