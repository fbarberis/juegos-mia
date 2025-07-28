
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { LogoHuntSettings } from './LogoHuntSettings';

interface LogoHuntHeaderProps {
  config: any;
  maxAttempts: number;
  logosToFind: number;
  gridSize: number;
  gameAttempts: number;
  maxGameAttempts: number;
  isGameComplete: boolean;
  onMaxAttemptsChange: (value: number) => void;
  onLogosToFindChange: (value: number) => void;
  onGridSizeChange: (value: number) => void;
  onResetGame: () => void;
}

export const LogoHuntHeader: React.FC<LogoHuntHeaderProps> = ({
  config,
  maxAttempts,
  logosToFind,
  gridSize,
  gameAttempts,
  maxGameAttempts,
  isGameComplete,
  onMaxAttemptsChange,
  onLogosToFindChange,
  onGridSizeChange,
  onResetGame
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button 
        onClick={() => navigate('/')} 
        variant="outline"
        className="bg-black/20 border-white/20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
      
      {config.logoUrl && (
        <div className="flex justify-center">
          <img 
            src={config.logoUrl} 
            alt={config.brandName}
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex gap-2">
        <LogoHuntSettings
          maxAttempts={maxAttempts}
          logosToFind={logosToFind}
          gridSize={gridSize}
          onMaxAttemptsChange={onMaxAttemptsChange}
          onLogosToFindChange={onLogosToFindChange}
          onGridSizeChange={onGridSizeChange}
        />
        <Button
          onClick={onResetGame}
          variant="outline"
          className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          disabled={gameAttempts >= maxGameAttempts || isGameComplete}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          ({gameAttempts}/{maxGameAttempts})
        </Button>
      </div>
    </div>
  );
};
