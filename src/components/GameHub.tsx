
import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { GameCard } from './GameCard';
import { AdminPanel } from './AdminPanel';
import { Settings, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const games = [
  {
    id: 'scratch-card',
    title: 'Rasca y Gana',
    description: 'Rasca las cartas y descubre premios increíbles',
    icon: '🎫',
    route: '/scratch-card'
  },
  {
    id: 'memory',
    title: 'Juego de Memoria',
    description: 'Encuentra las parejas y demuestra tu memoria',
    icon: '🧠',
    route: '/memory'
  },
  {
    id: 'dice',
    title: 'Dado de la Suerte',
    description: 'Lanza el dado y descubre tu premio',
    icon: '🎲',
    route: '/dice'
  },
  {
    id: 'puzzle',
    title: 'Rompecabezas',
    description: 'Resuelve el puzzle y gana premios',
    icon: '🧩',
    route: '/puzzle'
  },
  {
    id: 'logoHunt',
    title: 'Busca el Logo',
    description: 'Encuentra los logos escondidos de UMA',
    icon: '🔍',
    route: '/logo-hunt'
  },
  {
    id: 'simon',
    title: 'Secuencia de Colores',
    description: 'Memoriza y repite las secuencias de colores',
    icon: '🎵',
    route: '/simon'
  },
  {
    id: 'colorMatch',
    title: 'Empareja Colores',
    description: 'Conecta colores con sus nombres',
    icon: '🎨',
    route: '/color-match'
  },
  {
    id: 'musicQuiz',
    title: 'Quiz Musical',
    description: 'Demuestra tus conocimientos musicales',
    icon: '🎤',
    route: '/music-quiz'
  },
  {
    id: 'trivia',
    title: 'Trivia',
    description: 'Responde preguntas y demuestra tu conocimiento',
    icon: '❓',
    route: '/trivia'
  }
];

export const GameHub: React.FC = () => {
  const { config, isAdminMode, setAdminMode } = useAdmin();

  // Filter and sort games based on admin configuration - show all games by default if config doesn't exist
  const availableGames = games
    .filter(game => {
      const gameConfig = config.gameConfigs[game.id];
      // If no config exists for a game, show it by default (enabled)
      // If config exists, only show if enabled is true
      return !gameConfig || gameConfig.enabled !== false;
    })
    .sort((a, b) => {
      const orderA = config.gameConfigs[a.id]?.order || 0;
      const orderB = config.gameConfigs[b.id]?.order || 0;
      return orderA - orderB;
    });

  console.log('Available games:', availableGames.map(g => g.id));
  console.log('Game configs:', Object.keys(config.gameConfigs));

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-black via-red-900/20 to-black relative overflow-hidden"
    >
      {/* Animated background elements - escalados para 4K */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-60 lg:-top-80 xl:-top-96 -right-60 lg:-right-80 xl:-right-96 w-96 lg:w-[40rem] xl:w-[50rem] h-96 lg:h-[40rem] xl:h-[50rem] rounded-full opacity-20 animate-pulse bg-red-600"
        ></div>
        <div 
          className="absolute top-1/2 -left-60 lg:-left-80 xl:-left-96 w-80 lg:w-96 xl:w-[30rem] h-80 lg:h-96 xl:h-[30rem] rounded-full opacity-20 animate-bounce bg-white"
        ></div>
        <div 
          className="absolute bottom-32 lg:bottom-40 xl:bottom-48 right-32 lg:right-40 xl:right-48 w-60 lg:w-80 xl:w-96 h-60 lg:h-80 xl:h-96 rounded-full opacity-20 animate-spin-slow bg-red-600"
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 lg:p-8 xl:p-12 text-center">
        <div className="flex justify-between items-center mb-8 lg:mb-12">
          <div></div>
          <Button
            onClick={() => setAdminMode(!isAdminMode)}
            variant="outline"
            size="sm"
            className="bg-black/20 border-red-600/60 text-white hover:bg-red-600/10 text-lg lg:text-xl p-4 lg:p-6"
          >
            <Settings className="w-6 h-6 lg:w-8 lg:h-8 mr-2" />
            {isAdminMode ? 'Salir Admin' : 'Admin'}
          </Button>
        </div>
        
        {/* Logo - mucho más grande en 4K */}
        {config.logoUrl && (
          <div className="mb-8 lg:mb-12 xl:mb-16 flex justify-center">
            <img 
              src={config.logoUrl} 
              alt={config.brandName}
              className="h-32 lg:h-48 xl:h-64 w-auto object-contain animate-bounce-in"
            />
          </div>
        )}
        
        {/* Título principal - enormemente escalado */}
        <h1 
          className="text-5xl lg:text-8xl xl:text-9xl font-bold text-transparent bg-gradient-to-r bg-clip-text animate-neon-pulse mb-4 lg:mb-8"
          style={{
            backgroundImage: 'linear-gradient(45deg, #dc2626, #ffffff, #dc2626)'
          }}
        >
          {config.brandName}
        </h1>
        <p className="text-2xl lg:text-4xl xl:text-5xl text-gray-300 mb-8 lg:mb-12 animate-bounce-in">
          {config.welcomeMessage}
        </p>
        
        {/* Event Theme Info - escalado */}
        <div className="bg-black/40 rounded-lg p-6 lg:p-8 xl:p-12 mx-auto max-w-2xl lg:max-w-4xl xl:max-w-6xl backdrop-blur-sm border border-red-600/30">
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
            🎉 {config.eventTheme.eventType} de {config.eventTheme.personName} 🎉
          </h2>
          <p className="text-2xl lg:text-3xl xl:text-4xl text-gray-300">
            ¡{config.eventTheme.age} años de diversión!
          </p>
          {config.eventTheme.customMessage && (
            <p className="text-gray-400 mt-4 lg:mt-6 italic text-xl lg:text-2xl xl:text-3xl">
              {config.eventTheme.customMessage}
            </p>
          )}
        </div>
      </header>

      {/* Admin Panel */}
      {isAdminMode && (
        <div className="relative z-10 mx-6 lg:mx-8 xl:mx-12 mb-8 lg:mb-12">
          <AdminPanel />
        </div>
      )}

      {/* Games Grid - mucho más espacioso */}
      <main className="relative z-10 px-6 lg:px-8 xl:px-12 pb-8 lg:pb-12">
        <div className="max-w-8xl mx-auto">
          {availableGames.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {availableGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  delay={index * 100}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 lg:py-48">
              <h3 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-8">
                No hay juegos disponibles
              </h3>
              <p className="text-gray-400 mb-12 text-xl lg:text-2xl xl:text-3xl">
                Habilita algunos juegos desde el panel de administración
              </p>
              {!isAdminMode && (
                <Button
                  onClick={() => setAdminMode(true)}
                  className="bg-gradient-to-r from-red-600 to-black text-xl lg:text-2xl xl:text-3xl p-6 lg:p-8 xl:p-10"
                >
                  <Settings className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 mr-4" />
                  Abrir Panel Admin
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Copyright Notice */}
      <footer className="relative z-10 text-center py-6 lg:py-8 border-t border-red-600/30">
        <p className="text-white/80 text-lg lg:text-xl xl:text-2xl font-semibold">
          © 2025 AJ PRODUCCIONES - Todos los derechos reservados
        </p>
      </footer>

      {/* Floating game icon - más grande */}
      <div className="fixed bottom-12 lg:bottom-16 xl:bottom-20 left-12 lg:left-16 xl:left-20 animate-bounce">
        <Gamepad2 className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 opacity-60 text-red-600" />
      </div>
    </div>
  );
};
