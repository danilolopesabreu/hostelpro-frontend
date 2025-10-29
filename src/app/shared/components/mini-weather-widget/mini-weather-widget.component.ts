import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  icon: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

@Component({
  selector: 'app-mini-weather-widget',
  imports: [
    MatCardModule,
    CommonModule,
    FeatherModule,
  ],
  templateUrl: './mini-weather-widget.component.html',
  styleUrl: './mini-weather-widget.component.scss',
})
export class MiniWeatherWidgetComponent implements OnInit {
  weatherData: WeatherData = {
    location: 'Downtown Hotel District',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 24,
    icon: 'partly-sunny',
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy', icon: 'partly-sunny' },
      { day: 'Tomorrow', high: 26, low: 19, condition: 'Sunny', icon: 'sun' },
      { day: 'Thursday', high: 21, low: 16, condition: 'Rainy', icon: 'cloud-rain' },
    ],
  };

  currentTime: string = '';
  lastUpdated: string = '';

  ngOnInit(): void {
    this.updateTime();
    this.lastUpdated = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Update time every minute
    setInterval(() => {
      this.updateTime();
    }, 60000);
  }

  private updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getWeatherIcon(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sun';
      case 'partly cloudy':
      case 'partly-sunny':
        return 'cloud';
      case 'cloudy':
        return 'cloud';
      case 'rainy':
        return 'cloud-rain';
      case 'thunderstorm':
        return 'zap';
      case 'snow':
        return 'cloud-snow';
      case 'fog':
        return 'eye-off';
      default:
        return 'cloud';
    }
  }

  getTemperatureClass(): string {
    if (this.weatherData.temperature >= 30) {
      return 'temp-hot';
    } else if (this.weatherData.temperature >= 20) {
      return 'temp-warm';
    } else if (this.weatherData.temperature >= 10) {
      return 'temp-cool';
    } else {
      return 'temp-cold';
    }
  }

  refreshWeather(): void {
    // In a real application, you would call a weather API
    this.lastUpdated = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Simulate updated data
    this.weatherData.temperature += Math.floor(Math.random() * 6) - 3; // ±3 degrees
    this.weatherData.humidity += Math.floor(Math.random() * 20) - 10; // ±10%
    this.weatherData.windSpeed += Math.floor(Math.random() * 10) - 5; // ±5 km/h
    
    // Keep values in reasonable ranges
    this.weatherData.humidity = Math.max(20, Math.min(95, this.weatherData.humidity));
    this.weatherData.windSpeed = Math.max(0, this.weatherData.windSpeed);
  }
}