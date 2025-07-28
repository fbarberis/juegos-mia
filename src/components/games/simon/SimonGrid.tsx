
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

const umaPhotos = [
  { 
    bg: 'bg-pink-500', 
    name: 'Uma Bailando', 
    sound: '🌹',
    image: '/lovable-uploads/553c69f9-274a-4a52-bd6a-e00cb0f6e4f9.png',
    flashColor: '#ff0080'
  },
  { 
    bg: 'bg-purple-500', 
    name: 'Uma Celebrando', 
    sound: '💜',
    image: '/lovable-uploads/3ef9be5d-46d9-41d7-a2ba-d4de02251305.png',
    flashColor: '#00ff80'
  },
  { 
    bg: 'bg-yellow-400', 
    name: 'Uma Sonriendo', 
    sound: '✨',
    image: '/lovable-uploads/d8cd3a88-2d1c-4b0f-8b2b-d1e06ab82755.png',
    flashColor: '#ffff00'
  },
  { 
    bg: 'bg-cyan-400', 
    name: 'Uma Feliz', 
    sound: '💎',
    image: '/lovable-uploads/67776508-9e90-4a70-a9c7-cd078799b64b.png',
    flashColor: '#0080ff'
  }
];

interface SimonGridProps {
  activeButton: number | null;
  isShowingSequence: boolean;
  isPlaying: boolean;
  gameOver: boolean;
  gameWon: boolean;
  onButtonClick: (index: number) => void;
}

export const SimonGrid: React.FC<SimonGridProps> = ({
  activeButton,
  isShowingSequence,
  isPlaying,
  gameOver,
  gameWon,
  onButtonClick
}) => {
  const { config } = useAdmin();

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm mx-auto">
      {umaPhotos.map((photo, index) => (
        <button
          key={index}
          className={`
            aspect-square rounded-xl border-4 transition-all duration-300 overflow-hidden relative
            ${activeButton === index ? 'brightness-150 scale-110 shadow-2xl' : 'brightness-75'}
            ${!isShowingSequence && isPlaying && !gameOver && !gameWon ? 'hover:brightness-110 hover:scale-105' : ''}
            ${!isPlaying ? 'opacity-50' : ''}
          `}
          style={{
            borderColor: `${config.secondaryColor}80`,
            boxShadow: activeButton === index ? `0 0 30px ${photo.flashColor}` : 'none'
          }}
          onClick={() => onButtonClick(index)}
          disabled={isShowingSequence || !isPlaying || gameOver}
        >
          <div className="absolute inset-0 flex items-start justify-center">
            <img 
              src={photo.image} 
              alt={photo.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.className = `${parent.className} ${photo.bg}`;
                }
              }}
            />
          </div>
          {activeButton === index && (
            <div 
              className="absolute inset-0 animate-pulse rounded-xl"
              style={{
                background: `linear-gradient(45deg, ${photo.flashColor}80, ${photo.flashColor}60)`
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
