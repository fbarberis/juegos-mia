
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { PuzzleSettings } from './PuzzleSettings';

interface GameHeaderProps {
  onNewGame: () => void;
  timeLimit: number;
  onTimeLimitChange: (value: number) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  onNewGame, 
  timeLimit, 
  onTimeLimitChange 
}) => {
  const navigate = useNavigate();
  const { config } = useAdmin();

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <Button 
        onClick={() => navigate('/')} 
        variant="outline"
        size="sm"
        className="bg-black/20 border-white/20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Volver</span>
      </Button>
      
      {config.logoUrl && (
        <div className="flex justify-center">
          <img 
            src={config.logoUrl} 
            alt={config.brandName}
            className="h-8 sm:h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex gap-2">
        <PuzzleSettings
          timeLimit={timeLimit}
          onTimeLimitChange={onTimeLimitChange}
        />
        <Button
          onClick={onNewGame}
          variant="outline"
          size="sm"
          className="bg-black/20 border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Nueva</span>
        </Button>
      </div>
    </div>
  );
};
