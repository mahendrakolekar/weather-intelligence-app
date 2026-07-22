import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudFog,
  Wind,
  Umbrella,
  Shirt,
  SunDim,
  Droplets,
  Droplet,
  Footprints,
  Bike,
  Utensils,
  Sparkles,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  MapPin,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-6 h-6',
  size,
}) => {
  const props = { className, ...(size ? { size } : {}) };

  switch (name) {
    case 'Sun':
      return <Sun {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'CloudMoon':
      return <CloudMoon {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'Snowflake':
      return <Snowflake {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'SunDim':
      return <SunDim {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Droplet':
      return <Droplet {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Bike':
      return <Bike {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Gauge':
      return <Gauge {...props} />;
    case 'Sunrise':
      return <Sunrise {...props} />;
    case 'Sunset':
      return <Sunset {...props} />;
    case 'Eye':
      return <Eye {...props} />;
    case 'MapPin':
      return <MapPin {...props} />;
    default:
      return <Cloud {...props} />;
  }
};
