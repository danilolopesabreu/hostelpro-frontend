import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRatingCardComponent } from './guest-rating-card.component';

describe('GuestRatingCardComponent', () => {
  let component: GuestRatingCardComponent;
  let fixture: ComponentFixture<GuestRatingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestRatingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestRatingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
