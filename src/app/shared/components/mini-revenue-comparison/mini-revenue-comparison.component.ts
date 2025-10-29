import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
  ApexTooltip,
  ApexGrid,
} from 'ng-apexcharts';

export interface MiniRevenueChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: string[];
}

@Component({
  selector: 'app-mini-revenue-comparison',
  imports: [MatCardModule, CommonModule, FeatherModule, NgApexchartsModule],
  templateUrl: './mini-revenue-comparison.component.html',
  styleUrl: './mini-revenue-comparison.component.scss',
})
export class MiniRevenueComparisonComponent {
  public chartOptions!: Partial<MiniRevenueChartOptions>;

  todayRevenue: number = 12450;
  lastWeekRevenue: number = 10200;
  lastYearRevenue: number = 9800;

  constructor() {
    this.initChart();
  }

  get weeklyChange(): number {
    return (
      ((this.todayRevenue - this.lastWeekRevenue) / this.lastWeekRevenue) * 100
    );
  }

  get yearlyChange(): number {
    return (
      ((this.todayRevenue - this.lastYearRevenue) / this.lastYearRevenue) * 100
    );
  }

  private initChart() {
    const last7Days = [
      8900,
      9200,
      10100,
      9800,
      10500,
      11200,
      this.todayRevenue,
    ];

    this.chartOptions = {
      series: [
        {
          name: 'Daily Revenue',
          data: last7Days,
        },
      ],
      chart: {
        height: 60,
        type: 'line',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return '$' + val.toLocaleString();
          },
        },
      },
      colors: ['#28a745'],
    };
  }
}
