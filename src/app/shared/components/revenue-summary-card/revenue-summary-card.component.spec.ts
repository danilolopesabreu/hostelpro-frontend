import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueSummaryCardComponent } from './revenue-summary-card.component';

describe('RevenueSummaryCardComponent', () => {
  let component: RevenueSummaryCardComponent;
  let fixture: ComponentFixture<RevenueSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate revenue change correctly', () => {
    component.totalRevenue = 128450;
    component.previousMonthRevenue = 115230;
    expect(component.revenueChange).toBe(13220);
  });

  it('should calculate revenue change percentage correctly', () => {
    component.totalRevenue = 128450;
    component.previousMonthRevenue = 115230;
    expect(component.revenueChangePercentage).toBeCloseTo(11.47, 1);
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(128450)).toBe('$128,450');
  });

  it('should determine change class correctly', () => {
    expect(component.getChangeClass(5.5)).toBe('positive');
    expect(component.getChangeClass(-2.3)).toBe('negative');
    expect(component.getChangeClass(0)).toBe('neutral');
  });
});