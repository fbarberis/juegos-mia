
import React from 'react';

interface GameInstructionsProps {
  isComplete: boolean;
  gameOver: boolean;
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({ isComplete, gameOver }) => {
  if (isComplete || gameOver) {
    return null;
  }

  return (
    <div className="bg-black/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm mt-4 sm:mt-6 max-w-2xl mx-auto">
      <p className="text-white mb-2 text-sm sm:text-base">
        🎯 Arrastra las piezas para intercambiar posiciones
      </p>
      <p className="text-gray-400 text-xs sm:text-sm">
        💡 También puedes hacer clic en una pieza para moverla automáticamente
      </p>
      <p className="text-yellow-400 text-xs sm:text-sm mt-1">
        ⭐ Las piezas en posición correcta se marcan en amarillo
      </p>
    </div>
  );
};
