import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomStatusOverviewComponent } from './room-status-overview.component';

describe('RoomStatusOverviewComponent', () => {
  let component: RoomStatusOverviewComponent;
  let fixture: ComponentFixture<RoomStatusOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomStatusOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomStatusOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate occupancy rate correctly', () => {
    component.roomStatuses = [
      { status: 'Occupied', count: 80, percentage: 67, color: '#4CAF50', icon: 'user' },
      { status: 'Available', count: 40, percentage: 33, color: '#2196F3', icon: 'check-circle' }
    ];
    component.totalRooms = 120;
    
    expect(component.occupancyRate).toBe(67);
  });

  it('should have room statuses defined', () => {
    expect(component.roomStatuses.length).toBeGreaterThan(0);
    expect(component.roomStatuses[0]).toHaveProperty('status');
    expect(component.roomStatuses[0]).toHaveProperty('count');
    expect(component.roomStatuses[0]).toHaveProperty('percentage');
  });

  it('should have room types defined', () => {
    expect(component.roomTypes.length).toBeGreaterThan(0);
    expect(component.roomTypes[0]).toHaveProperty('type');
    expect(component.roomTypes[0]).toHaveProperty('occupied');
    expect(component.roomTypes[0]).toHaveProperty('total');
  });
});