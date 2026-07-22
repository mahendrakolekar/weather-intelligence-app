import React from 'react';
import { Calendar, CloudRain, Wind, Sun } from 'lucide-react';
import { DailyForecastData, TempUnit } from '../types';
import {
  formatDayName,
  formatDateShort,
  formatTemp,
  getWmoInfo,
  formatWind,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastData;
  tempUnit: TempUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
}) => {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Global min and max across all 7 days for range bar scaling
  const allMins = daily.temperature_2m_min || [];
  const allMaxs = daily.temperature_2m_max || [];
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const totalRange = globalMax - globalMin || 1;

  return (
    <div className="bg-white border border-[#DDE2E5] p-6 rounded-none transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE2E5]">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#1A1C1E]" />
          <h3 className="font-bold uppercase tracking-tight text-sm text-[#1A1C1E]">
            7-DAY FORECAST
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#6C757D]">TEMPERATURE OUTLOOK</span>
      </div>

      <div className="mt-4 divide-y divide-[#DDE2E5]">
        {daily.time.slice(0, 7).map((timeStr, idx) => {
          const wmoCode = daily.weather_code[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const maxTemp = daily.temperature_2m_max[idx];
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const wmoInfo = getWmoInfo(wmoCode, 1);

          // Calculate temperature range bar percentages
          const leftPercent = ((minTemp - globalMin) / totalRange) * 100;
          const widthPercent = Math.max(12, ((maxTemp - minTemp) / totalRange) * 100);

          return (
            <div
              key={timeStr}
              className="py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F1F3F5] transition"
            >
              {/* Day & Condition */}
              <div className="flex items-center space-x-3 sm:w-1/3">
                <div className="w-10 h-10 bg-[#1A1C1E] text-white flex items-center justify-center flex-shrink-0 rounded-none">
                  <WeatherIcon name={wmoInfo.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm uppercase text-[#1A1C1E]">
                      {formatDayName(timeStr, idx)}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#6C757D]">
                      {formatDateShort(timeStr)}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#6C757D] line-clamp-1">
                    {wmoInfo.label}
                  </span>
                </div>
              </div>

              {/* Rain & Wind Badges */}
              <div className="flex items-center space-x-4 font-mono text-xs text-[#6C757D] sm:w-1/4 justify-start">
                <div
                  className={`flex items-center space-x-1 ${
                    precipProb > 30 ? 'text-sky-600 font-bold' : ''
                  }`}
                  title="Rain probability"
                >
                  <CloudRain className="w-3.5 h-3.5 text-[#1A1C1E]" />
                  <span>{precipProb}%</span>
                </div>

                <div className="flex items-center space-x-1" title="Max wind speed">
                  <Wind className="w-3.5 h-3.5 text-[#6C757D]" />
                  <span>{formatWind(windMax, tempUnit)}</span>
                </div>

                {uvMax >= 6 && (
                  <div className="hidden lg:flex items-center space-x-1 text-amber-600 font-bold" title="High UV Index">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>UV {uvMax.toFixed(0)}</span>
                  </div>
                )}
              </div>

              {/* Min - Max Temperature Range Bar */}
              <div className="flex items-center space-x-3 sm:w-2/5">
                <span className="font-mono text-xs font-bold text-blue-600 w-10 text-right">
                  {formatTemp(minTemp, tempUnit)}
                </span>

                <div className="flex-1 bg-[#DDE2E5] h-2 rounded-none relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-[#1A1C1E]"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.min(100, widthPercent)}%`,
                    }}
                  />
                </div>

                <span className="font-mono text-xs font-bold text-[#1A1C1E] w-10">
                  {formatTemp(maxTemp, tempUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
