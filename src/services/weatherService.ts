import { CityLocation, GeocodingResult, WeatherData } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }

    return data.results.map((item: GeocodingResult) => ({
      name: item.name,
      country: item.country || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      country_code: item.country_code || '',
    }));
  } catch (error) {
    console.error('Failed to search city:', error);
    throw error;
  }
}

/**
 * Fetches weather forecast from Open-Meteo Forecast API
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const currentFields = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const dailyFields = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
  ].join(',');

  const hourlyFields = [
    'temperature_2m',
    'relative_humidity_2m',
    'weather_code',
    'precipitation_probability',
    'wind_speed_10m',
    'uv_index',
  ].join(',');

  const url = `${FORECAST_BASE_URL}?latitude=${lat}&longitude=${lon}&current=${currentFields}&daily=${dailyFields}&hourly=${hourlyFields}&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Invalid weather data structure received');
    }

    return data as WeatherData;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

/**
 * Reverse geocoding helper or latitude/longitude fallback city lookup
 */
export async function reverseGeocode(lat: number, lon: number): Promise<CityLocation> {
  try {
    // Open-Street-Map Nominatim or BigDataCloud free reverse geocode
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || 'Your Location';
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';
      return {
        name,
        country,
        admin1,
        latitude: lat,
        longitude: lon,
        country_code: data.countryCode || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, using default coordinate name:', e);
  }

  return {
    name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    country: 'Location',
    latitude: lat,
    longitude: lon,
  };
}
