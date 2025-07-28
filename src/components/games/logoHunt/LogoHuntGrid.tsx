
import React from 'react';
import { Sparkles } from 'lucide-react';

interface Cell {
  id: number;
  hasLogo: boolean;
  isRevealed: boolean;
  isFound: boolean;
  imageUrl?: string;
  partyItem?: string;
}

interface LogoHuntGridProps {
  cells: Cell[];
  gridSize: number;
  config: any;
  onCellClick: (cellId: number) => void;
}

export const LogoHuntGrid: React.FC<LogoHuntGridProps> = ({
  cells,
  gridSize,
  config,
  onCellClick
}) => {
  return (
    <div 
      className={`grid gap-3 mb-8`}
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        aspectRatio: '1'
      }}
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          onClick={() => onCellClick(cell.id)}
          className={`
            aspect-square rounded-lg flex items-center justify-center cursor-pointer
            transition-all duration-500 transform hover:scale-105 hover:rotate-2
            ${cell.isRevealed 
              ? 'shadow-2xl animate-flip' 
              : 'hover:shadow-md hover:brightness-110'
            }
            ${cell.isFound ? 'animate-bounce ring-4 ring-opacity-60' : ''}
            overflow-hidden
          `}
          style={{
            background: cell.isRevealed 
              ? cell.hasLogo 
                ? `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                : 'linear-gradient(135deg, #6b7280, #374151)'
              : `linear-gradient(135deg, ${config.primaryColor}60, ${config.secondaryColor}60)`,
            ...(cell.isFound ? { ringColor: config.secondaryColor } : {})
          }}
        >
          {cell.isRevealed ? (
            cell.hasLogo ? (
              <div className="w-full h-full relative">
                <img 
                  src={cell.imageUrl} 
                  alt="Foto de Umma encontrada"
                  className="w-full h-full object-cover object-top rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="text-center opacity-60">
                <div className="text-xl">{cell.partyItem}</div>
              </div>
            )
          ) : (
            <div className="text-center">
              <div className="text-3xl animate-pulse">✨</div>
              <div className="text-xs text-white/60 mt-1">?</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
