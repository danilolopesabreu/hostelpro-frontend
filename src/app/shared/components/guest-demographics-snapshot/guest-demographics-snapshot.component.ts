import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FeatherModule } from 'angular-feather';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexTooltip,
  ApexFill,
} from 'ng-apexcharts';

export interface DemographicsChartOptions {
  series: number[];
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
}

export interface DemographicData {
  category: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-guest-demographics-snapshot',
  imports: [MatCardModule, FeatherModule, NgApexchartsModule],
  templateUrl: './guest-demographics-snapshot.component.html',
  styleUrl: './guest-demographics-snapshot.component.scss',
})
export class GuestDemographicsSnapshotComponent {
  public chartOptions!: Partial<DemographicsChartOptions>;

  // Purpose demographics
  purposeData: DemographicData[] = [
    {
      category: 'Business',
      value: 156,
      percentage: 62,
      color: '#007bff',
      icon: 'briefcase',
    },
    {
      category: 'Leisure',
      value: 96,
      percentage: 38,
      color: '#28a745',
      icon: 'sun',
    },
  ];

  // Origin demographics
  originData: DemographicData[] = [
    {
      category: 'Local',
      value: 78,
      percentage: 31,
      color: '#ffc107',
      icon: 'map-pin',
    },
    {
      category: 'Domestic',
      value: 124,
      percentage: 49,
      color: '#17a2b8',
      icon: 'navigation',
    },
    {
      category: 'International',
      value: 50,
      percentage: 20,
      color: '#6f42c1',
      icon: 'globe',
    },
  ];

  // Age group demographics
  ageData: DemographicData[] = [
    {
      category: '18-30',
      value: 63,
      percentage: 25,
      color: '#20c997',
      icon: 'users',
    },
    {
      category: '31-45',
      value: 101,
      percentage: 40,
      color: '#fd7e14',
      icon: 'user',
    },
    {
      category: '46-60',
      value: 63,
      percentage: 25,
      color: '#e83e8c',
      icon: 'user-check',
    },
    {
      category: '60+',
      value: 25,
      percentage: 10,
      color: '#6c757d',
      icon: 'user-plus',
    },
  ];

  selectedView: 'purpose' | 'origin' | 'age' = 'purpose';

  constructor() {
    this.initChart();
  }

  get currentData(): DemographicData[] {
    switch (this.selectedView) {
      case 'purpose':
        return this.purposeData;
      case 'origin':
        return this.originData;
      case 'age':
        return this.ageData;
      default:
        return this.purposeData;
    }
  }

  get totalGuests(): number {
    return this.currentData.reduce((sum, item) => sum + item.value, 0);
  }

  changeView(view: 'purpose' | 'origin' | 'age'): void {
    this.selectedView = view;
    this.updateChart();
  }

  private initChart(): void {
    this.chartOptions = {
      series: this.currentData.map((item) => item.value),
      chart: {
        type: 'donut',
        height: 215,
        toolbar: {
          show: false,
        },
      },
      labels: this.currentData.map((item) => item.category),
      colors: this.currentData.map((item) => item.color),
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Guests',
                fontSize: '12px',
                fontWeight: 500,
                color: '#6c757d',
                formatter: () => {
                  return this.totalGuests.toString();
                },
              },
              value: {
                show: true,
                fontSize: '18px',
                fontWeight: 700,
                color: '#495057',
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' guests';
          },
        },
      },
      fill: {
        type: 'solid',
      },
    };
  }

  private updateChart(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: this.currentData.map((item) => item.value),
      labels: this.currentData.map((item) => item.category),
      colors: this.currentData.map((item) => item.color),
    };
  }

  trackByCategory(index: number, item: DemographicData): string {
    return item.category;
  }

  getViewTitle(): string {
    switch (this.selectedView) {
      case 'purpose':
        return 'Guest Purpose';
      case 'origin':
        return 'Guest Origin';
      case 'age':
        return 'Age Groups';
      default:
        return 'Demographics';
    }
  }
}
