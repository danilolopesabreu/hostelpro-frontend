import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageStayDurationComponent } from './average-stay-duration.component';

describe('AverageStayDurationComponent', () => {
  let component: AverageStayDurationComponent;
  let fixture: ComponentFixture<AverageStayDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageStayDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageStayDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(3.2)).toBe('3d 5h');
    expect(component.formatDuration(1.0)).toBe('1d');
    expect(component.formatDuration(0.5)).toBe('12h');
  });

  it('should get correct change icon', () => {
    component.selectedPeriod = 'This Week';
    expect(component.getChangeIcon()).toBe('trending-up');
  });

  it('should change period correctly', () => {
    component.changePeriod('Last Week');
    expect(component.selectedPeriod).toBe('Last Week');
    expect(component.currentStayData.period).toBe('Last Week');
  });
});