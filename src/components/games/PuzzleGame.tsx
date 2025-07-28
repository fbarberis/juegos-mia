import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { GameHeader } from './puzzle/GameHeader';
import { GameStats } from './puzzle/GameStats';
import { PuzzleBoard } from './puzzle/PuzzleBoard';
import { GameInstructions } from './puzzle/GameInstructions';
import { GameModals } from './puzzle/GameModals';

const ummaImages = [
  '/lovable-uploads/553c69f9-274a-4a52-bd6a-e00cb0f6e4f9.png',
  '/lovable-uploads/3ef9be5d-46d9-41d7-a2ba-d4de02251305.png',
  '/lovable-uploads/d8cd3a88-2d1c-4b0f-8b2b-d1e06ab82755.png',
  '/lovable-uploads/67776508-9e90-4a70-a9c7-cd078799b64b.png',
  '/lovable-uploads/ecc80e6b-852a-47ec-b4a3-2ab1ea4305d1.png',
  '/lovable-uploads/2fbe45a8-1fac-4fab-9031-9082030a7a7e.png',
  '/lovable-uploads/26ce54a8-1171-43ff-a3be-4b5aefebcd79.png',
  '/lovable-uploads/7cb6377d-de98-4a95-bdfe-7a22dc7590f2.png',
  '/lovable-uploads/4838fa41-cde1-4ef4-b395-f153f2c2752f.png',
  '/lovable-uploads/88ebf91a-dbb8-47c0-9fb5-220c962f3ef2.png'
];

export const PuzzleGame: React.FC = () => {
  const { config } = useAdmin();
  const [boardState, setBoardState] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Changed grid size to 4 rows and 3 columns
  const gridSize = { rows: 4, cols: 3 };
  const totalPieces = gridSize.rows * gridSize.cols;

  // Settings state
  const [timeLimit, setTimeLimit] = useState(30);

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isComplete && !gameOver) {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete, gameOver]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (startTime && !isComplete && !gameOver && timeLeft > 0) {
      countdown = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [startTime, isComplete, gameOver, timeLeft]);

  const initializePuzzle = () => {
    const randomImage = ummaImages[Math.floor(Math.random() * ummaImages.length)];
    setSelectedImage(randomImage);
    
    // Crear array con números del 0 al (totalPieces - 1) y mezclarlo
    const shuffledPieces = Array.from({ length: totalPieces }, (_, i) => i).sort(() => Math.random() - 0.5);
    
    setBoardState(shuffledPieces);
    setSelectedPosition(null);
    setIsComplete(false);
    setGameOver(false);
    setMoves(0);
    setStartTime(null);
    setGameTime(0);
    setTimeLeft(timeLimit);
    setWonPrize(null);
  };

  const handleTimeLimitChange = (newTimeLimit: number) => {
    setTimeLimit(newTimeLimit);
    if (!startTime) {
      setTimeLeft(newTimeLimit);
    }
  };

  const handlePieceClick = (position: number) => {
    if (gameOver || isComplete) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (selectedPosition === null) {
      // Seleccionar la primera pieza
      setSelectedPosition(position);
    } else if (selectedPosition === position) {
      // Deseleccionar si se toca la misma pieza
      setSelectedPosition(null);
    } else {
      // Intercambiar las piezas
      const newBoardState = [...boardState];
      const temp = newBoardState[selectedPosition];
      newBoardState[selectedPosition] = newBoardState[position];
      newBoardState[position] = temp;
      
      setBoardState(newBoardState);
      setMoves(prev => prev + 1);
      setSelectedPosition(null);

      // Verificar si está completo
      const isCompleted = newBoardState.every((pieceId, index) => pieceId === index);
      
      if (isCompleted) {
        setIsComplete(true);
        
        let prizeIndex = 0;
        if (timeLeft > timeLimit * 0.66 && moves < 15) {
          prizeIndex = 0;
        } else if (timeLeft > timeLimit * 0.33 && moves < 25) {
          prizeIndex = 1;
        } else {
          prizeIndex = 2;
        }
        
        setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
      }
    }
  };

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 lg:p-6 xl:p-8 relative overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40, #1e1b4b)`
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header - compacto en 4K */}
        <div className="mb-4 lg:mb-6">
          <GameHeader 
            onNewGame={initializePuzzle} 
            timeLimit={timeLimit}
            onTimeLimitChange={handleTimeLimitChange}
          />
        </div>

        {/* Título - más grande en 4K */}
        <h1 
          className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-white mb-4 lg:mb-8 animate-neon-pulse"
          style={{
            textShadow: `0 0 20px ${config.primaryColor}, 0 0 40px ${config.secondaryColor}`
          }}
        >
          🧩 {config.gameTexts.puzzle}
        </h1>

        {/* Stats - optimizadas para 4K */}
        <div className="mb-6 lg:mb-8">
          <GameStats gameTime={gameTime} moves={moves} timeLeft={timeLeft} />
        </div>

        {/* Área principal del juego - ocupa la mayor parte del espacio */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl">
            <PuzzleBoard
              boardState={boardState}
              selectedImage={selectedImage}
              isComplete={isComplete}
              gameOver={gameOver}
              onPieceClick={handlePieceClick}
              selectedPosition={selectedPosition}
              gridSize={gridSize}
            />
          </div>
        </div>

        {/* Instrucciones - compactas */}
        <div className="mt-4 lg:mt-6">
          <GameInstructions isComplete={isComplete} gameOver={gameOver} />
        </div>

        {/* Modales - centrados */}
        <GameModals
          isComplete={isComplete}
          gameOver={gameOver}
          gameTime={gameTime}
          moves={moves}
          timeLeft={timeLeft}
          wonPrize={wonPrize}
          onNewGame={initializePuzzle}
        />
      </div>
    </div>
  );
};
