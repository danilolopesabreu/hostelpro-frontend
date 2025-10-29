import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessCardComponent } from './quick-access-card.component';

describe('QuickAccessCardComponent', () => {
  let component: QuickAccessCardComponent;
  let fixture: ComponentFixture<QuickAccessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccessCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAccessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 8 quick access items', () => {
    expect(component.quickAccessItems.length).toBe(8);
  });

  it('should handle quick access click', () => {
    spyOn(console, 'log');
    const testItem = component.quickAccessItems[0];
    component.onQuickAccessClick(testItem);
    expect(console.log).toHaveBeenCalledWith(`Navigating to ${testItem.route}`);
  });
});