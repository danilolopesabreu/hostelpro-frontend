import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeatherModule } from 'angular-feather';
import { MatDividerModule } from '@angular/material/divider';

export interface RevenueCategory {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
  change: number;
}

@Component({
  selector: 'app-revenue-summary-card',
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    FeatherModule,
    MatDividerModule
  ],
  templateUrl: './revenue-summary-card.component.html',
  styleUrl: './revenue-summary-card.component.scss',
})
export class RevenueSummaryCardComponent {
  totalRevenue: number = 128450;
  previousMonthRevenue: number = 115230;
  
  revenueCategories: RevenueCategory[] = [
    {
      name: 'Room Bookings',
      amount: 89520,
      percentage: 69.7,
      icon: 'home',
      color: '#4E73DF',
      change: 8.5
    },
    {
      name: 'Food & Beverage',
      amount: 23680,
      percentage: 18.4,
      icon: 'coffee',
      color: '#1CC88A',
      change: 12.3
    },
    {
      name: 'Spa & Wellness',
      amount: 8750,
      percentage: 6.8,
      icon: 'heart',
      color: '#36B9CC',
      change: -2.1
    },
    {
      name: 'Other Services',
      amount: 6500,
      percentage: 5.1,
      icon: 'more-horizontal',
      color: '#F6C23E',
      change: 5.7
    }
  ];

  get revenueChange(): number {
    return this.totalRevenue - this.previousMonthRevenue;
  }

  get revenueChangePercentage(): number {
    return (this.revenueChange / this.previousMonthRevenue) * 100;
  }

  get isPositiveChange(): boolean {
    return this.revenueChange > 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getChangeIcon(change: number): string {
    return change > 0 ? 'trending-up' : change < 0 ? 'trending-down' : 'minus';
  }

  getChangeClass(change: number): string {
    return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  }
}