import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, Info, Activity } from 'lucide-react';
import { CurrentWeatherData, DailyForecastData } from '../types';
import { generateIntelligence, calculateActivityScores } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface WeatherIntelligenceCardProps {
  current: CurrentWeatherData;
  daily: DailyForecastData;
}

export const WeatherIntelligenceCard: React.FC<WeatherIntelligenceCardProps> = ({
  current,
  daily,
}) => {
  const recommendations = generateIntelligence(current, daily);
  const activityScores = calculateActivityScores(current);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'bg-[#FF4B4B]/10 border-[#FF4B4B]',
          badge: 'bg-[#FF4B4B] text-white',
          icon: <ShieldAlert className="w-5 h-5 text-[#FF4B4B]" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500',
          badge: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        };
      case 'success':
        return {
          bg: 'bg-[#00FF41]/10 border-[#00FF41]',
          badge: 'bg-[#00FF41] text-[#1A1C1E]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#00FF41]" />,
        };
      default:
        return {
          bg: 'bg-white/5 border-white/20',
          badge: 'bg-white/20 text-white',
          icon: <Info className="w-5 h-5 text-white" />,
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-[#00FF41] text-[#00FF41]';
    if (score >= 60) return 'bg-sky-400 text-sky-400';
    if (score >= 40) return 'bg-amber-400 text-amber-400';
    return 'bg-[#FF4B4B] text-[#FF4B4B]';
  };

  return (
    <div className="bg-[#1A1C1E] text-white p-6 sm:p-7 rounded-none border border-[#1A1C1E] shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#00FF41] rounded-full animate-pulse" />
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <span>INTELLIGENCE FEED</span>
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
              REAL-TIME INSIGHTS & OUTDOOR ACTIVITY SUITABILITY
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-white/20 text-white/80">
          SYS.VER: 2.0.4
        </span>
      </div>

      {/* Grid of Actionable Recommendations */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec) => {
          const style = getTypeStyles(rec.type);
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-none border ${style.bg} flex items-start space-x-3.5 transition`}
            >
              <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {rec.title}
                  </h4>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/20 text-white/80 bg-black/40">
                    {rec.category}
                  </span>
                </div>
                <p className="font-mono text-xs text-white/80 mt-1 leading-relaxed">
                  {rec.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outdoor Activities Suitability Matrix */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-4 h-4 text-[#00FF41]" />
          <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
            ACTIVITY SUITABILITY INDEX
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activityScores.map((act) => {
            const scoreColor = getScoreColor(act.score);
            const [barBg, textColor] = scoreColor.split(' ');
            return (
              <div
                key={act.name}
                className="p-3.5 rounded-none bg-black/40 border border-white/10 flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white/10 text-white">
                      <WeatherIcon name={act.iconName} className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white uppercase">
                      {act.name}
                    </span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${textColor}`}>
                    {act.score}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="w-full bg-white/10 h-1.5 rounded-none overflow-hidden">
                    <div
                      className={`h-full rounded-none transition-all duration-500 ${barBg}`}
                      style={{ width: `${act.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 font-mono text-[10px]">
                    <span className="font-bold text-white/90 uppercase">
                      {act.status}
                    </span>
                    <span className="text-white/50 truncate max-w-[120px]" title={act.reason}>
                      {act.reason}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
