import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { CityLocation } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, country_code: 'GB' },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006, country_code: 'US' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, country_code: 'JP' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, country_code: 'FR' },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, country_code: 'AU' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, country_code: 'AE' },
  { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, country_code: 'IN' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, country_code: 'SG' },
];

interface PopularCitiesProps {
  currentCityName: string;
  onSelectCity: (city: CityLocation) => void;
  favorites: CityLocation[];
  onToggleFavorite: (city: CityLocation) => void;
}

export const PopularCities: React.FC<PopularCitiesProps> = ({
  currentCityName,
  onSelectCity,
  favorites,
  onToggleFavorite,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#6C757D] flex items-center gap-1.5 mr-1">
        <MapPin className="w-3.5 h-3.5 text-[#1A1C1E]" /> LOCATIONS:
      </span>

      {/* Favorites if any */}
      {favorites.map((city) => {
        const isCurrent = currentCityName.toLowerCase() === city.name.toLowerCase();
        return (
          <button
            key={`fav-${city.name}-${city.latitude}`}
            id={`quick-fav-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelectCity(city)}
            className={`px-2.5 py-1 text-xs font-mono font-bold flex items-center space-x-1 transition rounded-none border ${
              isCurrent
                ? 'bg-[#1A1C1E] text-white border-[#1A1C1E]'
                : 'bg-white text-[#1A1C1E] border-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{city.name}</span>
          </button>
        );
      })}

      {/* Popular Presets */}
      {POPULAR_CITIES.map((city) => {
        const isCurrent = currentCityName.toLowerCase() === city.name.toLowerCase();
        if (favorites.some((f) => f.name.toLowerCase() === city.name.toLowerCase())) return null;

        return (
          <button
            key={`pop-${city.name}`}
            id={`quick-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelectCity(city)}
            className={`px-2.5 py-1 text-xs font-mono font-bold transition rounded-none border ${
              isCurrent
                ? 'bg-[#1A1C1E] text-white border-[#1A1C1E]'
                : 'bg-white text-[#1A1C1E] border-[#DDE2E5] hover:border-[#1A1C1E]'
            }`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};
