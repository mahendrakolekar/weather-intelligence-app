export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure?: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeatherData;
  daily: DailyForecastData;
  hourly: HourlyForecastData;
}

export interface CityLocation {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  country_code?: string;
}

export type TempUnit = 'C' | 'F';

export interface Recommendation {
  id: string;
  category: 'clothing' | 'umbrella' | 'sun' | 'wind' | 'activity' | 'alert';
  title: string;
  detail: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  iconName: string;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 to 100
  status: 'Ideal' | 'Good' | 'Moderate' | 'Poor';
  iconName: string;
  reason: string;
}
