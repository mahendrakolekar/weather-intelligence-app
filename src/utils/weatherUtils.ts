import {
  CurrentWeatherData,
  DailyForecastData,
  Recommendation,
  ActivityScore,
  TempUnit,
} from '../types';

export interface WmoInfo {
  label: string;
  description: string;
  iconName: string; // Lucide icon identifier
  bgGradient: string;
  cardTheme: string;
  isRainy: boolean;
  isSnowy: boolean;
  isSevere: boolean;
}

/**
 * Returns weather condition information based on WMO Weather Interpretation Code
 */
export function getWmoInfo(code: number, isDay: number = 1): WmoInfo {
  const day = isDay === 1;

  switch (code) {
    case 0:
      return {
        label: day ? 'Clear Sky' : 'Clear Night',
        description: day ? 'Bright and sunny skies' : 'Clear starlit sky',
        iconName: day ? 'Sun' : 'Moon',
        bgGradient: day
          ? 'from-amber-500/10 via-sky-500/10 to-blue-600/10'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        cardTheme: day ? 'bg-amber-500/5 border-amber-200/40' : 'bg-indigo-950/20 border-indigo-800/30',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
    case 1:
      return {
        label: day ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Mostly sunny with few passing clouds',
        iconName: day ? 'Sun' : 'Moon',
        bgGradient: 'from-sky-400/10 via-blue-500/10 to-indigo-500/10',
        cardTheme: 'bg-sky-500/5 border-sky-200/40',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periodic sun',
        iconName: day ? 'CloudSun' : 'CloudMoon',
        bgGradient: 'from-slate-400/10 via-sky-500/10 to-blue-600/10',
        cardTheme: 'bg-slate-500/5 border-slate-200/40',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense gray cloud cover',
        iconName: 'Cloud',
        bgGradient: 'from-slate-500/10 via-slate-600/10 to-zinc-700/10',
        cardTheme: 'bg-slate-600/5 border-slate-300/40',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
    case 45:
    case 48:
      return {
        label: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        description: 'Reduced visibility due to fog',
        iconName: 'CloudFog',
        bgGradient: 'from-zinc-400/10 via-slate-400/10 to-gray-500/10',
        cardTheme: 'bg-zinc-500/5 border-zinc-200/40',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: code === 51 ? 'Light drizzle' : code === 53 ? 'Moderate drizzle' : 'Dense drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-teal-500/10 via-cyan-600/10 to-sky-700/10',
        cardTheme: 'bg-teal-500/5 border-teal-200/40',
        isRainy: true,
        isSnowy: false,
        isSevere: false,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Freezing rain/drizzle causing icy surfaces',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-500/10 via-blue-600/10 to-slate-700/10',
        cardTheme: 'bg-cyan-500/5 border-cyan-200/40',
        isRainy: true,
        isSnowy: true,
        isSevere: true,
      };
    case 61:
    case 63:
    case 65:
      return {
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Heavy downpours expected' : 'Continuous rainfall',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600/10 via-indigo-600/10 to-slate-700/10',
        cardTheme: 'bg-blue-500/5 border-blue-200/40',
        isRainy: true,
        isSnowy: false,
        isSevere: code === 65,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Hazardous freezing rain',
        iconName: 'CloudRainWind',
        bgGradient: 'from-indigo-600/10 via-slate-700/10 to-blue-900/10',
        cardTheme: 'bg-indigo-500/5 border-indigo-200/40',
        isRainy: true,
        isSnowy: true,
        isSevere: true,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: 'Snow accumulation likely',
        iconName: 'Snowflake',
        bgGradient: 'from-blue-300/10 via-cyan-400/10 to-sky-500/10',
        cardTheme: 'bg-sky-400/5 border-sky-200/40',
        isRainy: false,
        isSnowy: true,
        isSevere: code === 75,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: code === 82 ? 'Violent Rain Showers' : 'Rain Showers',
        description: 'Passing rain showers',
        iconName: 'CloudRain',
        bgGradient: 'from-sky-600/10 via-blue-700/10 to-indigo-800/10',
        cardTheme: 'bg-sky-600/5 border-sky-200/40',
        isRainy: true,
        isSnowy: false,
        isSevere: code === 82,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Intermittent snow showers',
        iconName: 'Snowflake',
        bgGradient: 'from-indigo-300/10 via-sky-400/10 to-blue-500/10',
        cardTheme: 'bg-indigo-300/5 border-indigo-200/40',
        isRainy: false,
        isSnowy: true,
        isSevere: code === 86,
      };
    case 95:
    case 96:
    case 99:
      return {
        label: code === 95 ? 'Thunderstorm' : 'Severe Thunderstorm',
        description: code === 95 ? 'Thunder and lightning expected' : 'Thunderstorm with hail hazard',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900/10 via-indigo-900/10 to-slate-900/10',
        cardTheme: 'bg-purple-500/5 border-purple-200/40',
        isRainy: true,
        isSnowy: false,
        isSevere: true,
      };
    default:
      return {
        label: 'Unknown Weather',
        description: 'Current local weather conditions',
        iconName: 'Cloud',
        bgGradient: 'from-slate-400/10 via-slate-500/10 to-slate-600/10',
        cardTheme: 'bg-slate-500/5 border-slate-200/40',
        isRainy: false,
        isSnowy: false,
        isSevere: false,
      };
  }
}

/**
 * Temperature converter helper
 */
export function formatTemp(tempC: number, unit: TempUnit): string {
  if (unit === 'F') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°`;
  }
  return `${Math.round(tempC)}°`;
}

/**
 * Formats wind speed
 */
export function formatWind(speedKmH: number, unit: TempUnit): string {
  if (unit === 'F') {
    const mph = Math.round(speedKmH * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmH)} km/h`;
}

/**
 * Returns wind direction cardinal string from degrees
 */
export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/**
 * Converts ISO date string to short Day Name (e.g. "Mon", "Today")
 */
export function formatDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Formats full date (e.g. "Jul 22")
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats ISO time string to 12h time (e.g. "2:00 PM")
 */
export function formatTime12h(timeStr: string): string {
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) return timeStr;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Weather Intelligence Engine: generates actionable recommendations based on weather parameters
 */
export function generateIntelligence(
  current: CurrentWeatherData,
  daily: DailyForecastData
): Recommendation[] {
  const recs: Recommendation[] = [];
  const maxRainProb = daily.precipitation_probability_max?.[0] || 0;
  const maxUv = daily.uv_index_max?.[0] || 0;
  const temp = current.temperature_2m;
  const apparentTemp = current.apparent_temperature;
  const wind = current.wind_speed_10m;
  const humidity = current.relative_humidity_2m;
  const weatherCode = current.weather_code;
  const wmoInfo = getWmoInfo(weatherCode, current.is_day);

  // 1. Rain & Umbrella Intelligence
  if (wmoInfo.isRainy || current.precipitation > 0 || maxRainProb > 40) {
    if (wmoInfo.isSevere || maxRainProb > 70 || current.precipitation > 2) {
      recs.push({
        id: 'umbrella-high',
        category: 'umbrella',
        title: 'Rain Protection Essential',
        detail: `High precipitation expected today (${maxRainProb}% max chance). Carry an umbrella and waterproof jacket.`,
        type: 'alert',
        iconName: 'Umbrella',
      });
    } else {
      recs.push({
        id: 'umbrella-mod',
        category: 'umbrella',
        title: 'Bring an Umbrella',
        detail: `Scattered rain or drizzle expected (${maxRainProb}% probability). Keep a compact umbrella handy.`,
        type: 'warning',
        iconName: 'Umbrella',
      });
    }
  } else {
    recs.push({
      id: 'umbrella-none',
      category: 'umbrella',
      title: 'No Umbrella Needed',
      detail: 'Dry conditions forecast for today. Low rain probability throughout.',
      type: 'success',
      iconName: 'Sun',
    });
  }

  // 2. Clothing Advice Intelligence
  if (apparentTemp <= 2) {
    recs.push({
      id: 'clothing-freezing',
      category: 'clothing',
      title: 'Heavy Winter Apparel',
      detail: `Freezing feels-like temp (${Math.round(apparentTemp)}°C). Wear heavy coat, thermal layers, beanie, and gloves.`,
      type: 'alert',
      iconName: 'Shirt',
    });
  } else if (apparentTemp <= 12) {
    recs.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Warm Layers Required',
      detail: `Chilly conditions (${Math.round(apparentTemp)}°C feels like). Wear a warm jacket, fleece, or sweater.`,
      type: 'warning',
      iconName: 'Shirt',
    });
  } else if (apparentTemp <= 20) {
    recs.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Light Jacket or Hoodie',
      detail: `Mild weather (${Math.round(apparentTemp)}°C). A light hoodie or cardigan will keep you comfortable.`,
      type: 'info',
      iconName: 'Shirt',
    });
  } else if (apparentTemp <= 28) {
    recs.push({
      id: 'clothing-warm',
      category: 'clothing',
      title: 'Light Comfortable Attire',
      detail: 'Pleasant, warm temperatures. T-shirt and breathable cotton fabrics recommended.',
      type: 'success',
      iconName: 'Shirt',
    });
  } else {
    recs.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Breathable & Light Clothing',
      detail: `Hot weather (${Math.round(apparentTemp)}°C feels like). Wear loose, light-colored clothes and stay hydrated.`,
      type: 'warning',
      iconName: 'Shirt',
    });
  }

  // 3. UV Sun Protection Intelligence
  if (maxUv >= 8) {
    recs.push({
      id: 'uv-extreme',
      category: 'sun',
      title: 'Extreme UV Advisory',
      detail: `Peak UV Index of ${maxUv.toFixed(1)}. Apply SPF 50+ sunscreen, wear UV sunglasses, and seek shade 11am-4pm.`,
      type: 'alert',
      iconName: 'SunDim',
    });
  } else if (maxUv >= 5) {
    recs.push({
      id: 'uv-moderate',
      category: 'sun',
      title: 'Sun Protection Recommended',
      detail: `Moderate to high UV Index (${maxUv.toFixed(1)}). Apply SPF 30+ sunscreen if spending over 20 mins outside.`,
      type: 'warning',
      iconName: 'Sun',
    });
  } else {
    recs.push({
      id: 'uv-low',
      category: 'sun',
      title: 'Low UV Exposure',
      detail: `Max UV Index is ${maxUv.toFixed(1)}. Minimal sun protection needed for short outdoor trips.`,
      type: 'info',
      iconName: 'Sun',
    });
  }

  // 4. Wind & Gust Intelligence
  if (wind >= 30) {
    recs.push({
      id: 'wind-strong',
      category: 'wind',
      title: 'High Wind Warning',
      detail: `Breezy conditions at ${Math.round(wind)} km/h. Secure loose outdoor objects and take care while driving.`,
      type: 'alert',
      iconName: 'Wind',
    });
  }

  // 5. Humidity / Air Comfort
  if (humidity >= 85) {
    recs.push({
      id: 'humidity-high',
      category: 'alert',
      title: 'High Humidity Level',
      detail: `Relative humidity at ${humidity}%. Air may feel muggy and heavy during physical activity.`,
      type: 'info',
      iconName: 'Droplets',
    });
  } else if (humidity <= 25) {
    recs.push({
      id: 'humidity-low',
      category: 'alert',
      title: 'Dry Air Conditions',
      detail: `Low humidity (${humidity}%). Stay hydrated and consider using lip balm and skin moisturizer.`,
      type: 'info',
      iconName: 'Droplet',
    });
  }

  return recs;
}

/**
 * Calculates suitability scores (0-100) for common outdoor activities
 */
export function calculateActivityScores(current: CurrentWeatherData): ActivityScore[] {
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const precip = current.precipitation;
  const clouds = current.cloud_cover;
  const isDay = current.is_day === 1;

  // Running
  let runScore = 100;
  if (temp < 5 || temp > 28) runScore -= 30;
  if (temp < 0 || temp > 34) runScore -= 40;
  if (precip > 0.5) runScore -= 40;
  if (wind > 25) runScore -= 20;
  runScore = Math.max(0, Math.min(100, runScore));

  // Cycling
  let bikeScore = 100;
  if (wind > 20) bikeScore -= 30;
  if (wind > 35) bikeScore -= 50;
  if (precip > 0.1) bikeScore -= 50;
  if (temp < 5 || temp > 32) bikeScore -= 25;
  bikeScore = Math.max(0, Math.min(100, bikeScore));

  // Outdoor Dining
  let diningScore = 100;
  if (!isDay) diningScore -= 20;
  if (temp < 16 || temp > 30) diningScore -= 35;
  if (precip > 0) diningScore -= 80;
  if (wind > 20) diningScore -= 30;
  diningScore = Math.max(0, Math.min(100, diningScore));

  // Stargazing (night only, clear skies)
  let starScore = 100;
  if (isDay) starScore = 10; // Not suitable during day
  else {
    starScore -= clouds * 0.8;
    if (precip > 0) starScore = 0;
  }
  starScore = Math.max(0, Math.min(100, Math.round(starScore)));

  const getStatus = (score: number): 'Ideal' | 'Good' | 'Moderate' | 'Poor' => {
    if (score >= 80) return 'Ideal';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Poor';
  };

  return [
    {
      name: 'Running / Jogging',
      score: runScore,
      status: getStatus(runScore),
      iconName: 'Footprints',
      reason: precip > 0 ? 'Wet conditions' : wind > 25 ? 'High wind resistance' : 'Good climate for sports',
    },
    {
      name: 'Cycling / Biking',
      score: bikeScore,
      status: getStatus(bikeScore),
      iconName: 'Bike',
      reason: wind > 20 ? 'Strong headwinds expected' : precip > 0 ? 'Slippery roads' : 'Favorable road weather',
    },
    {
      name: 'Outdoor Dining',
      score: diningScore,
      status: getStatus(diningScore),
      iconName: 'Utensils',
      reason: precip > 0 ? 'Rain present' : temp < 16 ? 'Cool outdoor ambient' : 'Comfortable ambient temperature',
    },
    {
      name: 'Night Stargazing',
      score: starScore,
      status: getStatus(starScore),
      iconName: 'Sparkles',
      reason: isDay ? 'Daytime (wait for sunset)' : clouds > 40 ? 'Cloud cover blocking visibility' : 'Clear dark sky',
    },
  ];
}
