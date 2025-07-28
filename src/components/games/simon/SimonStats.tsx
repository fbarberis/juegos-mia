
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

interface SimonStatsProps {
  level: number;
  score: number;
  isShowingSequence: boolean;
  isPlaying: boolean;
  gameWon: boolean;
  gameOver: boolean;
}

export const SimonStats: React.FC<SimonStatsProps> = ({
  level,
  score,
  isShowingSequence,
  isPlaying,
  gameWon,
  gameOver
}) => {
  const { config } = useAdmin();

  const getStatusText = () => {
    if (isShowingSequence) return '👀 Observa';
    if (!isPlaying) return '⏸️ Pausado';
    if (gameWon) return '🎉 ¡Ganaste!';
    if (gameOver) return '💔 Inténtalo';
    return '🎮 Tu turno';
  };

  return (
    <div 
      className="rounded-lg p-4 mb-6 text-center backdrop-blur-sm border"
      style={{
        backgroundColor: `${config.primaryColor}20`,
        borderColor: `${config.secondaryColor}40`
      }}
    >
      <div className="grid grid-cols-3 gap-4 text-white">
        <div>
          <span className="text-gray-400 text-xs">Nivel:</span>
          <div 
            className="text-xl font-bold"
            style={{ color: config.secondaryColor }}
          >
            {level}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Puntos:</span>
          <div 
            className="text-xl font-bold"
            style={{ color: config.primaryColor }}
          >
            {score}
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Estado:</span>
          <div 
            className="text-sm font-bold"
            style={{ color: config.secondaryColor }}
          >
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
};
