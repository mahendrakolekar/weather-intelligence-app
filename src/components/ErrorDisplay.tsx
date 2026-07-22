import React from 'react';
import { SearchX, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { CityLocation } from '../types';
import { POPULAR_CITIES } from './PopularCities';

interface ErrorDisplayProps {
  type: 'city_not_found' | 'api_error' | 'geolocation_error';
  message?: string;
  onRetry?: () => void;
  onSelectCity?: (city: CityLocation) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type,
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div className="bg-white rounded-none p-8 border border-[#FF4B4B] text-center max-w-2xl mx-auto my-8">
      <div className="w-12 h-12 bg-[#FF4B4B] text-white flex items-center justify-center mx-auto mb-4 rounded-none">
        {type === 'city_not_found' ? (
          <SearchX className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
      </div>

      <h3 className="text-xl font-bold uppercase tracking-tight text-[#1A1C1E] mb-2">
        {type === 'city_not_found'
          ? 'City Not Found'
          : type === 'geolocation_error'
          ? 'Location Access Unavailable'
          : 'Weather Data Unavailable'}
      </h3>

      <p className="font-mono text-xs text-[#6C757D] max-w-md mx-auto mb-6 uppercase">
        {message ||
          (type === 'city_not_found'
            ? 'We couldn’t find any city matching your search. Please verify the spelling or try searching for a major nearby city.'
            : 'An issue occurred while retrieving weather information. Please check your network connection and try again.')}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 font-mono text-xs font-bold bg-[#1A1C1E] text-white hover:bg-black transition rounded-none mb-6 uppercase"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}

      {/* Suggested Popular Cities */}
      {onSelectCity && (
        <div className="pt-6 border-t border-[#DDE2E5]">
          <span className="font-mono text-[10px] uppercase font-bold text-[#6C757D] block mb-3">
            OR CHOOSE A PRESET DESTINATION:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.slice(0, 5).map((city) => (
              <button
                key={`err-pop-${city.name}`}
                onClick={() => onSelectCity(city)}
                className="px-3 py-1.5 font-mono text-xs font-bold bg-[#F1F3F5] text-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white border border-[#DDE2E5] transition flex items-center space-x-1.5 rounded-none"
              >
                <MapPin className="w-3 h-3" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
