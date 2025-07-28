
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface GameModalsProps {
  isComplete: boolean;
  gameOver: boolean;
  gameTime: number;
  moves: number;
  timeLeft: number;
  wonPrize: string | null;
  onNewGame: () => void;
}

export const GameModals: React.FC<GameModalsProps> = ({
  isComplete,
  gameOver,
  gameTime,
  moves,
  timeLeft,
  wonPrize,
  onNewGame
}) => {
  const { config } = useAdmin();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameOver && !isComplete) {
    return (
      <div 
        className="rounded-lg p-4 sm:p-6 text-center animate-bounce-in border-4 shadow-xl backdrop-blur-sm mt-4 sm:mt-6 max-w-lg mx-auto"
        style={{
          background: `linear-gradient(135deg, #dc2626, #7f1d1d)`,
          borderColor: '#dc2626'
        }}
      >
        <div className="text-3xl sm:text-4xl mb-2">⏰💥⏰</div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">¡Se Acabó el Tiempo!</h2>
        <p className="text-white mb-4 text-sm sm:text-base">
          Tiempo: {formatTime(gameTime)} | Movimientos: {moves}
        </p>
        <Button
          onClick={onNewGame}
          className="bg-white text-red-600 hover:bg-gray-100 font-bold"
        >
          Intentar de Nuevo
        </Button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div 
        className="rounded-lg p-4 sm:p-6 text-center animate-bounce-in border-4 shadow-xl backdrop-blur-sm mt-4 sm:mt-6 max-w-lg mx-auto"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
          borderColor: config.secondaryColor
        }}
      >
        <div className="text-3xl sm:text-4xl mb-2 animate-bounce">
          <Trophy className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-yellow-400" />
          🎊🧩🎊
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">¡Puzzle Completado!</h2>
        <p className="text-white mb-2 text-sm sm:text-base">
          Tiempo: {formatTime(gameTime)} | Movimientos: {moves} | Tiempo restante: {timeLeft}s
        </p>
        {wonPrize && (
          <div className="mt-4">
            <p className="text-white text-base sm:text-lg font-semibold">{wonPrize}</p>
            <div className="mt-2 text-2xl sm:text-3xl animate-spin-slow">🌟</div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
