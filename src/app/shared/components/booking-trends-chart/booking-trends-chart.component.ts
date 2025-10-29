import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
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
  ApexLegend,
  ApexMarkers,
} from 'ng-apexcharts';

export interface BookingTrendsChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  markers: ApexMarkers;
  colors: string[];
}

@Component({
  selector: 'app-booking-trends-chart',
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgApexchartsModule,
  ],
  templateUrl: './booking-trends-chart.component.html',
  styleUrl: './booking-trends-chart.component.scss',
})
export class BookingTrendsChartComponent {
  public chartOptions!: Partial<BookingTrendsChartOptions>;

  selectedPeriod: string = '30days';

  // Sample data for different periods
  private data30Days = [
    45, 52, 48, 61, 42, 58, 67, 59, 55, 62, 58, 64, 69, 71, 67, 63, 58, 66, 72,
    68, 61, 57, 63, 69, 74, 68, 62, 59, 65, 71,
  ];
  private data7Days = [58, 64, 69, 71, 67, 63, 72];
  private dataYearly = [
    542, 678, 589, 712, 634, 598, 723, 689, 645, 701, 668, 734,
  ];

  constructor() {
    this.initChart();
  }

  changePeriod(period: string) {
    this.selectedPeriod = period;
    this.updateChartData();
  }

  private initChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Bookings',
          data: this.data30Days,
        },
      ],
      chart: {
        height: 250,
        type: 'line',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
        zoom: {
          enabled: true,
        },
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
        colors: ['#4E73DF'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        categories: this.getLast30DaysLabels(),
        labels: {
          style: {
            fontSize: '12px',
          },
          rotate: -45,
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
          formatter: function (val) {
            return Math.round(val).toString();
          },
          style: {
            fontSize: '12px',
          },
        },
        title: {
          text: 'Number of Bookings',
          style: {
            fontSize: '14px',
            fontWeight: 600,
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
            return Math.round(val) + ' bookings';
          },
        },
        x: {
          format: 'dd MMM',
        },
      },
      legend: {
        show: false,
      },
      colors: ['#4E73DF'],
    };
  }

  private updateChartData() {
    let newData: number[] = [];
    let newCategories: string[] = [];

    switch (this.selectedPeriod) {
      case '7days':
        newData = this.data7Days;
        newCategories = this.getLast7DaysLabels();
        break;
      case '30days':
        newData = this.data30Days;
        newCategories = this.getLast30DaysLabels();
        break;
      case 'yearly':
        newData = this.dataYearly;
        newCategories = [
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
        ];
        break;
    }

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Bookings',
          data: newData,
        },
      ],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: newCategories,
      },
    };
  }

  private getLast7DaysLabels(): string[] {
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return labels;
  }

  private getLast30DaysLabels(): string[] {
    const labels: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
    }
    return labels;
  }

  get totalBookings(): number {
    if (this.chartOptions.series && this.chartOptions.series[0]) {
      return this.chartOptions.series[0].data.reduce(
        (sum: number, val: any) => sum + val,
        0
      );
    }
    return 0;
  }

  get averageBookings(): number {
    if (this.chartOptions.series && this.chartOptions.series[0]) {
      const data = this.chartOptions.series[0].data;
      return data.reduce((sum: number, val: any) => sum + val, 0) / data.length;
    }
    return 0;
  }
}
