
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { Clock } from 'lucide-react';

interface GameStatsProps {
  gameTime: number;
  moves: number;
  timeLeft: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameTime, moves, timeLeft }) => {
  const { config } = useAdmin();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="rounded-lg p-4 lg:p-6 xl:p-8 backdrop-blur-sm border max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto"
      style={{
        backgroundColor: `${config.primaryColor}20`,
        borderColor: `${config.secondaryColor}40`
      }}
    >
      <div className="grid grid-cols-3 gap-4 lg:gap-8 xl:gap-12 text-center">
        <div>
          <p className="text-gray-300 text-sm lg:text-lg xl:text-xl">Tiempo</p>
          <p className="text-white text-xl lg:text-3xl xl:text-4xl font-bold">{formatTime(gameTime)}</p>
        </div>
        <div>
          <p className="text-gray-300 text-sm lg:text-lg xl:text-xl">Movimientos</p>
          <p className="text-white text-xl lg:text-3xl xl:text-4xl font-bold">{moves}</p>
        </div>
        <div>
          <div className="flex items-center justify-center mb-2">
            <Clock className={`w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mr-1 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
          </div>
          <p className={`text-xl lg:text-3xl xl:text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>
    </div>
  );
};
