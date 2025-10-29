import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyForecastMiniComponent } from './occupancy-forecast-mini.component';

describe('OccupancyForecastMiniComponent', () => {
  let component: OccupancyForecastMiniComponent;
  let fixture: ComponentFixture<OccupancyForecastMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OccupancyForecastMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupancyForecastMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate average occupancy correctly', () => {
    const expectedAverage = Math.round(
      component.forecastData.reduce((sum, data) => sum + data.occupancyRate, 0) / 
      component.forecastData.length
    );
    expect(component.averageOccupancy).toBe(expectedAverage);
  });

  it('should find peak day correctly', () => {
    const peak = component.peakDay;
    expect(peak.occupancyRate).toBe(98);
    expect(peak.date).toBe('Fri');
  });

  it('should find lowest day correctly', () => {
    const lowest = component.lowestDay;
    expect(lowest.occupancyRate).toBe(76);
    expect(lowest.date).toBe('Sun');
  });

  it('should get correct occupancy status', () => {
    expect(component.getOccupancyStatus(98)).toBe('Very High');
    expect(component.getOccupancyStatus(87)).toBe('High');
    expect(component.getOccupancyStatus(75)).toBe('Moderate');
    expect(component.getOccupancyStatus(55)).toBe('Low');
    expect(component.getOccupancyStatus(45)).toBe('Very Low');
  });

  it('should get correct occupancy class', () => {
    expect(component.getOccupancyClass(98)).toBe('occupancy-very-high');
    expect(component.getOccupancyClass(87)).toBe('occupancy-high');
    expect(component.getOccupancyClass(75)).toBe('occupancy-moderate');
    expect(component.getOccupancyClass(55)).toBe('occupancy-low');
    expect(component.getOccupancyClass(45)).toBe('occupancy-very-low');
  });
});