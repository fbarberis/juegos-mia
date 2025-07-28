
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface GameCardProps {
  game: Game;
  delay: number;
}

export const GameCard: React.FC<GameCardProps> = ({ game, delay }) => {
  const navigate = useNavigate();
  const { config } = useAdmin();

  const handleClick = () => {
    navigate(game.route);
  };

  return (
    <div
      className="game-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 animate-bounce-in"
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="text-6xl mb-4 text-center animate-bounce">
          {game.icon}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 text-center">
          {config.gameTexts[game.id] || game.title}
        </h3>
        
        <p className="text-gray-300 text-center mb-4">
          {game.description}
        </p>
        
        <div className="flex justify-center">
          <button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold transform transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50">
            ¡Jugar Ahora!
          </button>
        </div>
      </div>
    </div>
  );
};
