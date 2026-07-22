import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation } from 'lucide-react';
import { CityLocation, TempUnit } from '../types';
import { searchCities } from '../services/weatherService';

interface HeaderProps {
  currentCity: CityLocation | null;
  onSelectCity: (city: CityLocation) => void;
  tempUnit: TempUnit;
  onToggleUnit: () => void;
  onGeolocate: () => void;
  isGeolocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  tempUnit,
  onToggleUnit,
  onGeolocate,
  isGeolocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const cities = await searchCities(query);
        setResults(cities);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    } else if (query.trim().length >= 2) {
      searchCities(query).then((cities) => {
        if (cities.length > 0) {
          handleSelect(cities[0]);
        }
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DDE2E5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1A1C1E] flex items-center justify-center rounded-none shadow-sm">
                <div className="w-5 h-5 border-2 border-white rotate-45" />
              </div>
              <div>
                <h1 className="font-bold tracking-tighter text-xl uppercase text-[#1A1C1E]">
                  Weather.Intel
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6C757D]">
                  Open-Meteo Realtime Engine
                </p>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                id="unit-toggle-btn-mobile"
                onClick={onToggleUnit}
                className="px-2.5 py-1.5 text-xs font-mono font-bold bg-[#F1F3F5] text-[#1A1C1E] border border-[#DDE2E5] hover:bg-[#1A1C1E] hover:text-white transition rounded-none"
              >
                °{tempUnit}
              </button>
              <button
                id="geolocation-btn-mobile"
                onClick={onGeolocate}
                disabled={isGeolocating}
                title="Use current location"
                className="p-2 bg-[#F1F3F5] text-[#1A1C1E] border border-[#DDE2E5] hover:bg-[#1A1C1E] hover:text-white transition disabled:opacity-50 rounded-none"
              >
                {isGeolocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex items-center space-x-3 flex-1 max-w-xl">
            <div className="relative flex-1" ref={dropdownRef}>
              <form onSubmit={handleFormSubmit}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C757D]" />
                  <input
                    id="city-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search city (e.g. London, Tokyo)..."
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F1F3F5] border border-[#DDE2E5] text-[#1A1C1E] placeholder-[#6C757D] font-mono focus:outline-none focus:border-[#1A1C1E] transition rounded-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setResults([]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#1A1C1E]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Live Search Autocomplete Dropdown */}
              {showDropdown && (query.trim().length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#1A1C1E] shadow-2xl overflow-hidden z-50 rounded-none">
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center space-x-2 text-xs font-mono text-[#6C757D]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1A1C1E]" />
                      <span>QUERYING GEONAMES...</span>
                    </div>
                  ) : results.length > 0 ? (
                    <ul className="max-h-64 overflow-y-auto divide-y divide-[#DDE2E5]">
                      {results.map((item, idx) => (
                        <li key={`${item.name}-${item.latitude}-${idx}`}>
                          <button
                            id={`city-option-${idx}`}
                            onClick={() => handleSelect(item)}
                            className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#1A1C1E] hover:text-white transition group rounded-none"
                          >
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-[#6C757D] group-hover:text-white transition" />
                              <span className="font-bold">
                                {item.name}
                              </span>
                              {(item.admin1 || item.country) && (
                                <span className="text-xs text-[#6C757D] group-hover:text-slate-300">
                                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-[#6C757D] group-hover:text-slate-300">
                              {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-xs font-mono text-[#6C757D]">
                      NO MATCHING CITIES FOUND FOR &quot;{query}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Geolocation, Unit Controls, & Lat/Lon Metadata */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                id="geolocation-btn-desktop"
                onClick={onGeolocate}
                disabled={isGeolocating}
                title="Use current location"
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-mono uppercase font-bold bg-[#F1F3F5] text-[#1A1C1E] border border-[#DDE2E5] hover:bg-[#1A1C1E] hover:text-white transition disabled:opacity-50 rounded-none"
              >
                {isGeolocating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span>Locate</span>
              </button>

              <div className="flex items-center border border-[#DDE2E5] bg-[#F1F3F5] p-0.5 rounded-none font-mono">
                <button
                  id="unit-toggle-c"
                  onClick={() => tempUnit !== 'C' && onToggleUnit()}
                  className={`px-3 py-1 text-xs font-bold transition rounded-none ${
                    tempUnit === 'C'
                      ? 'bg-[#1A1C1E] text-white'
                      : 'text-[#6C757D] hover:text-[#1A1C1E]'
                  }`}
                >
                  °C
                </button>
                <button
                  id="unit-toggle-f"
                  onClick={() => tempUnit !== 'F' && onToggleUnit()}
                  className={`px-3 py-1 text-xs font-bold transition rounded-none ${
                    tempUnit === 'F'
                      ? 'bg-[#1A1C1E] text-white'
                      : 'text-[#6C757D] hover:text-[#1A1C1E]'
                  }`}
                >
                  °F
                </button>
              </div>

              {currentCity && (
                <div className="hidden lg:flex gap-3 font-mono text-[10px] uppercase tracking-widest text-[#6C757D] border-l border-[#DDE2E5] pl-4">
                  <span>LAT: {currentCity.latitude.toFixed(2)}</span>
                  <span>LON: {currentCity.longitude.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
