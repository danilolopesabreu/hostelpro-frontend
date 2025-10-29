import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSatisfactionChartComponent } from './guest-satisfaction-chart.component';

describe('GuestSatisfactionChartComponent', () => {
  let component: GuestSatisfactionChartComponent;
  let fixture: ComponentFixture<GuestSatisfactionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestSatisfactionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestSatisfactionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate trend direction correctly', () => {
    component.monthlyGrowth = 8.5;
    expect(component.trendDirection).toBe('up');
    
    component.monthlyGrowth = -3.2;
    expect(component.trendDirection).toBe('down');
  });

  it('should have satisfaction metrics', () => {
    expect(component.satisfactionMetrics.length).toBeGreaterThan(0);
    expect(component.satisfactionMetrics[0]).toHaveProperty('category');
    expect(component.satisfactionMetrics[0]).toHaveProperty('rating');
    expect(component.satisfactionMetrics[0]).toHaveProperty('reviews');
  });
});