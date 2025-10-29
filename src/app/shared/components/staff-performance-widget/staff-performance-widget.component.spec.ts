import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPerformanceWidgetComponent } from './staff-performance-widget.component';

describe('StaffPerformanceWidgetComponent', () => {
  let component: StaffPerformanceWidgetComponent;
  let fixture: ComponentFixture<StaffPerformanceWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPerformanceWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPerformanceWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate average performance correctly', () => {
    component.departmentStats = [
      { department: 'Test1', avgPerformance: 80, staffCount: 5, completionRate: 90 },
      { department: 'Test2', avgPerformance: 90, staffCount: 3, completionRate: 95 }
    ];
    
    expect(component.averagePerformance).toBe(85);
  });

  it('should calculate total staff correctly', () => {
    component.departmentStats = [
      { department: 'Test1', avgPerformance: 80, staffCount: 5, completionRate: 90 },
      { department: 'Test2', avgPerformance: 90, staffCount: 3, completionRate: 95 }
    ];
    
    expect(component.totalStaff).toBe(8);
  });

  it('should return correct performance color', () => {
    expect(component.getPerformanceColor(95)).toBe('#4CAF50');
    expect(component.getPerformanceColor(85)).toBe('#FF9800');
    expect(component.getPerformanceColor(75)).toBe('#FFC107');
    expect(component.getPerformanceColor(65)).toBe('#f44336');
  });
});