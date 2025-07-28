
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

interface PuzzleBoardProps {
  boardState: number[];
  selectedImage: string;
  isComplete: boolean;
  gameOver: boolean;
  onPieceClick: (position: number) => void;
  selectedPosition: number | null;
  gridSize: { rows: number; cols: number };
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  boardState,
  selectedImage,
  isComplete,
  gameOver,
  onPieceClick,
  selectedPosition,
  gridSize
}) => {
  const { config } = useAdmin();

  const getPieceStyle = (pieceId: number) => {
    const row = Math.floor(pieceId / gridSize.cols);
    const col = pieceId % gridSize.cols;
    
    // Calcular el porcentaje de posición correctamente
    const xPercent = (col * 100) / (gridSize.cols - 1);
    const yPercent = (row * 100) / (gridSize.rows - 1);
    
    return {
      backgroundImage: `url(${selectedImage})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundSize: `${gridSize.cols * 100}% ${gridSize.rows * 100}%`,
      backgroundRepeat: 'no-repeat'
    };
  };

  return (
    <div 
      className={`grid gap-1 sm:gap-2 lg:gap-3 xl:gap-4 w-full max-w-lg sm:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto ${
        isComplete ? 'animate-pulse' : ''
      }`}
      style={{ 
        gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
        aspectRatio: `${gridSize.cols}/${gridSize.rows}`,
        filter: gameOver ? 'grayscale(100%)' : 'none'
      }}
    >
      {boardState.map((pieceId, position) => (
        <div
          key={position}
          onClick={() => onPieceClick(position)}
          className={`
            rounded-lg overflow-hidden cursor-pointer
            transition-all duration-300 transform hover:scale-105
            ${selectedPosition === position 
              ? 'ring-4 ring-opacity-80 shadow-2xl scale-105' 
              : 'hover:shadow-lg'
            }
            ${isComplete ? 'animate-bounce' : ''}
            ${gameOver ? 'cursor-not-allowed opacity-50' : ''}
          `}
          style={{
            ...getPieceStyle(pieceId),
            aspectRatio: '1/1',
            ...(selectedPosition === position ? { ringColor: config.secondaryColor } : {})
          }}
        />
      ))}
    </div>
  );
};
