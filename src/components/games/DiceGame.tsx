
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices } from 'lucide-react';

export const DiceGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [rollCount, setRollCount] = useState(0);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setWonPrize(null);
    setRollCount(prev => prev + 1);

    // Animate the dice rolling
    let rollAnimation = 0;
    const animationDuration = 2500;
    const intervalTime = 50;
    
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollAnimation += intervalTime;
      
      if (rollAnimation >= animationDuration) {
        clearInterval(rollInterval);
        
        // Final dice value
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        
        // Determine prize based on dice value
        let prizeIndex = 0;
        if (finalValue === 6) {
          prizeIndex = 0; // Best prize for 6
        } else if (finalValue >= 4) {
          prizeIndex = 1; // Good prize for 4-5
        } else if (finalValue >= 2) {
          prizeIndex = 2; // Consolation prize for 2-3
        } else {
          prizeIndex = config.prizes.length - 1; // Last prize for 1
        }
        
        setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
      }
    }, intervalTime);
  };

  const resetGame = () => {
    setDiceValue(null);
    setWonPrize(null);
    setRollCount(0);
    setIsRolling(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4 lg:p-8 xl:p-12 relative overflow-hidden flex flex-col">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-40 w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-green-400 rounded-full animate-spin"></div>
      </div>

      <div className="max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto relative z-10 flex-1 flex flex-col">
        {/* Header - compacto */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 touch-manipulation text-lg lg:text-xl p-4 lg:p-6"
          >
            <ArrowLeft className="w-6 h-6 lg:w-8 lg:h-8 mr-2" />
            Volver
          </Button>
        </div>

        {/* Game Title - mucho más grande */}
        <h1 className="text-5xl lg:text-8xl xl:text-9xl font-bold text-center text-white mb-8 lg:mb-12 animate-neon-pulse">
          🎲 Dado de la Suerte
        </h1>

        {/* Instructions - escalado */}
        <div className="bg-black/30 rounded-lg p-6 lg:p-8 xl:p-12 mb-8 lg:mb-12 text-center backdrop-blur-sm">
          <p className="text-white text-xl lg:text-3xl xl:text-4xl">
            {isRolling ? '¡El dado está rodando!' : 'Toca para lanzar el dado y descubrir tu premio'}
          </p>
          {rollCount > 0 && !isRolling && (
            <p className="text-gray-300 text-lg lg:text-xl xl:text-2xl mt-4">
              Lanzamientos: {rollCount}
            </p>
          )}
        </div>

        {/* Dice Display - área principal y mucho más grande */}
        <div className="flex-1 flex justify-center items-center mb-8 lg:mb-12">
          <div 
            className={`
              w-48 h-48 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br from-white to-gray-200 border-8 lg:border-12 xl:border-16 border-gray-400 
              rounded-2xl lg:rounded-3xl xl:rounded-4xl flex items-center justify-center text-8xl lg:text-[12rem] xl:text-[16rem] transition-all duration-300
              ${isRolling ? 'animate-bounce scale-110' : 'hover:scale-110'}
              ${wonPrize && !isRolling ? 'animate-pulse' : ''}
              shadow-2xl cursor-pointer select-none touch-manipulation
            `}
            onClick={!isRolling && !wonPrize ? rollDice : undefined}
          >
            {diceValue ? (
              diceValue === 1 ? '⚀' : 
              diceValue === 2 ? '⚁' : 
              diceValue === 3 ? '⚂' : 
              diceValue === 4 ? '⚃' : 
              diceValue === 5 ? '⚄' : '⚅'
            ) : '🎲'}
          </div>
        </div>

        {/* Dice Result Display */}
        {diceValue && !isRolling && (
          <div className="text-center mb-8 bg-black/20 rounded-lg p-6 lg:p-8 xl:p-12 backdrop-blur-sm">
            <div className="text-8xl lg:text-[10rem] xl:text-[12rem] mb-4">
              {diceValue === 1 ? '1️⃣' : 
               diceValue === 2 ? '2️⃣' : 
               diceValue === 3 ? '3️⃣' : 
               diceValue === 4 ? '4️⃣' : 
               diceValue === 5 ? '5️⃣' : '6️⃣'}
            </div>
            <p className="text-white text-3xl lg:text-5xl xl:text-6xl font-bold">
              ¡Sacaste un {diceValue}!
            </p>
          </div>
        )}

        {/* Roll Button */}
        {!isRolling && !wonPrize && (
          <div className="text-center mb-8">
            <Button
              onClick={rollDice}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-8 lg:px-16 lg:py-12 xl:px-20 xl:py-16 text-2xl lg:text-4xl xl:text-5xl font-bold rounded-full animate-pulse hover:animate-none hover:scale-105 shadow-xl touch-manipulation"
            >
              <Dices className="w-8 h-8 lg:w-12 lg:h-12 xl:w-16 xl:h-16 mr-4" />
              ¡Lanzar Dado!
            </Button>
          </div>
        )}

        {/* Reset Button */}
        {(wonPrize || rollCount > 0) && !isRolling && (
          <div className="text-center mb-8">
            <Button
              onClick={resetGame}
              variant="outline"
              className="bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm touch-manipulation text-xl lg:text-2xl xl:text-3xl p-6 lg:p-8 xl:p-10"
            >
              Nuevo Juego
            </Button>
          </div>
        )}

        {/* Prize Result */}
        {wonPrize && !isRolling && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-8 lg:p-12 xl:p-16 text-center animate-bounce-in border-8 border-yellow-300 shadow-xl backdrop-blur-sm">
            <div className="text-6xl lg:text-8xl xl:text-[10rem] mb-4 animate-bounce">🎊🎲🎊</div>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-white text-2xl lg:text-4xl xl:text-5xl font-semibold">{wonPrize}</p>
            <div className="mt-8 text-5xl lg:text-7xl xl:text-8xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Rolling indicator */}
        {isRolling && (
          <div className="bg-black/30 rounded-lg p-6 lg:p-8 xl:p-12 text-center backdrop-blur-sm">
            <div className="text-4xl lg:text-6xl xl:text-8xl mb-4 animate-spin">🎯</div>
            <p className="text-white text-2xl lg:text-4xl xl:text-5xl animate-pulse">¡El dado está rodando...</p>
          </div>
        )}

        {/* Game Rules - compacto al final */}
        {!wonPrize && !isRolling && (
          <div className="bg-black/20 rounded-lg p-4 lg:p-6 xl:p-8 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-base lg:text-xl xl:text-2xl">
              💎 Saca 6 = Premio especial<br/>
              🏆 Saca 4-5 = Buen premio<br/>
              🎁 Saca 2-3 = Premio consolación<br/>
              🍀 Saca 1 = ¡Inténtalo de nuevo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
