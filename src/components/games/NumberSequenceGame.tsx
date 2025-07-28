
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw, Target } from 'lucide-react';

interface SequenceChallenge {
  sequence: number[];
  missing: number;
  missingIndex: number;
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'pattern';
  hint: string;
}

export const NumberSequenceGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [currentChallenge, setCurrentChallenge] = useState<SequenceChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    generateChallenge();
  }, [round]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, timeLeft]);

  const generateChallenge = () => {
    const challenges = [
      generateArithmetic,
      generateGeometric,
      generateFibonacci,
      generatePattern
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)]();
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setShowHint(false);
    setTimeLeft(30);
    setAttempts(0);
  };

  const generateArithmetic = (): SequenceChallenge => {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 2;
    const length = 6;
    
    const sequence = Array.from({ length }, (_, i) => start + i * diff);
    const missingIndex = Math.floor(Math.random() * (length - 1)) + 1;
    const missing = sequence[missingIndex];
    
    return {
      sequence,
      missing,
      missingIndex,
      type: 'arithmetic',
      hint: `Secuencia aritmética: suma ${diff} cada vez`
    };
  };

  const generateGeometric = (): SequenceChallenge => {
    const start = Math.floor(Math.random() * 3) + 2;
    const ratio = Math.floor(Math.random() * 2) + 2;
    const length = 5;
    
    const sequence = Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
    const missingIndex = Math.floor(Math.random() * (length - 1)) + 1;
    const missing = sequence[missingIndex];
    
    return {
      sequence,
      missing,
      missingIndex,
      type: 'geometric',
      hint: `Secuencia geométrica: multiplica por ${ratio} cada vez`
    };
  };

  const generateFibonacci = (): SequenceChallenge => {
    const sequence = [1, 1, 2, 3, 5, 8, 13];
    const missingIndex = Math.floor(Math.random() * 5) + 2;
    const missing = sequence[missingIndex];
    
    return {
      sequence,
      missing,
      missingIndex,
      type: 'fibonacci',
      hint: 'Cada número es la suma de los dos anteriores'
    };
  };

  const generatePattern = (): SequenceChallenge => {
    const patterns = [
      { seq: [2, 4, 8, 16, 32, 64], hint: 'Cada número se duplica' },
      { seq: [1, 4, 9, 16, 25, 36], hint: 'Números cuadrados (1², 2², 3²...)' },
      { seq: [3, 6, 12, 24, 48, 96], hint: 'Empieza en 3 y se duplica' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const missingIndex = Math.floor(Math.random() * (pattern.seq.length - 1)) + 1;
    const missing = pattern.seq[missingIndex];
    
    return {
      sequence: pattern.seq,
      missing,
      missingIndex,
      type: 'pattern',
      hint: pattern.hint
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChallenge || !gameStarted) return;

    const answer = parseInt(userAnswer);
    setAttempts(prev => prev + 1);

    if (answer === currentChallenge.missing) {
      // Correct answer
      const timeBonus = Math.floor(timeLeft / 5);
      const attemptBonus = Math.max(3 - attempts, 0);
      const points = 10 + timeBonus + attemptBonus;
      setScore(prev => prev + points);

      if (round >= 5) {
        // Game completed
        setGameOver(true);
        setGameStarted(false);
        
        let prizeIndex = 0;
        if (score + points >= 70) {
          prizeIndex = 0; // Excellent
        } else if (score + points >= 50) {
          prizeIndex = 1; // Good
        } else {
          prizeIndex = 2; // Participation
        }
        setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
      } else {
        setRound(prev => prev + 1);
      }
    } else {
      if (attempts >= 2) {
        handleTimeUp();
      }
    }
  };

  const handleTimeUp = () => {
    if (round >= 5) {
      setGameOver(true);
      setGameStarted(false);
    } else {
      setRound(prev => prev + 1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setWonPrize(null);
    generateChallenge();
  };

  const displaySequence = () => {
    if (!currentChallenge) return [];
    
    return currentChallenge.sequence.map((num, index) => 
      index === currentChallenge.missingIndex ? '?' : num.toString()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6 relative overflow-hidden">
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
          🔢 {config.gameTexts.numberSequence}
        </h1>

        {/* Game Stats */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-300 text-sm">Ronda</p>
              <p className="text-white text-xl font-bold">{round}/5</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Tiempo</p>
              <p className="text-white text-xl font-bold">{timeLeft}s</p>
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
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 text-xl font-bold rounded-full"
            >
              <Target className="w-6 h-6 mr-2" />
              Iniciar Desafío
            </Button>
          </div>
        )}

        {/* Sequence Display */}
        {currentChallenge && gameStarted && !gameOver && (
          <>
            <div className="bg-black/20 rounded-lg p-6 mb-6 text-center backdrop-blur-sm">
              <p className="text-gray-300 text-sm mb-4">Encuentra el número que falta:</p>
              <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
                {displaySequence().map((num, index) => (
                  <div
                    key={index}
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
                      ${num === '?' 
                        ? 'bg-yellow-500 text-black animate-pulse' 
                        : 'bg-white/20 text-white'
                      }
                    `}
                  >
                    {num}
                  </div>
                ))}
              </div>
              
              {/* Hint Button */}
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                size="sm"
                className="bg-black/20 border-white/20 text-white hover:bg-white/10 mb-4"
              >
                {showHint ? 'Ocultar Pista' : 'Ver Pista'}
              </Button>
              
              {showHint && (
                <p className="text-cyan-300 text-sm animate-fade-in">
                  💡 {currentChallenge.hint}
                </p>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tu respuesta..."
                  className="bg-black/20 border-white/20 text-white text-center text-xl font-bold"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                  disabled={!userAnswer.trim()}
                >
                  Enviar
                </Button>
              </div>
            </form>

            {/* Attempts */}
            {attempts > 0 && attempts < 3 && (
              <div className="bg-orange-600/80 rounded-lg p-4 text-center mb-6 backdrop-blur-sm">
                <p className="text-white">
                  Intento {attempts}/3 - {attempts === 2 ? '¡Último intento!' : 'Inténtalo de nuevo'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Game Over */}
        {gameOver && !wonPrize && (
          <div className="bg-red-600/80 rounded-lg p-6 text-center backdrop-blur-sm mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">¡Juego Terminado!</h2>
            <p className="text-white">Puntuación Final: {score} puntos</p>
          </div>
        )}

        {/* Win Message */}
        {wonPrize && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-emerald-300 shadow-xl backdrop-blur-sm">
            <div className="text-4xl mb-2 animate-bounce">🎊🔢🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Desafío Completado!</h2>
            <p className="text-white mb-2">Puntuación: {score} puntos</p>
            <p className="text-white text-lg font-semibold">{wonPrize}</p>
            <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Instructions */}
        {!gameStarted && !gameOver && (
          <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-sm">
              🎯 Encuentra el patrón en cada secuencia<br/>
              ⏰ 30 segundos por ronda<br/>
              🏆 Completa 5 rondas para ganar premios
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
