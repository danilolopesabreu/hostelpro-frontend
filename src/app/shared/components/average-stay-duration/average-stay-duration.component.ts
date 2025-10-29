import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';

export interface StayDurationData {
  period: string;
  averageDays: number;
  averageNights: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  guestCount: number;
}

@Component({
  selector: 'app-average-stay-duration',
  imports: [
    MatCardModule,
    CommonModule,
    FeatherModule,
  ],
  templateUrl: './average-stay-duration.component.html',
  styleUrl: './average-stay-duration.component.scss',
})
export class AverageStayDurationComponent {
  stayData: StayDurationData[] = [
    {
      period: 'This Week',
      averageDays: 3.2,
      averageNights: 2.2,
      change: 12.5,
      changeType: 'increase',
      guestCount: 45,
    },
    {
      period: 'Last Week',
      averageDays: 2.8,
      averageNights: 1.8,
      change: -5.2,
      changeType: 'decrease',
      guestCount: 52,
    },
    {
      period: 'This Month',
      averageDays: 3.0,
      averageNights: 2.0,
      change: 8.1,
      changeType: 'increase',
      guestCount: 187,
    },
  ];

  selectedPeriod: string = 'This Week';

  // Room type breakdown for current period
  roomTypeData = [
    { type: 'Standard', avgDays: 2.1, percentage: 35 },
    { type: 'Deluxe', avgDays: 3.8, percentage: 45 },
    { type: 'Suite', avgDays: 4.2, percentage: 20 },
  ];

  get currentStayData(): StayDurationData {
    return this.stayData.find(data => data.period === this.selectedPeriod) || this.stayData[0];
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }

  getChangeIcon(): string {
    switch (this.currentStayData.changeType) {
      case 'increase':
        return 'trending-up';
      case 'decrease':
        return 'trending-down';
      case 'stable':
        return 'minus';
      default:
        return 'minus';
    }
  }

  getChangeClass(): string {
    switch (this.currentStayData.changeType) {
      case 'increase':
        return 'change-positive';
      case 'decrease':
        return 'change-negative';
      case 'stable':
        return 'change-neutral';
      default:
        return 'change-neutral';
    }
  }

  formatDuration(days: number): string {
    const wholeDays = Math.floor(days);
    const hours = Math.round((days - wholeDays) * 24);
    
    if (wholeDays === 0) {
      return `${hours}h`;
    } else if (hours === 0) {
      return `${wholeDays}d`;
    } else {
      return `${wholeDays}d ${hours}h`;
    }
  }

  getAbsoluteChange(): number {
    return Math.abs(this.currentStayData.change);
  }
}