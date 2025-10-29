
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-guest-rating-card',
  imports: [MatCardModule, FeatherModule],
  templateUrl: './guest-rating-card.component.html',
  styleUrl: './guest-rating-card.component.scss',
})
export class GuestRatingCardComponent {
  satisfactionMetrics = [
    { category: 'Service Quality', rating: 4.8, reviews: 89 },
    { category: 'Room Cleanliness', rating: 4.7, reviews: 95 },
    { category: 'Staff Friendliness', rating: 4.9, reviews: 102 },
    { category: 'Food & Dining', rating: 4.4, reviews: 67 },
    { category: 'Amenities', rating: 4.5, reviews: 78 },
  ];
}
