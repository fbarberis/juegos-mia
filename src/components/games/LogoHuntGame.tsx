
import React from 'react';
import { GameResult } from '../GameResult';
import { useLogoHuntGame } from './logoHunt/useLogoHuntGame';
import { LogoHuntHeader } from './logoHunt/LogoHuntHeader';
import { LogoHuntStats } from './logoHunt/LogoHuntStats';
import { LogoHuntGrid } from './logoHunt/LogoHuntGrid';
import { LogoHuntInstructions } from './logoHunt/LogoHuntInstructions';
import { useAdmin } from '../../contexts/AdminContext';

export const LogoHuntGame: React.FC = () => {
  const { config } = useAdmin();
  const {
    cells,
    attempts,
    logosFound,
    isGameComplete,
    gameWon,
    gameAttempts,
    score,
    streak,
    maxAttempts,
    logosToFind,
    gridSize,
    maxGameAttempts,
    setMaxAttempts,
    setLogosToFind,
    setGridSize,
    handleCellClick,
    resetGame,
    getAccuracy
  } = useLogoHuntGame();

  const gameStats = {
    intentos: attempts,
    'máximo permitido': maxAttempts,
    'fotos encontradas': logosFound,
    'fotos totales': logosToFind,
    puntuación: score,
    precisión: `${getAccuracy()}%`,
    'racha máxima': streak
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40, #1e1b4b)`
      }}
    >
      <div className="max-w-lg mx-auto">
        <LogoHuntHeader
          config={config}
          maxAttempts={maxAttempts}
          logosToFind={logosToFind}
          gridSize={gridSize}
          gameAttempts={gameAttempts}
          maxGameAttempts={maxGameAttempts}
          isGameComplete={isGameComplete}
          onMaxAttemptsChange={setMaxAttempts}
          onLogosToFindChange={setLogosToFind}
          onGridSizeChange={setGridSize}
          onResetGame={resetGame}
        />

        {/* Game Title */}
        <h1 
          className="text-4xl font-bold text-center text-white mb-8 animate-neon-pulse"
          style={{
            textShadow: `0 0 20px ${config.primaryColor}, 0 0 40px ${config.secondaryColor}`
          }}
        >
          🔍 {config.gameTexts['logoHunt'] || 'Busca a Umma'}
        </h1>

        <LogoHuntStats
          attempts={attempts}
          maxAttempts={maxAttempts}
          logosFound={logosFound}
          logosToFind={logosToFind}
          score={score}
          streak={streak}
          config={config}
        />

        <LogoHuntGrid
          cells={cells}
          gridSize={gridSize}
          config={config}
          onCellClick={handleCellClick}
        />

        <LogoHuntInstructions
          logosToFind={logosToFind}
          maxAttempts={maxAttempts}
          config={config}
          isGameComplete={isGameComplete}
        />
      </div>

      <GameResult
        gameCompleted={isGameComplete}
        gameWon={gameWon}
        gameTitle={config.gameTexts['logoHunt'] || 'Busca a Umma'}
        gameIcon="🔍"
        gameStats={gameStats}
        onPlayAgain={gameAttempts < maxGameAttempts ? resetGame : undefined}
      />
    </div>
  );
};
