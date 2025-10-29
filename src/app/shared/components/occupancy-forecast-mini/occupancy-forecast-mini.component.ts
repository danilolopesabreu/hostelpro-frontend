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
  ApexMarkers,
} from 'ng-apexcharts';

export interface OccupancyForecastOptions {
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

export interface OccupancyForecast {
  date: string;
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  availableRooms: number;
  dayOfWeek: string;
}

@Component({
  selector: 'app-occupancy-forecast-mini',
  imports: [MatCardModule, CommonModule, FeatherModule, NgApexchartsModule],
  templateUrl: './occupancy-forecast-mini.component.html',
  styleUrl: './occupancy-forecast-mini.component.scss',
})
export class OccupancyForecastMiniComponent {
  public chartOptions!: Partial<OccupancyForecastOptions>;

  forecastData: OccupancyForecast[] = [
    {
      date: 'Today',
      occupancyRate: 92,
      totalRooms: 150,
      occupiedRooms: 138,
      reservedRooms: 8,
      availableRooms: 4,
      dayOfWeek: 'Tuesday',
    },
    {
      date: 'Wed',
      occupancyRate: 62,
      totalRooms: 150,
      occupiedRooms: 130,
      reservedRooms: 12,
      availableRooms: 8,
      dayOfWeek: 'Wednesday',
    },
    {
      date: 'Thu',
      occupancyRate: 95,
      totalRooms: 150,
      occupiedRooms: 142,
      reservedRooms: 6,
      availableRooms: 2,
      dayOfWeek: 'Thursday',
    },
    {
      date: 'Fri',
      occupancyRate: 98,
      totalRooms: 150,
      occupiedRooms: 147,
      reservedRooms: 3,
      availableRooms: 0,
      dayOfWeek: 'Friday',
    },
    {
      date: 'Sat',
      occupancyRate: 89,
      totalRooms: 150,
      occupiedRooms: 133,
      reservedRooms: 10,
      availableRooms: 7,
      dayOfWeek: 'Saturday',
    },
    {
      date: 'Sun',
      occupancyRate: 76,
      totalRooms: 150,
      occupiedRooms: 114,
      reservedRooms: 15,
      availableRooms: 21,
      dayOfWeek: 'Sunday',
    },
    {
      date: 'Mon',
      occupancyRate: 84,
      totalRooms: 150,
      occupiedRooms: 126,
      reservedRooms: 14,
      availableRooms: 10,
      dayOfWeek: 'Monday',
    },
  ];

  constructor() {
    this.initChart();
  }

  get averageOccupancy(): number {
    return Math.round(
      this.forecastData.reduce((sum, data) => sum + data.occupancyRate, 0) /
        this.forecastData.length
    );
  }

  get peakDay(): OccupancyForecast {
    return this.forecastData.reduce((peak, current) =>
      current.occupancyRate > peak.occupancyRate ? current : peak
    );
  }

  get lowestDay(): OccupancyForecast {
    return this.forecastData.reduce((lowest, current) =>
      current.occupancyRate < lowest.occupancyRate ? current : lowest
    );
  }

  private initChart(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Occupancy Rate',
          data: this.forecastData.map((data) => data.occupancyRate),
        },
      ],
      chart: {
        height: 150,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: false,
        },
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        colors: ['#28a745'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: this.forecastData.map((data) => data.date),
        labels: {
          style: {
            fontSize: '10px',
            colors: '#6c757d',
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
        min: 0,
        max: 100,
        labels: {
          formatter: function (val) {
            return val + '%';
          },
          style: {
            fontSize: '10px',
            colors: '#6c757d',
          },
        },
        title: {
          text: 'Occupancy %',
          style: {
            fontSize: '11px',
            fontWeight: 500,
            color: '#6c757d',
          },
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        strokeDashArray: 2,
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
          formatter: function (val, opts) {
            const dataIndex = opts.dataPointIndex;
            const component = opts.w.config.chart.component;
            if (
              component &&
              component.forecastData &&
              component.forecastData[dataIndex]
            ) {
              const data = component.forecastData[dataIndex];
              return `
                <div style="padding: 4px;">
                  <div><strong>${val}% Occupancy</strong></div>
                  <div>Occupied: ${data.occupiedRooms} rooms</div>
                  <div>Available: ${data.availableRooms} rooms</div>
                  <div>Reserved: ${data.reservedRooms} rooms</div>
                </div>
              `;
            }
            return val + '% Occupancy';
          },
        },
      },
      colors: ['#28a745'],
    };

    // Store reference for tooltip
    if (this.chartOptions.chart) {
      (this.chartOptions.chart as any).component = this;
    }
  }

  trackByDate(index: number, day: OccupancyForecast): string {
    return day.date;
  }

  getOccupancyStatus(rate: number): string {
    if (rate >= 95) return 'Very High';
    if (rate >= 85) return 'High';
    if (rate >= 70) return 'Moderate';
    if (rate >= 50) return 'Low';
    return 'Very Low';
  }

  getOccupancyClass(rate: number): string {
    if (rate >= 95) return 'occupancy-very-high';
    if (rate >= 85) return 'occupancy-high';
    if (rate >= 70) return 'occupancy-moderate';
    if (rate >= 50) return 'occupancy-low';
    return 'occupancy-very-low';
  }
}
