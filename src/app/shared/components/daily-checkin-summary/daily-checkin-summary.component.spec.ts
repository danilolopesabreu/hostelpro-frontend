import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCheckinSummaryComponent } from './daily-checkin-summary.component';

describe('DailyCheckinSummaryComponent', () => {
  let component: DailyCheckinSummaryComponent;
  let fixture: ComponentFixture<DailyCheckinSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCheckinSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCheckinSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate check-in change correctly', () => {
    component.todayCheckIns = 25;
    component.yesterdayCheckIns = 20;
    expect(component.checkInChange).toBe(5);
  });

  it('should calculate check-out change correctly', () => {
    component.todayCheckOuts = 18;
    component.yesterdayCheckOuts = 22;
    expect(component.checkOutChange).toBe(-4);
  });

  it('should calculate percentage changes correctly', () => {
    component.todayCheckIns = 24;
    component.yesterdayCheckIns = 20;
    component.todayCheckOuts = 18;
    component.yesterdayCheckOuts = 15;

    expect(component.checkInChangePercentage).toBe(20);
    expect(component.checkOutChangePercentage).toBe(20);
  });

  it('should format current date', () => {
    expect(component.currentDate).toContain('2025');
  });
});