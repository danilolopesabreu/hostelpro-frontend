import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FeatherModule } from 'angular-feather';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
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
} from 'ng-apexcharts';

export interface StaffPerformanceChartOptions {
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
  colors: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  performance: number;
  tasks: number;
  completedTasks: number;
  rating: number;
  avatar: string;
  efficiency: number;
}

@Component({
  selector: 'app-staff-performance-widget',
  imports: [
    MatCardModule,
    FeatherModule,
    MatProgressBarModule,
    MatTabsModule,
    NgApexchartsModule
],
  templateUrl: './staff-performance-widget.component.html',
  styleUrl: './staff-performance-widget.component.scss',
})
export class StaffPerformanceWidgetComponent {
  public chartOptions!: Partial<StaffPerformanceChartOptions>;

  topPerformers: StaffMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      department: 'Housekeeping',
      performance: 96,
      tasks: 85,
      completedTasks: 82,
      rating: 4.9,
      avatar: 'assets/images/user/user1.jpg',
      efficiency: 96
    },
    {
      id: '2',
      name: 'Michael Chen',
      department: 'Front Desk',
      performance: 94,
      tasks: 120,
      completedTasks: 113,
      rating: 4.8,
      avatar: 'assets/images/user/user2.jpg',
      efficiency: 94
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      department: 'Concierge',
      performance: 91,
      tasks: 65,
      completedTasks: 59,
      rating: 4.7,
      avatar: 'assets/images/user/user3.jpg',
      efficiency: 91
    },
    {
      id: '4',
      name: 'David Wilson',
      department: 'Maintenance',
      performance: 89,
      tasks: 45,
      completedTasks: 40,
      rating: 4.6,
      avatar: 'assets/images/user/user4.jpg',
      efficiency: 89
    },
    {
      id: '5',
      name: 'Lisa Garcia',
      department: 'Restaurant',
      performance: 87,
      tasks: 78,
      completedTasks: 68,
      rating: 4.5,
      avatar: 'assets/images/user/user5.jpg',
      efficiency: 87
    }
  ];

  departmentStats = [
    { department: 'Housekeeping', avgPerformance: 88, staffCount: 12, completionRate: 92 },
    { department: 'Front Desk', avgPerformance: 91, staffCount: 8, completionRate: 95 },
    { department: 'Concierge', avgPerformance: 85, staffCount: 6, completionRate: 89 },
    { department: 'Maintenance', avgPerformance: 82, staffCount: 5, completionRate: 87 },
    { department: 'Restaurant', avgPerformance: 86, staffCount: 15, completionRate: 90 },
    { department: 'Security', avgPerformance: 84, staffCount: 4, completionRate: 88 }
  ];

  constructor() {
    this.initChart();
  }

  get averagePerformance(): number {
    const total = this.departmentStats.reduce((sum, dept) => sum + dept.avgPerformance, 0);
    return Math.round(total / this.departmentStats.length);
  }

  get totalStaff(): number {
    return this.departmentStats.reduce((sum, dept) => sum + dept.staffCount, 0);
  }

  getPerformanceColor(performance: number): string {
    if (performance >= 90) return '#4CAF50';
    if (performance >= 80) return '#FF9800';
    if (performance >= 70) return '#FFC107';
    return '#f44336';
  }

  private initChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Performance Score',
          data: this.departmentStats.map(dept => dept.avgPerformance),
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
        categories: this.departmentStats.map(dept => dept.department),
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
        min: 70,
        max: 100,
        labels: {
          formatter: function (val) {
            return val.toFixed(0) + '%';
          },
          style: {
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#2196F3'],
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val + '%';
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
      colors: ['#2196F3'],
    };
  }
}