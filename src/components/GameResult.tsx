
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { SlotMachine } from './games/SlotMachine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameResultProps {
  gameCompleted: boolean;
  gameWon: boolean;
  gameTitle: string;
  gameIcon: string;
  gameStats?: {
    [key: string]: any;
  };
  onPlayAgain?: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  gameCompleted,
  gameWon,
  gameTitle,
  gameIcon,
  gameStats,
  onPlayAgain
}) => {
  const { config } = useAdmin();
  const navigate = useNavigate();
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [finalPrize, setFinalPrize] = useState<string | null>(null);
  const [slotResult, setSlotResult] = useState<'win' | 'lose' | null>(null);

  if (!gameCompleted) {
    return null;
  }

  const handlePrizeDecision = () => {
    if (config.instantPrizes) {
      // Premio instantáneo
      const prize = config.prizes[Math.floor(Math.random() * config.prizes.length)];
      setFinalPrize(prize);
    } else if (config.slotMachine.enabled) {
      // Mostrar tragaperras
      setShowSlotMachine(true);
    } else {
      // Sin premio
      setSlotResult('lose');
    }
  };

  const handleSlotWin = (prize: string) => {
    setFinalPrize(prize);
    setSlotResult('win');
    setShowSlotMachine(false);
  };

  const handleSlotLose = () => {
    setSlotResult('lose');
    setShowSlotMachine(false);
  };

  if (showSlotMachine) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="relative">
          <Button
            onClick={() => setShowSlotMachine(false)}
            variant="outline"
            size="sm"
            className="absolute -top-2 -right-2 z-10 bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            ✕
          </Button>
          <SlotMachine onWin={handleSlotWin} onLose={handleSlotLose} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 border-2 border-yellow-400">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{gameIcon}</div>
          <CardTitle className="text-2xl font-bold text-white">
            {gameWon ? '¡Felicidades!' : '¡Buen Intento!'}
          </CardTitle>
          <p className="text-gray-300">
            {gameWon ? `¡Has completado ${gameTitle}!` : `Sigue practicando en ${gameTitle}`}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Game Stats */}
          {gameStats && Object.keys(gameStats).length > 0 && (
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Estadísticas:</h4>
              {Object.entries(gameStats).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Prize Section */}
          {gameWon && !finalPrize && slotResult === null && (
            <div className="text-center">
              <Button
                onClick={handlePrizeDecision}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 text-lg font-bold"
              >
                {config.instantPrizes ? '🎁 Reclamar Premio' : '🎰 Jugar Tragaperras'}
              </Button>
            </div>
          )}

          {/* Final Prize Display */}
          {finalPrize && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-center border-2 border-yellow-300">
              <div className="text-3xl mb-2 animate-bounce">🏆🎉🏆</div>
              <h3 className="text-white font-bold text-lg mb-2">¡Has Ganado!</h3>
              <p className="text-white">{finalPrize}</p>
              <div className="mt-2 text-2xl animate-pulse">⭐</div>
            </div>
          )}

          {/* No Prize Display */}
          {slotResult === 'lose' && (
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">😊</div>
              <h3 className="text-white font-bold mb-2">¡Gracias por Jugar!</h3>
              <p className="text-gray-300">Sigue intentando en otros juegos</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1 bg-black/20 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Hub
            </Button>
            
            {onPlayAgain && (
              <Button
                onClick={onPlayAgain}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                Jugar de Nuevo
              </Button>
            )}
          </div>

          {/* Event Theme Message */}
          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-gray-400 text-sm">
              🎂 {config.eventTheme.eventType} de {config.eventTheme.personName} - {config.eventTheme.age} años 🎂
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
