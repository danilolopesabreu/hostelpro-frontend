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
  ApexGrid,
  NgApexchartsModule,
  ApexTooltip,
  ApexFill,
  ApexPlotOptions,
  ApexLegend,
} from 'ng-apexcharts';

export interface GuestSatisfactionChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
}

@Component({
  selector: 'app-guest-satisfaction-chart',
  imports: [MatCardModule, CommonModule, FeatherModule, NgApexchartsModule],
  templateUrl: './guest-satisfaction-chart.component.html',
  styleUrl: './guest-satisfaction-chart.component.scss',
})
export class GuestSatisfactionChartComponent {
  public chartOptions!: Partial<GuestSatisfactionChartOptions>;

  averageRating: number = 4.6;
  totalReviews: number = 324;
  monthlyGrowth: number = 8.5;

  constructor() {
    this.initChart();
  }

  get trendDirection(): 'up' | 'down' {
    return this.monthlyGrowth > 0 ? 'up' : 'down';
  }

  private initChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Rating Trends',
          data: [4.2, 4.3, 4.1, 4.4, 4.5, 4.6, 4.7, 4.5, 4.6, 4.7, 4.8, 4.6],
        },
      ],
      chart: {
        height: 250,
        type: 'area',
        toolbar: {
          show: false,
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
          gradientToColors: ['#4CAF50'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
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
        min: 3.5,
        max: 5.0,
        labels: {
          formatter: function (val) {
            return val.toFixed(1);
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
            return val.toFixed(1) + ' ⭐';
          },
        },
      },
      colors: ['#4CAF50'],
    };
  }
}
