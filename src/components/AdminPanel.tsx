
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSettings } from './admin/ThemeSettings';
import { GameSettings } from './admin/GameSettings';
import { PrizeSettings } from './admin/PrizeSettings';
import { SlotMachineSettings } from './admin/SlotMachineSettings';
import { PuzzleSettings } from './admin/PuzzleSettings';
import { TriviaSettings } from './admin/TriviaSettings';

export const AdminPanel: React.FC = () => {
  const { config, updateConfig, resetPrizeCount, resetToDefaults } = useAdmin();
  const [tempConfig, setTempConfig] = useState(config);

  const handleSave = () => {
    updateConfig(tempConfig);
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    setTempConfig(config);
  };

  const handleGameConfigUpdate = (gameId: string, key: string, value: any) => {
    setTempConfig(prev => ({
      ...prev,
      gameConfigs: {
        ...prev.gameConfigs,
        [gameId]: {
          ...prev.gameConfigs[gameId],
          [key]: value
        }
      }
    }));
  };

  const handleCustomSettingUpdate = (gameId: string, settingKey: string, value: any) => {
    setTempConfig(prev => ({
      ...prev,
      gameConfigs: {
        ...prev.gameConfigs,
        [gameId]: {
          ...prev.gameConfigs[gameId],
          customSettings: {
            ...prev.gameConfigs[gameId].customSettings,
            [settingKey]: value
          }
        }
      }
    }));
  };

  const moveGame = (gameId: string, direction: 'up' | 'down') => {
    const games = Object.entries(tempConfig.gameConfigs).sort((a, b) => a[1].order - b[1].order);
    const currentIndex = games.findIndex(([id]) => id === gameId);
    
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < games.length - 1)
    ) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const [currentGame] = games.splice(currentIndex, 1);
      games.splice(newIndex, 0, currentGame);
      
      const updatedConfigs = { ...tempConfig.gameConfigs };
      games.forEach(([id], index) => {
        updatedConfigs[id] = { ...updatedConfigs[id], order: index };
      });
      
      setTempConfig(prev => ({ ...prev, gameConfigs: updatedConfigs }));
    }
  };

  const addPrize = () => {
    setTempConfig(prev => ({
      ...prev,
      prizes: [...prev.prizes, `Premio ${prev.prizes.length + 1}: Nuevo premio`]
    }));
  };

  const removePrize = (index: number) => {
    setTempConfig(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const updatePrize = (index: number, value: string) => {
    setTempConfig(prev => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => i === index ? value : prize)
    }));
  };

  const sortedGames = Object.entries(tempConfig.gameConfigs).sort((a, b) => a[1].order - b[1].order);

  return (
    <Card className="bg-gradient-to-br from-black to-gray-900 border border-red-700 rounded-lg p-6 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Panel de Administrador</CardTitle>
        <CardDescription className="text-gray-400">
          Personaliza completamente tu evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black border border-red-600">
            <TabsTrigger value="theme" className="text-white data-[state=active]:bg-red-600">Tema</TabsTrigger>
            <TabsTrigger value="config" className="text-white data-[state=active]:bg-red-600">Juegos</TabsTrigger>
            <TabsTrigger value="prizes" className="text-white data-[state=active]:bg-red-600">Premios</TabsTrigger>
            <TabsTrigger value="slot" className="text-white data-[state=active]:bg-red-600">Tragaperras</TabsTrigger>
            <TabsTrigger value="puzzle" className="text-white data-[state=active]:bg-red-600">Puzzle</TabsTrigger>
            <TabsTrigger value="trivia" className="text-white data-[state=active]:bg-red-600">Trivia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-4">
            <ThemeSettings
              config={tempConfig}
              onUpdate={(updates) => setTempConfig(prev => ({ 
                ...prev, 
                ...updates,
                eventTheme: {
                  ...prev.eventTheme,
                  ...(updates.eventTheme || {}),
                  customMessage: updates.eventTheme?.customMessage || prev.eventTheme.customMessage
                }
              }))}
            />
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-6">
              {sortedGames.map(([gameId, gameConfig]) => (
                <GameSettings
                  key={gameId}
                  gameId={gameId}
                  gameConfig={gameConfig}
                  gameTitle={tempConfig.gameTexts[gameId] || gameId}
                  onUpdate={handleGameConfigUpdate}
                  onCustomSettingUpdate={handleCustomSettingUpdate}
                  onMoveGame={moveGame}
                  canMoveUp={gameConfig.order > 0}
                  canMoveDown={gameConfig.order < Object.keys(tempConfig.gameConfigs).length - 1}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="prizes" className="space-y-4">
            <PrizeSettings
              prizes={tempConfig.prizes}
              instantPrizes={tempConfig.instantPrizes}
              onAddPrize={addPrize}
              onRemovePrize={removePrize}
              onUpdatePrize={updatePrize}
              onToggleInstantPrizes={(enabled) => setTempConfig(prev => ({ ...prev, instantPrizes: enabled }))}
            />
          </TabsContent>
          
          <TabsContent value="slot" className="space-y-4">
            <SlotMachineSettings
              config={tempConfig.slotMachine}
              onUpdate={(updates) => setTempConfig(prev => ({
                ...prev,
                slotMachine: { ...prev.slotMachine, ...updates }
              }))}
              onResetPrizeCount={resetPrizeCount}
            />
          </TabsContent>
          
          <TabsContent value="puzzle" className="space-y-4">
            <PuzzleSettings
              puzzleImage={tempConfig.puzzleImage}
              onUpdate={(imageUrl) => setTempConfig(prev => ({ ...prev, puzzleImage: imageUrl }))}
            />
          </TabsContent>
          
          <TabsContent value="trivia" className="space-y-4">
            <TriviaSettings
              questions={tempConfig.gameConfigs.trivia?.customSettings?.questions || []}
              onUpdate={(questions) => handleCustomSettingUpdate('trivia', 'questions', questions)}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-between">
          <Button 
            onClick={handleResetToDefaults} 
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            Restaurar Valores por Defecto
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-red-600 to-black text-white">
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
