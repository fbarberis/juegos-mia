
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Clock } from 'lucide-react';

const COLORS = [
  { name: 'Rojo', hex: '#ef4444', rgb: 'rgb(239, 68, 68)' },
  { name: 'Azul', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
  { name: 'Verde', hex: '#10b981', rgb: 'rgb(16, 185, 129)' },
  { name: 'Amarillo', hex: '#f59e0b', rgb: 'rgb(245, 158, 11)' },
  { name: 'Morado', hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)' },
  { name: 'Rosa', hex: '#ec4899', rgb: 'rgb(236, 72, 153)' },
  { name: 'Naranja', hex: '#f97316', rgb: 'rgb(249, 115, 22)' },
  { name: 'Cyan', hex: '#06b6d4', rgb: 'rgb(6, 182, 212)' }
];

interface ColorPair {
  id: number;
  colorName: string;
  colorHex: string;
  displayColor: string;
  isMatched: boolean;
  isSelected: boolean;
}

export const ColorMatchGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [pairs, setPairs] = useState<ColorPair[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, timeLeft]);

  const initializeGame = () => {
    const selectedColors = COLORS.slice(0, 6);
    const gamePairs: ColorPair[] = [];
    
    selectedColors.forEach((color, index) => {
      // Color name card
      gamePairs.push({
        id: index * 2,
        colorName: color.name,
        colorHex: color.hex,
        displayColor: '#374151', // Gray background for text
        isMatched: false,
        isSelected: false
      });
      
      // Color swatch card
      gamePairs.push({
        id: index * 2 + 1,
        colorName: color.name,
        colorHex: color.hex,
        displayColor: color.hex,
        isMatched: false,
        isSelected: false
      });
    });
    
    // Shuffle the pairs
    const shuffled = gamePairs.sort(() => Math.random() - 0.5);
    setPairs(shuffled);
    setSelectedPairs([]);
    setMatchedPairs(0);
    setTimeLeft(60);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setWonPrize(null);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handlePairClick = (pairId: number) => {
    if (!gameStarted || gameOver) return;
    
    const pair = pairs.find(p => p.id === pairId);
    if (!pair || pair.isMatched || pair.isSelected) return;
    
    if (selectedPairs.length === 0) {
      setSelectedPairs([pairId]);
      setPairs(prev => prev.map(p => 
        p.id === pairId ? { ...p, isSelected: true } : p
      ));
    } else if (selectedPairs.length === 1) {
      if (selectedPairs[0] === pairId) {
        // Deselect if clicking the same pair
        setSelectedPairs([]);
        setPairs(prev => prev.map(p => 
          p.id === pairId ? { ...p, isSelected: false } : p
        ));
        return;
      }

      const firstPair = pairs.find(p => p.id === selectedPairs[0]);
      const secondPair = pair;
      
      setSelectedPairs([...selectedPairs, pairId]);
      setPairs(prev => prev.map(p => 
        p.id === pairId ? { ...p, isSelected: true } : p
      ));
      
      setTimeout(() => {
        if (firstPair && secondPair && firstPair.colorName === secondPair.colorName) {
          // Match found
          setPairs(prev => prev.map(p => 
            p.colorName === firstPair.colorName 
              ? { ...p, isMatched: true, isSelected: false }
              : { ...p, isSelected: false }
          ));
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + 10 + Math.floor(timeLeft / 10));
          
          // Check if game is complete
          if (matchedPairs + 1 >= 6) {
            setGameOver(true);
            setGameStarted(false);
            
            let prizeIndex = 0;
            if (timeLeft > 40) {
              prizeIndex = 0; // Fast completion
            } else if (timeLeft > 20) {
              prizeIndex = 1; // Good time
            } else {
              prizeIndex = 2; // Completed
            }
            setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
          }
        } else {
          // No match
          setPairs(prev => prev.map(p => ({ ...p, isSelected: false })));
        }
        setSelectedPairs([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-orange-900 p-6 relative overflow-hidden">
      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 touch-manipulation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-white mb-6 animate-neon-pulse">
          🎨 {config.gameTexts.colorMatch}
        </h1>

        {/* Game Stats */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-300 text-sm">Tiempo</p>
              <p className="text-white text-xl font-bold flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Parejas</p>
              <p className="text-white text-xl font-bold">{matchedPairs}/6</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Puntos</p>
              <p className="text-white text-xl font-bold">{score}</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        {!gameStarted && !gameOver && (
          <div className="text-center mb-6">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 text-xl font-bold rounded-full touch-manipulation"
            >
              Iniciar Juego
            </Button>
          </div>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {pairs.map((pair) => (
            <div
              key={pair.id}
              className={`
                aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center
                select-none touch-manipulation
                ${pair.isMatched 
                  ? 'border-green-400 opacity-50 scale-95' 
                  : pair.isSelected 
                    ? 'border-yellow-400 scale-105 shadow-lg shadow-yellow-400/50' 
                    : 'border-white/30 hover:border-white/60 active:scale-95'
                }
                ${!gameStarted ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{ backgroundColor: pair.displayColor }}
              onClick={() => handlePairClick(pair.id)}
            >
              {pair.displayColor === '#374151' ? (
                <span className="text-white font-bold text-sm text-center px-2">
                  {pair.colorName}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Game Over Messages */}
        {gameOver && !wonPrize && timeLeft === 0 && (
          <div className="bg-red-600/80 rounded-lg p-6 text-center backdrop-blur-sm mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">¡Tiempo Agotado!</h2>
            <p className="text-white">Parejas encontradas: {matchedPairs}/6</p>
            <p className="text-white">Puntuación: {score}</p>
          </div>
        )}

        {/* Win Message */}
        {wonPrize && (
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-pink-300 shadow-xl backdrop-blur-sm">
            <div className="text-4xl mb-2 animate-bounce">🎊🎨🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Excelente!</h2>
            <p className="text-white mb-2">
              Tiempo restante: {formatTime(timeLeft)} | Puntos: {score}
            </p>
            <p className="text-white text-lg font-semibold">{wonPrize}</p>
            <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Instructions */}
        {!gameStarted && !gameOver && (
          <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-sm">
              🎯 Toca para emparejar cada color con su nombre<br/>
              ⏰ Tienes 60 segundos para encontrar todas las parejas<br/>
              🏆 Completa rápido para obtener más puntos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
