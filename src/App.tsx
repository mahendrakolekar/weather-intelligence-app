import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PopularCities } from './components/PopularCities';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherIntelligenceCard } from './components/WeatherIntelligenceCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CityLocation, TempUnit, WeatherData } from './types';
import { fetchWeatherData, reverseGeocode } from './services/weatherService';
import { Loader2 } from 'lucide-react';

const DEFAULT_CITY: CityLocation = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
  country_code: 'GB',
};

const FAVORITES_KEY = 'weather_app_favorites_v1';

export default function App() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [favorites, setFavorites] = useState<CityLocation[]>([]);
  const [error, setError] = useState<{
    type: 'city_not_found' | 'api_error' | 'geolocation_error';
    message?: string;
  } | null>(null);

  // Load saved favorites on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  }, []);

  // Save favorites helper
  const toggleFavorite = (city: CityLocation) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name.toLowerCase() === city.name.toLowerCase());
      let updated: CityLocation[];
      if (exists) {
        updated = prev.filter((f) => f.name.toLowerCase() !== city.name.toLowerCase());
      } else {
        updated = [...prev, city];
      }
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save favorites:', e);
      }
      return updated;
    });
  };

  // Main weather fetch callback
  const loadWeather = useCallback(async (city: CityLocation) => {
    setIsLoading(true);
    setError(null);
    setCurrentCity(city);

    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);
    } catch (err: unknown) {
      console.error('Failed to load weather:', err);
      const errorMessage = err instanceof Error ? err.message : undefined;
      setError({
        type: 'api_error',
        message: errorMessage || 'Could not connect to Open-Meteo weather service. Please try again.',
      });
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  // Handle Geolocation
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError({
        type: 'geolocation_error',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const location = await reverseGeocode(latitude, longitude);
          await loadWeather(location);
        } catch (err) {
          console.error('Geolocate error:', err);
          await loadWeather({
            name: 'Current Location',
            latitude,
            longitude,
          });
        } finally {
          setIsGeolocating(false);
        }
      },
      (geoErr) => {
        console.warn('Geolocation denied or failed:', geoErr);
        setIsGeolocating(false);
        setError({
          type: 'geolocation_error',
          message: 'Location access was denied or unavailable. Please search for a city manually above.',
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === currentCity.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F1F3F5] text-[#1A1C1E] font-sans antialiased transition-colors duration-300">
      {/* Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={loadWeather}
        tempUnit={tempUnit}
        onToggleUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onGeolocate={handleGeolocate}
        isGeolocating={isGeolocating}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Popular Cities Bar */}
        <PopularCities
          currentCityName={currentCity.name}
          onSelectCity={loadWeather}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-none border border-[#DDE2E5]">
            <Loader2 className="w-10 h-10 text-[#1A1C1E] animate-spin mb-4" />
            <h3 className="font-bold uppercase tracking-tight text-base text-[#1A1C1E]">
              QUERYING OPEN-METEO ENGINE FOR {currentCity.name}...
            </h3>
            <p className="font-mono text-xs text-[#6C757D] mt-1 uppercase">
              Fetching current status, forecast, and intelligence recommendations
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorDisplay
            type={error.type}
            message={error.message}
            onRetry={() => loadWeather(currentCity)}
            onSelectCity={loadWeather}
          />
        )}

        {/* Main Content Display */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6">
            {/* Current Weather Hero */}
            <CurrentWeatherCard
              city={currentCity}
              weather={weatherData}
              tempUnit={tempUnit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={() => toggleFavorite(currentCity)}
            />

            {/* Weather Intelligence & Recommendations */}
            <WeatherIntelligenceCard
              current={weatherData.current}
              daily={weatherData.daily}
            />

            {/* Hourly Forecast Strip */}
            <HourlyForecast
              hourly={weatherData.hourly}
              tempUnit={tempUnit}
            />

            {/* 7-Day Forecast Row */}
            <DailyForecast
              daily={weatherData.daily}
              tempUnit={tempUnit}
            />

            {/* Sun Cycle, UV, Wind & Pressure Grid */}
            <WeatherDetailsGrid
              current={weatherData.current}
              daily={weatherData.daily}
              tempUnit={tempUnit}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-[#DDE2E5] text-center font-mono text-xs text-[#6C757D]">
        <p>
          POWERED BY <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline hover:text-[#1A1C1E]">OPEN-METEO WEATHER API</a> & GEOCODING API.
        </p>
      </footer>
    </div>
  );
}
