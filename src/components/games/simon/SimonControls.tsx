
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface SimonControlsProps {
  isPlaying: boolean;
  gameWon: boolean;
  gameOver: boolean;
  onStartGame: () => void;
}

export const SimonControls: React.FC<SimonControlsProps> = ({
  isPlaying,
  gameWon,
  gameOver,
  onStartGame
}) => {
  const { config } = useAdmin();

  if (isPlaying || gameWon) return null;

  return (
    <div className="text-center mb-6">
      <Button
        onClick={onStartGame}
        className="px-8 py-4 text-xl font-bold rounded-full"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
          color: 'white'
        }}
      >
        <Play className="w-6 h-6 mr-2" />
        {gameOver ? 'Jugar de Nuevo' : 'Iniciar Juego'}
      </Button>
    </div>
  );
};
