
import React from 'react';

interface LogoHuntStatsProps {
  attempts: number;
  maxAttempts: number;
  logosFound: number;
  logosToFind: number;
  score: number;
  streak: number;
  config: any;
}

export const LogoHuntStats: React.FC<LogoHuntStatsProps> = ({
  attempts,
  maxAttempts,
  logosFound,
  logosToFind,
  score,
  streak,
  config
}) => {
  return (
    <div 
      className="rounded-lg p-4 mb-6 text-center backdrop-blur-sm border"
      style={{
        backgroundColor: `${config.primaryColor}20`,
        borderColor: `${config.secondaryColor}40`
      }}
    >
      <div className="grid grid-cols-4 gap-2 text-white">
        <div>
          <span className="text-gray-400 text-xs">Intentos:</span>
          <div 
            className={`text-lg font-bold ${attempts >= maxAttempts * 0.8 ? 'text-red-400' : ''}`}
            style={attempts < maxAttempts * 0.8 ? { color: config.secondaryColor } : {}}
          >
            {attempts}/{maxAttempts}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Fotos:</span>
          <div 
            className="text-lg font-bold"
            style={{ color: config.primaryColor }}
          >
            {logosFound}/{logosToFind}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Puntos:</span>
          <div 
            className="text-lg font-bold"
            style={{ color: config.secondaryColor }}
          >
            {score}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Racha:</span>
          <div 
            className="text-lg font-bold"
            style={{ color: streak > 0 ? config.primaryColor : '#6b7280' }}
          >
            {streak > 0 ? `🔥${streak}` : '0'}
          </div>
        </div>
      </div>
    </div>
  );
};
