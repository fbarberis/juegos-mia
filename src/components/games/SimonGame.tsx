
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { GameResult } from '../GameResult';
import { SimonHeader } from './simon/SimonHeader';
import { SimonProgressBar } from './simon/SimonProgressBar';
import { SimonStats } from './simon/SimonStats';
import { SimonHint } from './simon/SimonHint';
import { SimonGrid } from './simon/SimonGrid';
import { SimonControls } from './simon/SimonControls';
import { SimonInstructions } from './simon/SimonInstructions';

export const SimonGame: React.FC = () => {
  const { config } = useAdmin();
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [perfectRounds, setPerfectRounds] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const gameConfig = config.gameConfigs['simon'];
  const maxAttempts = gameConfig?.maxAttempts || 3;
  const targetSequenceLength = gameConfig?.customSettings.sequenceLength || 8;
  const speed = gameConfig?.customSettings.speed || 1000;

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
    setScore(0);
    setPerfectRounds(0);
    setShowHint(false);
    addToSequence();
  };

  const addToSequence = () => {
    const newColor = Math.floor(Math.random() * 4);
    setSequence(prev => {
      const newSequence = [...prev, newColor];
      setLevel(newSequence.length);
      return newSequence;
    });
  };

  const showSequence = () => {
    setIsShowingSequence(true);
    setPlayerSequence([]);
    
    sequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveButton(color);
        setTimeout(() => setActiveButton(null), Math.max(300, speed - 200));
        
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsShowingSequence(false);
            if (sequence.length > 3) setShowHint(true);
          }, speed);
        }
      }, index * speed);
    });
  };

  const handleButtonClick = (colorIndex: number) => {
    if (isShowingSequence || gameOver || gameWon) return;
    
    setActiveButton(colorIndex);
    setTimeout(() => setActiveButton(null), 200);
    
    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);
    setShowHint(false);
    
    // Check if the player's move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    
    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      const roundScore = sequence.length * 10;
      const speedBonus = Math.max(0, (2000 - speed) / 100);
      const perfectBonus = sequence.length === newPlayerSequence.length ? 50 : 0;
      
      setScore(prev => prev + roundScore + speedBonus + perfectBonus);
      setPerfectRounds(prev => prev + 1);
      
      if (level >= targetSequenceLength) {
        setGameOver(true);
        setGameWon(true);
        setIsPlaying(false);
        setScore(prev => prev + (perfectRounds * 100)); // Final bonus
      } else {
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    if (attempts < maxAttempts) {
      setAttempts(prev => prev + 1);
      startGame();
    }
  };

  useEffect(() => {
    if (sequence.length > 0 && isPlaying && !gameOver) {
      showSequence();
    }
  }, [sequence]);

  const getProgress = () => {
    return Math.round((level / targetSequenceLength) * 100);
  };

  const gameStats = {
    nivel: level,
    'objetivo': targetSequenceLength,
    'intentos': attempts + 1,
    'máximo': maxAttempts,
    puntuación: score,
    'rondas perfectas': perfectRounds,
    'progreso': `${getProgress()}%`
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40, #1e1b4b)`
      }}
    >
      <div className="max-w-lg mx-auto">
        <SimonHeader
          attempts={attempts}
          maxAttempts={maxAttempts}
          onReset={resetGame}
          canReset={attempts < maxAttempts && !(gameOver && !gameWon)}
        />

        {/* Game Title */}
        <h1 
          className="text-4xl font-bold text-center text-white mb-8 animate-neon-pulse"
          style={{
            textShadow: `0 0 20px ${config.primaryColor}, 0 0 40px ${config.secondaryColor}`
          }}
        >
          🎯 Sigue la secuencia
        </h1>

        <SimonProgressBar
          level={level}
          targetSequenceLength={targetSequenceLength}
        />

        <SimonStats
          level={level}
          score={score}
          isShowingSequence={isShowingSequence}
          isPlaying={isPlaying}
          gameWon={gameWon}
          gameOver={gameOver}
        />

        <SimonHint
          showHint={showHint}
          isPlaying={isPlaying}
          isShowingSequence={isShowingSequence}
        />

        <SimonGrid
          activeButton={activeButton}
          isShowingSequence={isShowingSequence}
          isPlaying={isPlaying}
          gameOver={gameOver}
          gameWon={gameWon}
          onButtonClick={handleButtonClick}
        />

        <SimonControls
          isPlaying={isPlaying}
          gameWon={gameWon}
          gameOver={gameOver}
          onStartGame={startGame}
        />

        <SimonInstructions
          isPlaying={isPlaying}
          gameOver={gameOver}
          gameWon={gameWon}
          targetSequenceLength={targetSequenceLength}
        />
      </div>

      <GameResult
        gameCompleted={gameOver || gameWon}
        gameWon={gameWon}
        gameTitle="Sigue la secuencia"
        gameIcon="🎯"
        gameStats={gameStats}
        onPlayAgain={attempts < maxAttempts ? resetGame : undefined}
      />
    </div>
  );
};
