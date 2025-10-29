import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FeatherModule } from 'angular-feather';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  NgApexchartsModule,
  ApexTooltip,
  ApexFill,
  ApexMarkers,
} from 'ng-apexcharts';

export interface OccupancyChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  markers: ApexMarkers;
  colors: string[];
}

@Component({
  selector: 'app-occupancy-rate-widget',
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    FeatherModule,
    NgApexchartsModule,
  ],
  templateUrl: './occupancy-rate-widget.component.html',
  styleUrl: './occupancy-rate-widget.component.scss',
})
export class OccupancyRateWidgetComponent {
  public chartOptions!: Partial<OccupancyChartOptions>;

  currentOccupancyRate: number = 78.5; // Current occupancy percentage
  previousMonthRate: number = 72.3;
  yearToDateAverage: number = 75.8;

  constructor() {
    this.initChart();
  }

  get rateChange(): number {
    return this.currentOccupancyRate - this.previousMonthRate;
  }

  get isPositiveChange(): boolean {
    return this.rateChange > 0;
  }

  private initChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Occupancy Rate %',
          data: [65, 68, 72, 75, 78, 82, 79, 76, 73, 77, 81, 78.5],
        },
      ],
      chart: {
        height: 220,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
        foreColor: '#9aa0ac',
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: ['#FF6B6B'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        colors: ['#FF6B6B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: {
          style: {
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: 60,
        max: 90,
        labels: {
          formatter: function (val) {
            return val.toFixed(0) + '%';
          },
          style: {
            fontSize: '12px',
          },
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val.toFixed(1) + '%';
          },
        },
      },
      colors: ['#FF6B6B'],
    };
  }
}
