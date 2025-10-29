import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyRateWidgetComponent } from './occupancy-rate-widget.component';

describe('OccupancyRateWidgetComponent', () => {
  let component: OccupancyRateWidgetComponent;
  let fixture: ComponentFixture<OccupancyRateWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccupancyRateWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupancyRateWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate rate change correctly', () => {
    component.currentOccupancyRate = 78.5;
    component.previousMonthRate = 72.3;
    expect(component.rateChange).toBeCloseTo(6.2, 1);
  });

  it('should determine positive change correctly', () => {
    component.currentOccupancyRate = 78.5;
    component.previousMonthRate = 72.3;
    expect(component.isPositiveChange).toBe(true);
  });
});