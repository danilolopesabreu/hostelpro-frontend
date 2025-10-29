import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniWeatherWidgetComponent } from './mini-weather-widget.component';

describe('MiniWeatherWidgetComponent', () => {
  let component: MiniWeatherWidgetComponent;
  let fixture: ComponentFixture<MiniWeatherWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniWeatherWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniWeatherWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct weather icon', () => {
    expect(component.getWeatherIcon('sunny')).toBe('sun');
    expect(component.getWeatherIcon('rainy')).toBe('cloud-rain');
    expect(component.getWeatherIcon('partly cloudy')).toBe('cloud');
  });

  it('should get correct temperature class', () => {
    component.weatherData.temperature = 35;
    expect(component.getTemperatureClass()).toBe('temp-hot');

    component.weatherData.temperature = 25;
    expect(component.getTemperatureClass()).toBe('temp-warm');

    component.weatherData.temperature = 15;
    expect(component.getTemperatureClass()).toBe('temp-cool');

    component.weatherData.temperature = 5;
    expect(component.getTemperatureClass()).toBe('temp-cold');
  });

  it('should refresh weather data', () => {
    const originalTemp = component.weatherData.temperature;
    component.refreshWeather();
    expect(component.lastUpdated).toBeDefined();
    // Temperature might have changed within ±3 degrees
    expect(Math.abs(component.weatherData.temperature - originalTemp)).toBeLessThanOrEqual(3);
  });
});