import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniRevenueComparisonComponent } from './mini-revenue-comparison.component';

describe('MiniRevenueComparisonComponent', () => {
  let component: MiniRevenueComparisonComponent;
  let fixture: ComponentFixture<MiniRevenueComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniRevenueComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniRevenueComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate weekly change correctly', () => {
    component.todayRevenue = 12000;
    component.lastWeekRevenue = 10000;
    expect(component.weeklyChange).toBe(20);
  });

  it('should calculate yearly change correctly', () => {
    component.todayRevenue = 11000;
    component.lastYearRevenue = 10000;
    expect(component.yearlyChange).toBe(10);
  });
});