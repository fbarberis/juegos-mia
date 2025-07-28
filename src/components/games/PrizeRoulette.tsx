
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';

export const PrizeRoulette: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningPrize, setWinningPrize] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [velocity, setVelocity] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const colors = ['#ff6b35', '#f7931e', '#ffd700', '#32cd32', '#1e90ff', '#9370db'];

  const calculateAngle = (centerX: number, centerY: number, x: number, y: number) => {
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSpinning) return;
    
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate tilt based on mouse position for 3D effect
    const maxTilt = 15;
    setTiltX(-(mouseY / rect.height) * maxTilt);
    setTiltY((mouseX / rect.width) * maxTilt);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSpinning) return;
    
    const touch = e.touches[0];
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setTouchStart({
      x: touch.clientX - centerX,
      y: touch.clientY - centerY
    });
    setLastTouchTime(Date.now());
    setVelocity(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSpinning || !touchStart) return;
    
    const touch = e.touches[0];
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentX = touch.clientX - centerX;
    const currentY = touch.clientY - centerY;
    
    const startAngle = calculateAngle(0, 0, touchStart.x, touchStart.y);
    const currentAngle = calculateAngle(0, 0, currentX, currentY);
    
    let angleDiff = currentAngle - startAngle;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    const now = Date.now();
    const timeDiff = now - lastTouchTime;
    if (timeDiff > 0) {
      setVelocity(angleDiff / timeDiff);
    }
    
    setRotation(prev => prev + angleDiff);
    setTouchStart({ x: currentX, y: currentY });
    setLastTouchTime(now);
  };

  const handleTouchEnd = () => {
    if (isSpinning || !touchStart) return;
    
    const minVelocity = 0.5;
    if (Math.abs(velocity) > minVelocity) {
      spinWithVelocity(velocity);
    }
    
    setTouchStart(null);
    setVelocity(0);
  };

  const spinWithVelocity = (initialVelocity: number) => {
    setIsSpinning(true);
    setWinningPrize(null);
    
    // Calculate realistic deceleration
    const friction = 0.98;
    const minSpins = 3;
    const additionalRotation = Math.abs(initialVelocity) * 1000 * (1 - Math.pow(friction, 100));
    const totalRotation = rotation + (minSpins * 360) + additionalRotation * Math.sign(initialVelocity);
    
    setRotation(totalRotation);
    
    // Calculate winning prize
    const finalAngle = totalRotation % 360;
    const normalizedAngle = (360 - finalAngle) % 360;
    const sectionAngle = 360 / config.prizes.length;
    const winningIndex = Math.floor(normalizedAngle / sectionAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinningPrize(config.prizes[winningIndex]);
    }, 3000);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinningPrize(null);
    
    // Calculate random rotation (multiple full rotations + random position)
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);
    
    // Calculate winning prize
    const normalizedAngle = (360 - (finalAngle % 360)) % 360;
    const sectionAngle = 360 / config.prizes.length;
    const winningIndex = Math.floor(normalizedAngle / sectionAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinningPrize(config.prizes[winningIndex]);
    }, 4000);
  };

  const resetWheel = () => {
    setRotation(0);
    setWinningPrize(null);
    setIsSpinning(false);
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-6 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-40 w-5 h-5 bg-green-400 rounded-full animate-spin"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-white mb-8 animate-neon-pulse">
          🎰 Ruleta 3D Premium
        </h1>

        {/* Instructions */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 text-center backdrop-blur-sm border border-white/10">
          <p className="text-white text-lg">
            {!isSpinning ? 'Desliza, presiona o inclina para girar la ruleta 3D' : '¡La ruleta 3D está girando!'}
          </p>
        </div>

        {/* Enhanced Roulette Wheel with 3D effects */}
        <div className="relative flex items-center justify-center mb-8 perspective-1000">
          {/* Enhanced confetti effect when winning */}
          {winningPrize && !isSpinning && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">🎊</div>
              <div className="absolute top-10 left-1/4 text-4xl animate-pulse">✨</div>
              <div className="absolute top-10 right-1/4 text-4xl animate-pulse">🎉</div>
              <div className="absolute bottom-10 left-1/3 text-3xl animate-bounce">🌟</div>
              <div className="absolute bottom-10 right-1/3 text-3xl animate-bounce">💫</div>
              <div className="absolute top-1/2 left-10 text-2xl animate-ping">🎆</div>
              <div className="absolute top-1/2 right-10 text-2xl animate-ping">🎇</div>
            </div>
          )}
          
          {/* Enhanced Pointer with 3D effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-400 shadow-2xl drop-shadow-lg"></div>
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
            </div>
          </div>
          
          {/* Enhanced 3D Wheel */}
          <div 
            ref={wheelRef}
            className={`
              relative w-80 h-80 rounded-full shadow-2xl transition-all cursor-pointer select-none
              transform-gpu backdrop-blur-sm border-8 border-white/20
              ${isSpinning ? 'duration-4000 ease-out' : 'duration-300 ease-out'}
              ${winningPrize && !isSpinning ? 'animate-pulse border-yellow-400 border-8' : ''}
            `}
            style={{ 
              transform: `
                perspective(1000px) 
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                rotateZ(${rotation}deg)
                translateZ(${isSpinning ? '20px' : '10px'})
              `,
              background: `conic-gradient(${config.prizes.map((_, index) => {
                const startAngle = (index / config.prizes.length) * 360;
                const endAngle = ((index + 1) / config.prizes.length) * 360;
                return `${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`;
              }).join(', ')})`,
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.4),
                0 0 0 8px rgba(255,255,255,0.1),
                inset 0 0 40px rgba(255,255,255,0.1)
              `
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prize sections with enhanced styling */}
            {config.prizes.map((prize, index) => {
              const angle = (360 / config.prizes.length) * index;
              
              return (
                <div
                  key={index}
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.sin((360 / config.prizes.length) * Math.PI / 180) * 50}% ${50 - Math.cos((360 / config.prizes.length) * Math.PI / 180) * 50}%)`
                  }}
                >
                  <div 
                    className="text-white font-bold text-xs p-2 text-center transform drop-shadow-lg"
                    style={{ 
                      transform: `rotate(${180 / config.prizes.length}deg) translateY(-60px)`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
                    }}
                  >
                    {prize.split(':')[0]}
                  </div>
                </div>
              );
            })}
            
            {/* Enhanced Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
              <div className="text-black font-bold text-lg animate-pulse">🎰</div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/20"></div>
            </div>

            {/* Inner ring decoration */}
            <div className="absolute inset-4 rounded-full border-4 border-white/30 shadow-inner"></div>
            <div className="absolute inset-8 rounded-full border-2 border-white/20"></div>
          </div>
        </div>

        {/* Enhanced Spin Button */}
        {!isSpinning && !winningPrize && (
          <div className="text-center mb-6">
            <Button
              onClick={spinWheel}
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 text-xl font-bold rounded-full animate-pulse hover:animate-none hover:scale-110 shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            >
              <Play className="w-6 h-6 mr-2" />
              ¡Girar Ruleta 3D!
            </Button>
          </div>
        )}

        {/* Reset Button */}
        {(winningPrize || isSpinning) && (
          <div className="text-center mb-6">
            <Button
              onClick={resetWheel}
              variant="outline"
              className="bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              disabled={isSpinning}
            >
              Nueva Tirada
            </Button>
          </div>
        )}

        {/* Enhanced Winning Result */}
        {winningPrize && !isSpinning && (
          <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-yellow-300 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-2 animate-bounce">🎊🏆🎊</div>
              <h2 className="text-2xl font-bold text-white mb-2 animate-pulse drop-shadow-lg">¡Felicidades!</h2>
              <p className="text-white text-lg font-semibold drop-shadow-md">{winningPrize}</p>
              <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
            </div>
          </div>
        )}

        {/* Enhanced spinning indicator */}
        {isSpinning && (
          <div className="bg-black/30 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10">
            <div className="text-2xl mb-2 animate-spin">🎪</div>
            <p className="text-white text-lg animate-pulse">¡La ruleta 3D está girando con efecto realista...</p>
            <div className="mt-2 w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
