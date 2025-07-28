
import { useState, useEffect } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

interface Cell {
  id: number;
  hasLogo: boolean;
  isRevealed: boolean;
  isFound: boolean;
  imageUrl?: string;
  partyItem?: string;
}

const ummaImages = [
  '/lovable-uploads/f32e528f-722b-40dd-b946-8526a4944be4.png',
  '/lovable-uploads/dc1cac60-4e59-4985-a216-f801a850a7e4.png',
  '/lovable-uploads/ad85baa8-cb98-46da-9993-46f927d04ffe.png',
  '/lovable-uploads/c42e08fc-23ba-4f47-a351-71449ddd6081.png',
  '/lovable-uploads/5ecec764-3fc0-4e73-b8c4-04d26127c527.png',
  '/lovable-uploads/8b07bb88-e3c2-4b99-8b8d-7509f0bf14e3.png',
  '/lovable-uploads/7fdcbc2d-c934-42ee-a6ad-6f974b26ceb5.png',
  '/lovable-uploads/f9f1c37d-13c7-4ccb-8bd9-7ed41b1f9ea4.png',
  '/lovable-uploads/8ea90425-2be9-404a-9b35-4053fc206e96.png',
  '/lovable-uploads/dc07b42d-2807-443d-a646-a81960944740.png'
];

const partyItems = [
  { emoji: '🎂', name: 'Pastel de Celebración' },
  { emoji: '🎈', name: 'Globo Dorado' },
  { emoji: '🌹', name: 'Rosa Romántica' },
  { emoji: '💖', name: 'Corazón de Amor' },
  { emoji: '✨', name: 'Brillo Mágico' },
  { emoji: '🦋', name: 'Mariposa Delicada' },
  { emoji: '💎', name: 'Diamante Brillante' },
  { emoji: '🌟', name: 'Estrella de los Deseos' }
];

export const useLogoHuntGame = () => {
  const { config } = useAdmin();
  const [cells, setCells] = useState<Cell[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [logosFound, setLogosFound] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameAttempts, setGameAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastFindTime, setLastFindTime] = useState<number>(0);

  // Settings state
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [logosToFind, setLogosToFind] = useState(3);
  const [gridSize, setGridSize] = useState(4);

  const gameConfig = config.gameConfigs['logoHunt'];
  const maxGameAttempts = gameConfig?.maxAttempts || 1;

  // Initialize settings from config
  useEffect(() => {
    if (gameConfig?.customSettings) {
      setMaxAttempts(gameConfig.customSettings.maxAttempts || 6);
      setLogosToFind(gameConfig.customSettings.logosToFind || 3);
      setGridSize(gameConfig.customSettings.gridSize || 4);
    }
  }, [gameConfig]);

  const initializeGame = () => {
    const totalCells = gridSize * gridSize;
    const logoPositions = new Set<number>();
    
    while (logoPositions.size < logosToFind) {
      const randomPosition = Math.floor(Math.random() * totalCells);
      logoPositions.add(randomPosition);
    }

    const gameCells = Array.from({ length: totalCells }, (_, index) => {
      const hasLogo = logoPositions.has(index);
      const randomItem = partyItems[Math.floor(Math.random() * partyItems.length)];
      const randomUmmaImage = ummaImages[Math.floor(Math.random() * ummaImages.length)];
      
      return {
        id: index,
        hasLogo,
        isRevealed: false,
        isFound: false,
        imageUrl: hasLogo ? randomUmmaImage : undefined,
        partyItem: hasLogo ? undefined : randomItem.emoji,
      };
    });

    setCells(gameCells);
    setAttempts(0);
    setLogosFound(0);
    setIsGameComplete(false);
    setGameWon(false);
    setScore(0);
    setStreak(0);
    setLastFindTime(Date.now());
  };

  const resetGame = () => {
    if (gameAttempts < maxGameAttempts) {
      setGameAttempts(prev => prev + 1);
      initializeGame();
    }
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize, logosToFind]);

  useEffect(() => {
    if (logosFound === logosToFind) {
      setIsGameComplete(true);
      setGameWon(true);
      
      // Bonus score for completion
      const timeBonus = Math.max(0, maxAttempts - attempts) * 50;
      const streakBonus = streak * 100;
      setScore(prev => prev + timeBonus + streakBonus);
    } else if (attempts >= maxAttempts) {
      setIsGameComplete(true);
      setGameWon(false);
    }
  }, [logosFound, attempts, logosToFind, maxAttempts, streak]);

  const handleCellClick = (cellId: number) => {
    if (isGameComplete || attempts >= maxAttempts) return;
    
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.isRevealed) return;

    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, isRevealed: true, isFound: cell.hasLogo } : cell
    ));

    setAttempts(prev => prev + 1);

    if (cell.hasLogo) {
      const currentTime = Date.now();
      const timeSinceLastFind = currentTime - lastFindTime;
      
      // Streak bonus for quick consecutive finds
      if (timeSinceLastFind < 3000 && logosFound > 0) {
        setStreak(prev => prev + 1);
        setScore(prev => prev + 200 + (streak * 50));
      } else {
        setStreak(1);
        setScore(prev => prev + 200);
      }
      
      setLogosFound(prev => prev + 1);
      setLastFindTime(currentTime);
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 25)); // Small penalty
    }
  };

  const getAccuracy = () => {
    if (attempts === 0) return 100;
    return Math.round((logosFound / attempts) * 100);
  };

  return {
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
  };
};
