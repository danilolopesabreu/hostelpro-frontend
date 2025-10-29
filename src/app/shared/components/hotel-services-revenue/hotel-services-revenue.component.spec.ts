import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelServicesRevenueComponent } from './hotel-services-revenue.component';

describe('HotelServicesRevenueComponent', () => {
  let component: HotelServicesRevenueComponent;
  let fixture: ComponentFixture<HotelServicesRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelServicesRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelServicesRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have services revenue data', () => {
    expect(component.servicesRevenue.length).toBeGreaterThan(0);
    expect(component.servicesRevenue[0]).toHaveProperty('service');
    expect(component.servicesRevenue[0]).toHaveProperty('revenue');
    expect(component.servicesRevenue[0]).toHaveProperty('percentage');
    expect(component.servicesRevenue[0]).toHaveProperty('growth');
  });

  it('should find top growth service correctly', () => {
    component.servicesRevenue = [
      { service: 'Service 1', revenue: 1000, percentage: 50, growth: 10, color: '#000', icon: 'home' },
      { service: 'Service 2', revenue: 1000, percentage: 50, growth: 20, color: '#000', icon: 'home' }
    ];
    
    expect(component.topGrowthService.service).toBe('Service 2');
    expect(component.topGrowthService.growth).toBe(20);
  });

  it('should calculate total revenue from services', () => {
    const calculatedTotal = component.servicesRevenue.reduce((sum, service) => sum + service.revenue, 0);
    expect(calculatedTotal).toBeLessThanOrEqual(component.totalRevenue);
  });
});