import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDemographicsSnapshotComponent } from './guest-demographics-snapshot.component';

describe('GuestDemographicsSnapshotComponent', () => {
  let component: GuestDemographicsSnapshotComponent;
  let fixture: ComponentFixture<GuestDemographicsSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDemographicsSnapshotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDemographicsSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total guests correctly', () => {
    expect(component.totalGuests).toBeGreaterThan(0);
  });

  it('should change view correctly', () => {
    component.changeView('origin');
    expect(component.selectedView).toBe('origin');
    expect(component.getViewTitle()).toBe('Guest Origin');
  });

  it('should return correct current data based on selected view', () => {
    component.selectedView = 'purpose';
    expect(component.currentData).toBe(component.purposeData);
    
    component.selectedView = 'origin';
    expect(component.currentData).toBe(component.originData);
    
    component.selectedView = 'age';
    expect(component.currentData).toBe(component.ageData);
  });
});