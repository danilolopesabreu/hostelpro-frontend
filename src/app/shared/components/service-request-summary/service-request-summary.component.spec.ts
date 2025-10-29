import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestSummaryComponent } from './service-request-summary.component';

describe('ServiceRequestSummaryComponent', () => {
  let component: ServiceRequestSummaryComponent;
  let fixture: ComponentFixture<ServiceRequestSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate pending requests correctly', () => {
    expect(component.pendingRequests.length).toBe(3);
  });

  it('should calculate in progress requests correctly', () => {
    expect(component.inProgressRequests.length).toBe(2);
  });

  it('should calculate high priority requests correctly', () => {
    expect(component.highPriorityRequests.length).toBe(2);
  });

  it('should get correct service icon', () => {
    expect(component.getServiceIcon('room_service')).toBe('coffee');
    expect(component.getServiceIcon('maintenance')).toBe('tool');
    expect(component.getServiceIcon('cleaning')).toBe('shield');
  });

  it('should format time ago correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    expect(component.formatTimeAgo(fiveMinutesAgo)).toBe('5m ago');
  });
});