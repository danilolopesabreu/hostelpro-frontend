import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-daily-checkin-summary',
  imports: [
    MatCardModule,
    CommonModule,
    FeatherModule
  ],
  templateUrl: './daily-checkin-summary.component.html',
  styleUrl: './daily-checkin-summary.component.scss',
})
export class DailyCheckinSummaryComponent {
  todayCheckIns: number = 24;
  todayCheckOuts: number = 18;
  yesterdayCheckIns: number = 21;
  yesterdayCheckOuts: number = 16;

  get checkInChange(): number {
    return this.todayCheckIns - this.yesterdayCheckIns;
  }

  get checkOutChange(): number {
    return this.todayCheckOuts - this.yesterdayCheckOuts;
  }

  get checkInChangePercentage(): number {
    return (this.checkInChange / this.yesterdayCheckIns) * 100;
  }

  get checkOutChangePercentage(): number {
    return (this.checkOutChange / this.yesterdayCheckOuts) * 100;
  }

  get currentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}