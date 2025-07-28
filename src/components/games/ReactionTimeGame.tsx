
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Zap } from 'lucide-react';

export const ReactionTimeGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'result' | 'finished'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [tooEarly, setTooEarly] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setGameState('ready');
    setReactionTime(null);
    setTooEarly(false);
    
    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      setTooEarly(true);
      setGameState('result');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else if (gameState === 'go') {
      // Correct click
      const endTime = Date.now();
      const reaction = endTime - (startTimeRef.current || 0);
      setReactionTime(reaction);
      setReactionTimes(prev => [...prev, reaction]);
      setGameState('result');
      
      // Update best time
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
      }
    }
  };

  const nextRound = () => {
    if (round >= 5) {
      // Game finished, calculate results
      const avg = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
      setAverageTime(avg);
      setGameState('finished');
      
      // Determine prize based on performance
      let prizeIndex = 0;
      if (avg < 300 && bestTime && bestTime < 250) {
        prizeIndex = 0; // Lightning fast
      } else if (avg < 400 && bestTime && bestTime < 350) {
        prizeIndex = 1; // Quick reflexes
      } else {
        prizeIndex = 2; // Good effort
      }
      setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
    } else {
      setRound(prev => prev + 1);
      setGameState('waiting');
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setRound(1);
    setReactionTimes([]);
    setReactionTime(null);
    setAverageTime(null);
    setBestTime(null);
    setWonPrize(null);
    setTooEarly(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'ready':
        return 'bg-red-600';
      case 'go':
        return 'bg-green-500';
      default:
        return 'bg-gray-800';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return '⚡ Prepárate para probar tus reflejos';
      case 'ready':
        return '🔴 Espera el verde...';
      case 'go':
        return '🟢 ¡AHORA! ¡HAZ CLIC!';
      case 'result':
        return tooEarly ? '❌ ¡Muy temprano!' : `⚡ ${reactionTime}ms`;
      case 'finished':
        return '🎯 ¡Desafío Completado!';
      default:
        return '';
    }
  };

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: 'Increíble! 🚀', color: 'text-yellow-400' };
    if (time < 300) return { text: 'Excelente! ⚡', color: 'text-green-400' };
    if (time < 400) return { text: 'Muy bueno! 👍', color: 'text-blue-400' };
    if (time < 500) return { text: 'Bueno 👌', color: 'text-cyan-400' };
    return { text: 'Puedes mejorar 💪', color: 'text-gray-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-white mb-6 animate-neon-pulse">
          ⚡ {config.gameTexts.reactionTime}
        </h1>

        {/* Round Counter */}
        {gameState !== 'finished' && (
          <div className="bg-black/30 rounded-lg p-4 mb-6 text-center backdrop-blur-sm">
            <p className="text-white text-lg">
              Ronda <span className="font-bold text-2xl">{round}/5</span>
            </p>
            {bestTime && (
              <p className="text-yellow-400 text-sm">
                Mejor tiempo: {bestTime}ms
              </p>
            )}
          </div>
        )}

        {/* Main Game Area */}
        <div
          className={`
            ${getBackgroundColor()} rounded-lg p-8 mb-6 text-center cursor-pointer transition-all duration-300 min-h-64 flex flex-col items-center justify-center
            ${gameState === 'go' ? 'animate-pulse' : ''}
            ${gameState === 'ready' || gameState === 'go' ? 'hover:scale-105' : ''}
          `}
          onClick={handleClick}
        >
          <div className="text-white text-xl font-bold mb-4">
            {getMessage()}
          </div>
          
          {gameState === 'result' && reactionTime && !tooEarly && (
            <div className="mt-4">
              <div className={`text-lg ${getReactionRating(reactionTime).color}`}>
                {getReactionRating(reactionTime).text}
              </div>
            </div>
          )}
          
          {gameState === 'waiting' && (
            <Zap className="w-16 h-16 text-white opacity-60 mt-4" />
          )}
        </div>

        {/* Action Buttons */}
        {gameState === 'waiting' && (
          <div className="text-center mb-6">
            <Button
              onClick={startRound}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 text-xl font-bold rounded-full"
            >
              Iniciar Ronda {round}
            </Button>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center mb-6">
            <Button
              onClick={nextRound}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-lg font-bold rounded-full"
            >
              {round >= 5 ? 'Ver Resultados' : 'Siguiente Ronda'}
            </Button>
          </div>
        )}

        {/* Results Summary */}
        {gameState === 'finished' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Tus Tiempos:</h3>
              <div className="grid grid-cols-5 gap-2">
                {reactionTimes.map((time, index) => (
                  <div key={index} className="bg-white/20 rounded p-2 text-center">
                    <div className="text-white text-sm">{time}ms</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-300 text-sm">Promedio</p>
                  <p className="text-white text-xl font-bold">
                    {averageTime ? Math.round(averageTime) : 0}ms
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Mejor Tiempo</p>
                  <p className="text-yellow-400 text-xl font-bold">
                    {bestTime}ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prize Result */}
        {wonPrize && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-purple-300 shadow-xl backdrop-blur-sm">
            <div className="text-4xl mb-2 animate-bounce">🎊⚡🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Reflejos Probados!</h2>
            <p className="text-white mb-2">
              Promedio: {averageTime ? Math.round(averageTime) : 0}ms
            </p>
            <p className="text-white text-lg font-semibold">{wonPrize}</p>
            <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Instructions */}
        {gameState === 'waiting' && round === 1 && (
          <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-sm">
              🎯 Haz clic lo más rápido posible cuando veas verde<br/>
              ⚠️ No hagas clic cuando esté rojo<br/>
              ⚡ Completa 5 rondas para medir tus reflejos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
