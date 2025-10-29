import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexFill,
} from 'ng-apexcharts';

export interface ServiceRevenueChartOptions {
  series?: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart?: ApexChart;
  labels?: string[];
  colors?: string[];
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  fill?: ApexFill;
}

export interface ServiceRevenue {
  service: string;
  revenue: number;
  percentage: number;
  growth: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-hotel-services-revenue',
  imports: [MatCardModule, CommonModule, FeatherModule, NgApexchartsModule],
  templateUrl: './hotel-services-revenue.component.html',
  styleUrl: './hotel-services-revenue.component.scss',
})
export class HotelServicesRevenueComponent {
  public barChartOptions!: Partial<ServiceRevenueChartOptions>;

  totalRevenue: number = 284750;
  monthlyGrowth: number = 12.5;

  servicesRevenue: ServiceRevenue[] = [
    {
      service: 'Room Bookings',
      revenue: 165000,
      percentage: 58,
      growth: 8.2,
      color: '#2196F3',
      icon: 'home',
    },
    {
      service: 'Restaurant & Bar',
      revenue: 52300,
      percentage: 18,
      growth: 15.7,
      color: '#4CAF50',
      icon: 'coffee',
    },
    {
      service: 'Spa & Wellness',
      revenue: 28900,
      percentage: 10,
      growth: 22.3,
      color: '#FF9800',
      icon: 'heart',
    },
    {
      service: 'Conference & Events',
      revenue: 21500,
      percentage: 8,
      growth: 5.1,
      color: '#9C27B0',
      icon: 'users',
    },
    {
      service: 'Laundry Service',
      revenue: 8750,
      percentage: 3,
      growth: -2.4,
      color: '#607D8B',
      icon: 'refresh-cw',
    },
    {
      service: 'Room Service',
      revenue: 8300,
      percentage: 3,
      growth: 18.9,
      color: '#FF5722',
      icon: 'truck',
    },
  ];

  constructor() {
    this.initCharts();
  }

  get topGrowthService(): ServiceRevenue {
    return this.servicesRevenue.reduce((prev, current) =>
      prev.growth > current.growth ? prev : current
    );
  }

  private initCharts() {
    // Bar Chart for Growth
    this.barChartOptions = {
      series: [
        {
          name: 'Growth %',
          data: this.servicesRevenue.map((service) => service.growth),
        },
      ],
      chart: {
        height: 200,
        type: 'bar',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '60%',
          colors: {
            ranges: [
              {
                from: -100,
                to: 0,
                color: '#f44336',
              },
              {
                from: 0,
                to: 100,
                color: '#4CAF50',
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.servicesRevenue.map(
          (service) => service.service.split(' ')[0]
        ),
        labels: {
          style: {
            fontSize: '11px',
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
            return val.toFixed(1) + '%';
          },
          style: {
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val > 0 ? '+' + val.toFixed(1) + '%' : val.toFixed(1) + '%';
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
    };
  }
}
