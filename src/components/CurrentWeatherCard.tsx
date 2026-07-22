import React from 'react';
import {
  MapPin,
  Star,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Gauge,
  Cloud,
  Thermometer,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { CityLocation, TempUnit, WeatherData } from '../types';
import {
  getWmoInfo,
  formatTemp,
  formatWind,
  getWindDirection,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: CityLocation;
  weather: WeatherData;
  tempUnit: TempUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  weather,
  tempUnit,
  isFavorite,
  onToggleFavorite,
}) => {
  const current = weather.current;
  const daily = weather.daily;
  const wmoInfo = getWmoInfo(current.weather_code, current.is_day);

  const todayMax = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const precipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const uvMax = daily.uv_index_max?.[0] ?? 0;

  return (
    <div className="relative bg-white border border-[#DDE2E5] p-6 sm:p-8 rounded-none transition-all">
      {/* Card Header: Location & Favorite Toggle */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#1A1C1E]" />
            <h2 id="current-city-title" className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1A1C1E]">
              {city.name}
            </h2>
            <button
              id="favorite-toggle-btn"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1 hover:bg-[#F1F3F5] transition"
            >
              <Star
                className={`w-5 h-5 transition ${
                  isFavorite
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-[#6C757D] hover:text-amber-500'
                }`}
              />
            </button>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#6C757D] mt-1">
            {city.admin1 ? `${city.admin1}, ` : ''}
            {city.country || 'Global Location'}
          </p>
        </div>

        {/* Condition Badge */}
        <div className="px-3 py-1 bg-[#F1F3F5] border border-[#DDE2E5] font-mono text-[11px] uppercase font-bold text-[#1A1C1E] flex items-center space-x-2 rounded-none">
          <WeatherIcon name={wmoInfo.iconName} className="w-4 h-4 text-[#1A1C1E]" />
          <span>{wmoInfo.label}</span>
        </div>
      </div>

      {/* Main Temperature & Weather Visual */}
      <div className="relative z-10 my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-y border-[#DDE2E5] py-6">
        <div className="flex items-baseline space-x-4">
          <span id="current-temperature-display" className="text-7xl sm:text-8xl font-black tracking-tighter text-[#1A1C1E]">
            {formatTemp(current.temperature_2m, tempUnit)}
          </span>

          <div className="flex flex-col justify-center space-y-1 font-mono text-xs uppercase">
            <span className="text-[#6C757D] flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-[#1A1C1E]" />
              <span>FEELS LIKE {formatTemp(current.apparent_temperature, tempUnit)}</span>
            </span>

            <div className="flex items-center space-x-3 font-bold text-[#1A1C1E]">
              <span className="flex items-center text-emerald-600">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> HI: {formatTemp(todayMax, tempUnit)}
              </span>
              <span className="flex items-center text-blue-600">
                <ArrowDown className="w-3.5 h-3.5 mr-0.5" /> LO: {formatTemp(todayMin, tempUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Description Box */}
        <div className="flex items-center space-x-4 bg-[#F1F3F5] p-4 border border-[#DDE2E5] rounded-none">
          <div className="p-3 bg-[#1A1C1E] text-white">
            <WeatherIcon name={wmoInfo.iconName} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-[#1A1C1E]">{wmoInfo.label}</h3>
            <p className="font-mono text-[11px] text-[#6C757D] max-w-[180px]">
              {wmoInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Wind */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">WIND</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {formatWind(current.wind_speed_10m, tempUnit)}
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">
              {getWindDirection(current.wind_direction_10m)} ({current.wind_direction_10m}°)
            </span>
          </div>
        </div>

        {/* 2. Humidity */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">HUMIDITY</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {current.relative_humidity_2m}%
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">
              {current.relative_humidity_2m > 70 ? 'HIGH' : current.relative_humidity_2m < 30 ? 'DRY' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">UV INDEX</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {uvMax.toFixed(1)}
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">
              {uvMax >= 8 ? 'VERY HIGH' : uvMax >= 6 ? 'HIGH' : uvMax >= 3 ? 'MODERATE' : 'LOW'}
            </span>
          </div>
        </div>

        {/* 4. Rain Chance */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">PRECIP CHANCE</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {precipProb}%
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">
              {current.precipitation > 0 ? `${current.precipitation} mm` : '0 mm'}
            </span>
          </div>
        </div>

        {/* 5. Pressure */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">PRESSURE</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {Math.round(current.pressure_msl)} hPa
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">SEA LEVEL</span>
          </div>
        </div>

        {/* 6. Cloudiness */}
        <div className="p-3 bg-[#F1F3F5] border border-[#DDE2E5] flex items-center space-x-3 rounded-none">
          <div className="p-2 bg-white border border-[#DDE2E5] text-[#1A1C1E]">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#6C757D]">COVER</span>
            <span className="text-sm font-bold text-[#1A1C1E]">
              {current.cloud_cover}%
            </span>
            <span className="block font-mono text-[9px] text-[#6C757D]">
              {current.cloud_cover > 80 ? 'OVERCAST' : current.cloud_cover > 40 ? 'PARTLY CLOUDY' : 'CLEAR'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
