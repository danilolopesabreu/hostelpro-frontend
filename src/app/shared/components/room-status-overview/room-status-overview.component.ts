import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FeatherModule } from 'angular-feather';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexTooltip,
} from 'ng-apexcharts';

export interface RoomStatusChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
}

export interface RoomStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-room-status-overview',
  imports: [
    MatCardModule,
    FeatherModule,
    MatProgressBarModule,
    NgApexchartsModule
],
  templateUrl: './room-status-overview.component.html',
  styleUrl: './room-status-overview.component.scss',
})
export class RoomStatusOverviewComponent {
  public chartOptions!: Partial<RoomStatusChartOptions>;

  totalRooms: number = 120;
  
  roomStatuses: RoomStatus[] = [
    {
      status: 'Occupied',
      count: 78,
      percentage: 65,
      color: '#4CAF50',
      icon: 'user'
    },
    {
      status: 'Available',
      count: 32,
      percentage: 27,
      color: '#2196F3',
      icon: 'check-circle'
    },
    {
      status: 'Maintenance',
      count: 7,
      percentage: 6,
      color: '#FF9800',
      icon: 'tool'
    },
    {
      status: 'Out of Order',
      count: 3,
      percentage: 2,
      color: '#f44336',
      icon: 'x-circle'
    }
  ];

  roomTypes = [
    { type: 'Standard', occupied: 45, total: 60, rate: 75 },
    { type: 'Deluxe', occupied: 20, total: 30, rate: 67 },
    { type: 'Suite', occupied: 8, total: 15, rate: 53 },
    { type: 'Presidential', occupied: 2, total: 5, rate: 40 },
    { type: 'Family', occupied: 3, total: 10, rate: 30 }
  ];

  constructor() {
    this.initChart();
  }

  get occupancyRate(): number {
    const occupied = this.roomStatuses.find(s => s.status === 'Occupied')?.count || 0;
    return Math.round((occupied / this.totalRooms) * 100);
  }

  private initChart() {
    this.chartOptions = {
      series: this.roomStatuses.map(status => status.count),
      chart: {
        type: 'donut',
        height: 200,
      },
      labels: this.roomStatuses.map(status => status.status),
      colors: this.roomStatuses.map(status => status.color),
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Rooms',
                fontSize: '14px',
                color: '#666',
                formatter: () => {
                  return this.totalRooms.toString();
                }
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: function(val, opts) {
            const percentage = ((val / opts.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
            return val + ' rooms (' + percentage + '%)';
          }
        }
      }
    };
  }
}