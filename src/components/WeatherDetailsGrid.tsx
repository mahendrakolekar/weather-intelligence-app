import React from 'react';
import { Sunrise, Sunset, Sun, Compass, Wind, Gauge, Droplet, Eye } from 'lucide-react';
import { CurrentWeatherData, DailyForecastData, TempUnit } from '../types';
import { formatTime12h, formatWind, getWindDirection } from '../utils/weatherUtils';

interface WeatherDetailsGridProps {
  current: CurrentWeatherData;
  daily: DailyForecastData;
  tempUnit: TempUnit;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({
  current,
  daily,
  tempUnit,
}) => {
  const sunriseStr = daily.sunrise?.[0] || '';
  const sunsetStr = daily.sunset?.[0] || '';
  const uvMax = daily.uv_index_max?.[0] || 0;

  // Calculate approximate daylight progress
  let dayProgress = 50;
  if (sunriseStr && sunsetStr) {
    const sr = new Date(sunriseStr).getTime();
    const ss = new Date(sunsetStr).getTime();
    const now = new Date().getTime();
    if (now < sr) dayProgress = 0;
    else if (now > ss) dayProgress = 100;
    else dayProgress = Math.min(100, Math.max(0, ((now - sr) / (ss - sr)) * 100));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Sunrise & Sunset Solar Arc */}
      <div className="bg-white border border-[#DDE2E5] p-5 rounded-none flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE2E5]">
          <span className="font-mono text-xs uppercase font-bold text-[#1A1C1E] flex items-center space-x-1.5">
            <Sunrise className="w-4 h-4 text-[#1A1C1E]" />
            <span>SUN SCHEDULE</span>
          </span>
          <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 bg-[#F1F3F5] text-[#1A1C1E] border border-[#DDE2E5]">
            SOLAR CYCLE
          </span>
        </div>

        <div className="my-3 relative flex flex-col items-center">
          {/* Arc Visualization */}
          <div className="w-full h-16 border-t-2 border-dashed border-[#1A1C1E] rounded-t-full relative overflow-hidden flex items-end justify-center">
            <div
              className="absolute w-3.5 h-3.5 bg-[#1A1C1E] rounded-none -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
              style={{
                left: `${dayProgress}%`,
                top: `${100 - Math.sin((dayProgress / 100) * Math.PI) * 90}%`,
              }}
            />
          </div>

          <div className="w-full flex items-center justify-between pt-2 font-mono text-xs font-bold text-[#1A1C1E]">
            <div className="flex items-center space-x-1">
              <Sunrise className="w-3.5 h-3.5 text-[#1A1C1E]" />
              <span>{sunriseStr ? formatTime12h(sunriseStr) : '--'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sunset className="w-3.5 h-3.5 text-[#1A1C1E]" />
              <span>{sunsetStr ? formatTime12h(sunsetStr) : '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UV Index Details */}
      <div className="bg-white border border-[#DDE2E5] p-5 rounded-none flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE2E5]">
          <span className="font-mono text-xs uppercase font-bold text-[#1A1C1E] flex items-center space-x-1.5">
            <Sun className="w-4 h-4 text-[#1A1C1E]" />
            <span>UV RADIATION</span>
          </span>
          <span className="font-mono text-xs font-bold text-[#1A1C1E]">
            PEAK: {uvMax.toFixed(1)}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-[#1A1C1E]">
              {uvMax.toFixed(1)}
            </span>
            <span className="font-mono text-xs font-bold text-[#1A1C1E]">
              {uvMax >= 8 ? 'VERY HIGH' : uvMax >= 6 ? 'HIGH' : uvMax >= 3 ? 'MODERATE' : 'LOW'}
            </span>
          </div>

          <div className="w-full bg-[#DDE2E5] h-2 rounded-none mt-2 overflow-hidden">
            <div
              className="h-full bg-[#1A1C1E] rounded-none transition-all duration-500"
              style={{ width: `${Math.min(100, (uvMax / 11) * 100)}%` }}
            />
          </div>

          <p className="font-mono text-[10px] uppercase text-[#6C757D] mt-2">
            {uvMax >= 6
              ? 'SUN PROTECTION REQUIRED. SEEK SHADE MID-DAY.'
              : 'LOW SUN HAZARD FOR TODAY.'}
          </p>
        </div>
      </div>

      {/* 3. Wind & Gust Direction */}
      <div className="bg-white border border-[#DDE2E5] p-5 rounded-none flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE2E5]">
          <span className="font-mono text-xs uppercase font-bold text-[#1A1C1E] flex items-center space-x-1.5">
            <Wind className="w-4 h-4 text-[#1A1C1E]" />
            <span>WIND & GUSTS</span>
          </span>
          <span className="font-mono text-xs font-bold text-[#1A1C1E]">
            {getWindDirection(current.wind_direction_10m)}
          </span>
        </div>

        <div className="my-2 flex items-center justify-between">
          <div>
            <div className="text-2xl font-black font-mono text-[#1A1C1E]">
              {formatWind(current.wind_speed_10m, tempUnit)}
            </div>
            <div className="font-mono text-[10px] text-[#6C757D] mt-0.5 uppercase">
              GUSTS: {formatWind(current.wind_gusts_10m || current.wind_speed_10m * 1.3, tempUnit)}
            </div>
          </div>

          {/* Compass Rose */}
          <div className="relative w-12 h-12 border border-[#1A1C1E] flex items-center justify-center bg-[#F1F3F5] rounded-none">
            <Compass
              className="w-7 h-7 text-[#1A1C1E] transition-transform duration-500"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Atmospheric Pressure & Comfort */}
      <div className="bg-white border border-[#DDE2E5] p-5 rounded-none flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE2E5]">
          <span className="font-mono text-xs uppercase font-bold text-[#1A1C1E] flex items-center space-x-1.5">
            <Gauge className="w-4 h-4 text-[#1A1C1E]" />
            <span>AIR PRESSURE</span>
          </span>
          <span className="font-mono text-xs font-bold text-[#1A1C1E]">
            {Math.round(current.pressure_msl)} hPa
          </span>
        </div>

        <div className="my-2 space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6C757D] flex items-center gap-1 uppercase">
              <Droplet className="w-3.5 h-3.5 text-[#1A1C1E]" /> HUMIDITY
            </span>
            <span className="font-bold text-[#1A1C1E]">
              {current.relative_humidity_2m}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6C757D] flex items-center gap-1 uppercase">
              <Eye className="w-3.5 h-3.5 text-[#1A1C1E]" /> CLOUDINESS
            </span>
            <span className="font-bold text-[#1A1C1E]">
              {current.cloud_cover}%
            </span>
          </div>

          <p className="font-mono text-[10px] uppercase text-[#6C757D] pt-1 border-t border-[#DDE2E5]">
            {current.pressure_msl >= 1013 ? 'HIGH PRESSURE SYSTEM (STABLE)' : 'LOW PRESSURE SYSTEM (UNSETTLED)'}
          </p>
        </div>
      </div>
    </div>
  );
};
