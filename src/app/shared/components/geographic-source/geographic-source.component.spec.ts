import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicSourceComponent } from './geographic-source.component';

describe('GeographicSourceComponent', () => {
  let component: GeographicSourceComponent;
  let fixture: ComponentFixture<GeographicSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeographicSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total bookings correctly', () => {
    expect(component.totalBookings).toBeGreaterThan(0);
  });

  it('should calculate total revenue correctly', () => {
    expect(component.totalRevenue).toBeGreaterThan(0);
  });

  it('should identify top country correctly', () => {
    expect(component.topCountry).toBeDefined();
    expect(component.topCountry.country).toBeTruthy();
  });

  it('should calculate average booking value correctly', () => {
    expect(component.averageBookingValue).toBeGreaterThan(0);
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(89450)).toBe('$89,450');
  });

  it('should return correct growth class', () => {
    expect(component.getGrowthClass(12.5)).toBe('positive');
    expect(component.getGrowthClass(-2.1)).toBe('negative');
    expect(component.getGrowthClass(0)).toBe('neutral');
  });

  it('should return correct growth icon', () => {
    expect(component.getGrowthIcon(12.5)).toBe('trending-up');
    expect(component.getGrowthIcon(-2.1)).toBe('trending-down');
    expect(component.getGrowthIcon(0)).toBe('minus');
  });
});