
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

interface SimonInstructionsProps {
  isPlaying: boolean;
  gameOver: boolean;
  gameWon: boolean;
  targetSequenceLength: number;
}

export const SimonInstructions: React.FC<SimonInstructionsProps> = ({
  isPlaying,
  gameOver,
  gameWon,
  targetSequenceLength
}) => {
  const { config } = useAdmin();

  if (isPlaying || gameOver || gameWon) return null;

  return (
    <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
      <p className="text-gray-300 text-sm">
        🎯 Memoriza y repite la secuencia de fotos de Uma<br/>
        🏆 Llega al nivel {targetSequenceLength} para ganar
      </p>
      <p className="text-gray-400 text-xs mt-1">
        Celebrando el {config.eventTheme.eventType} de {config.eventTheme.personName} 🎂
      </p>
    </div>
  );
};
