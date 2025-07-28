
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const ScratchCard: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedArea, setScratchedArea] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prize, setPrize] = useState('');

  useEffect(() => {
    // Select random prize
    const randomPrize = config.prizes[Math.floor(Math.random() * config.prizes.length)];
    setPrize(randomPrize);
    
    // Initialize canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;
    
    // Draw scratch surface
    ctx.fillStyle = '#silver';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add scratch texture
    ctx.fillStyle = '#c0c0c0';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }, [config.prizes]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isScratching) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Calculate scratched area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    
    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchedArea(percentage);
    
    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  const resetCard = () => {
    setIsScratching(false);
    setScratchedArea(0);
    setIsRevealed(false);
    
    const randomPrize = config.prizes[Math.floor(Math.random() * config.prizes.length)];
    setPrize(randomPrize);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw scratch surface
    ctx.fillStyle = '#silver';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#c0c0c0';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button 
            onClick={resetCard}
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nueva Carta
          </Button>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-white mb-8 animate-neon-pulse">
          🎫 Rasca y Gana
        </h1>

        {/* Instructions */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 text-center">
          <p className="text-white text-lg">
            {!isScratching ? 'Toca "Empezar" y rasca la carta para revelar tu premio' : 'Rasca la superficie plateada'}
          </p>
        </div>

        {/* Scratch Card */}
        <div className="relative bg-white rounded-lg p-6 shadow-2xl mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🎁 CARTA PREMIADA 🎁</h2>
          </div>
          
          {/* Prize underneath */}
          <div className="absolute inset-6 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <div className="text-center text-white p-4">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-lg font-bold">{prize}</div>
            </div>
          </div>
          
          {/* Scratch overlay */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-48 cursor-pointer rounded-lg"
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseMove={scratch}
              onTouchStart={() => setIsScratching(true)}
              onTouchEnd={() => setIsScratching(false)}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                  clientX: touch.clientX,
                  clientY: touch.clientY
                });
                scratch(mouseEvent as any);
              }}
            />
          </div>
        </div>

        {/* Start Button */}
        {!isScratching && scratchedArea === 0 && (
          <div className="text-center">
            <Button
              onClick={() => setIsScratching(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 text-xl font-bold rounded-full animate-bounce"
            >
              ¡Empezar a Rascar!
            </Button>
          </div>
        )}

        {/* Progress */}
        {scratchedArea > 0 && !isRevealed && (
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <p className="text-white mb-2">Progreso: {Math.round(scratchedArea)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${scratchedArea}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Celebration */}
        {isRevealed && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-center animate-bounce-in">
            <div className="text-4xl mb-2">🎊🎉🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Felicidades!</h2>
            <p className="text-white text-lg">Has ganado: {prize}</p>
          </div>
        )}
      </div>
    </div>
  );
};
