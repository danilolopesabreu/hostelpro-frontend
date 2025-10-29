import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTrendsChartComponent } from './booking-trends-chart.component';

describe('BookingTrendsChartComponent', () => {
  let component: BookingTrendsChartComponent;
  let fixture: ComponentFixture<BookingTrendsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTrendsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingTrendsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change period correctly', () => {
    component.changePeriod('7days');
    expect(component.selectedPeriod).toBe('7days');
  });

  it('should calculate total bookings correctly', () => {
    expect(component.totalBookings).toBeGreaterThan(0);
  });

  it('should calculate average bookings correctly', () => {
    expect(component.averageBookings).toBeGreaterThan(0);
  });
});