import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeatherModule } from 'angular-feather';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';

export interface GeographicData {
  country: string;
  countryCode: string;
  bookings: number;
  revenue: number;
  percentage: number;
  flag: string;
  growth: number;
}

@Component({
  selector: 'app-geographic-source',
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    FeatherModule,
    MatProgressBarModule,
    NgScrollbar,
  ],
  templateUrl: './geographic-source.component.html',
  styleUrl: './geographic-source.component.scss',
})
export class GeographicSourceComponent {
  geographicData: GeographicData[] = [
    {
      country: 'United States',
      countryCode: 'US',
      bookings: 245,
      revenue: 89450,
      percentage: 35.2,
      flag: '🇺🇸',
      growth: 12.5,
    },
    {
      country: 'United Kingdom',
      countryCode: 'GB',
      bookings: 156,
      revenue: 67890,
      percentage: 22.4,
      flag: '🇬🇧',
      growth: 8.3,
    },
    {
      country: 'Germany',
      countryCode: 'DE',
      bookings: 134,
      revenue: 52340,
      percentage: 19.3,
      flag: '🇩🇪',
      growth: -2.1,
    },
    {
      country: 'France',
      countryCode: 'FR',
      bookings: 89,
      revenue: 34567,
      percentage: 12.8,
      flag: '🇫🇷',
      growth: 15.7,
    },
    {
      country: 'Canada',
      countryCode: 'CA',
      bookings: 67,
      revenue: 28900,
      percentage: 9.6,
      flag: '🇨🇦',
      growth: 5.4,
    },
    {
      country: 'Australia',
      countryCode: 'AU',
      bookings: 45,
      revenue: 19870,
      percentage: 6.5,
      flag: '🇦🇺',
      growth: 22.1,
    },
    {
      country: 'Japan',
      countryCode: 'JP',
      bookings: 34,
      revenue: 15680,
      percentage: 4.9,
      flag: '🇯🇵',
      growth: 18.9,
    },
    {
      country: 'Others',
      countryCode: 'XX',
      bookings: 78,
      revenue: 23450,
      percentage: 11.2,
      flag: '🌍',
      growth: 7.8,
    },
  ];

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getGrowthClass(growth: number): string {
    return growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral';
  }

  getGrowthIcon(growth: number): string {
    return growth > 0 ? 'trending-up' : growth < 0 ? 'trending-down' : 'minus';
  }

  getProgressBarColor(index: number): string {
    const colors = [
      '#4E73DF',
      '#1CC88A',
      '#36B9CC',
      '#F6C23E',
      '#E74A3B',
      '#858796',
      '#5A5C69',
      '#6c757d',
    ];
    return colors[index % colors.length];
  }

  getGrowthMarketsCount(): number {
    return this.geographicData.filter((c) => c.growth > 10).length;
  }
}
