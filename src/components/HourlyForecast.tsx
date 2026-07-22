import React from 'react';
import { Clock, CloudRain } from 'lucide-react';
import { HourlyForecastData, TempUnit } from '../types';
import { formatTemp, formatTime12h, getWmoInfo } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastData;
  tempUnit: TempUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  tempUnit,
}) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take next 24 hours starting from current hour
  const now = new Date();
  let startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
  if (startIndex < 0) startIndex = 0;

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const realIdx = startIndex + idx;
    return {
      time,
      temp: hourly.temperature_2m[realIdx],
      weatherCode: hourly.weather_code[realIdx],
      precipProb: hourly.precipitation_probability?.[realIdx] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[realIdx] ?? 0,
      uv: hourly.uv_index?.[realIdx] ?? 0,
    };
  });

  return (
    <div className="bg-white border border-[#DDE2E5] p-6 rounded-none transition-all">
      <div className="flex items-center space-x-2 pb-4 border-b border-[#DDE2E5]">
        <Clock className="w-4 h-4 text-[#1A1C1E]" />
        <h3 className="font-bold uppercase tracking-tight text-sm text-[#1A1C1E]">
          HOURLY OUTLOOK (24H)
        </h3>
      </div>

      <div className="mt-4 flex space-x-3 overflow-x-auto pb-3 pt-1">
        {next24Hours.map((item, idx) => {
          const wmoInfo = getWmoInfo(item.weatherCode, 1);
          const isNow = idx === 0;

          return (
            <div
              key={item.time}
              className={`flex-shrink-0 w-24 p-3 rounded-none border text-center flex flex-col items-center justify-between space-y-2 transition ${
                isNow
                  ? 'bg-[#1A1C1E] text-white border-[#1A1C1E]'
                  : 'bg-[#F1F3F5] text-[#1A1C1E] border-[#DDE2E5] hover:border-[#1A1C1E]'
              }`}
            >
              <span
                className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                  isNow ? 'text-white/80' : 'text-[#6C757D]'
                }`}
              >
                {isNow ? 'NOW' : formatTime12h(item.time)}
              </span>

              <div
                className={`p-2 rounded-none ${
                  isNow ? 'bg-white/10 text-white' : 'bg-white border border-[#DDE2E5] text-[#1A1C1E]'
                }`}
              >
                <WeatherIcon
                  name={wmoInfo.iconName}
                  className="w-5 h-5"
                />
              </div>

              <span
                className={`text-base font-extrabold font-mono tracking-tight ${
                  isNow ? 'text-white' : 'text-[#1A1C1E]'
                }`}
              >
                {formatTemp(item.temp, tempUnit)}
              </span>

              {/* Rain chance badge */}
              <div
                className={`flex items-center space-x-1 font-mono text-[10px] ${
                  isNow
                    ? 'text-white/80'
                    : item.precipProb > 30
                    ? 'text-sky-600 font-bold'
                    : 'text-[#6C757D]'
                }`}
              >
                <CloudRain className="w-3 h-3" />
                <span>{item.precipProb}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
