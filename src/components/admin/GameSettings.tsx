import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface GameConfig {
  enabled: boolean;
  order: number;
  maxAttempts: number;
  timeLimit?: number;
  customSettings: Record<string, any>;
}

interface GameSettingsProps {
  gameId: string;
  gameConfig: GameConfig;
  gameTitle: string;
  onUpdate: (gameId: string, key: string, value: any) => void;
  onCustomSettingUpdate: (gameId: string, settingKey: string, value: any) => void;
  onMoveGame: (gameId: string, direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameId,
  gameConfig,
  gameTitle,
  onUpdate,
  onCustomSettingUpdate,
  onMoveGame,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{gameTitle}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveGame(gameId, 'up')}
              disabled={!canMoveUp}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveGame(gameId, 'down')}
              disabled={!canMoveDown}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Switch
              checked={gameConfig.enabled}
              onCheckedChange={(checked) => onUpdate(gameId, 'enabled', checked)}
            />
          </div>
        </div>
      </CardHeader>
      
      {gameConfig.enabled && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Intentos Máximos</Label>
              <Input
                type="number"
                value={gameConfig.maxAttempts}
                onChange={(e) => onUpdate(gameId, 'maxAttempts', Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            {gameConfig.timeLimit !== undefined && (
              <div>
                <Label className="text-white">Tiempo Límite (seg)</Label>
                <Input
                  type="number"
                  value={gameConfig.timeLimit}
                  onChange={(e) => onUpdate(gameId, 'timeLimit', Number(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}
          </div>
          
          {/* Memory Game Settings */}
          {gameId === 'memory' && (
            <div className="space-y-3">
              <div>
                <Label className="text-white">Tamaño de Grilla</Label>
                <Select
                  value={gameConfig.customSettings.gridSize?.toString()}
                  onValueChange={(value) => onCustomSettingUpdate(gameId, 'gridSize', Number(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3x3 (8 pares)</SelectItem>
                    <SelectItem value="4">4x4 (8 pares)</SelectItem>
                    <SelectItem value="5">5x4 (10 pares)</SelectItem>
                    <SelectItem value="6">6x4 (12 pares)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white">Movimientos Máximos</Label>
                <Slider
                  value={[gameConfig.customSettings.maxMoves || 20]}
                  onValueChange={([value]) => onCustomSettingUpdate(gameId, 'maxMoves', value)}
                  max={50}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{gameConfig.customSettings.maxMoves || 20} movimientos</span>
              </div>
            </div>
          )}
          
          {/* Logo Hunt Game Settings */}
          {gameId === 'logoHunt' && (
            <div className="space-y-3">
              <div>
                <Label className="text-white">Tamaño de Grilla</Label>
                <Select
                  value={gameConfig.customSettings.gridSize?.toString()}
                  onValueChange={(value) => onCustomSettingUpdate(gameId, 'gridSize', Number(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3x3</SelectItem>
                    <SelectItem value="4">4x4</SelectItem>
                    <SelectItem value="5">5x5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white">Intentos Máximos</Label>
                <Slider
                  value={[gameConfig.customSettings.maxAttempts || 6]}
                  onValueChange={([value]) => onCustomSettingUpdate(gameId, 'maxAttempts', value)}
                  max={15}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{gameConfig.customSettings.maxAttempts || 6} intentos</span>
              </div>
              
              <div>
                <Label className="text-white">Logos a Encontrar</Label>
                <Slider
                  value={[gameConfig.customSettings.logosToFind || 3]}
                  onValueChange={([value]) => onCustomSettingUpdate(gameId, 'logosToFind', value)}
                  max={6}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{gameConfig.customSettings.logosToFind || 3} logos</span>
              </div>
            </div>
          )}
          
          {/* Simon Game Settings */}
          {gameId === 'simon' && (
            <div className="space-y-3">
              <div>
                <Label className="text-white">Longitud de Secuencia</Label>
                <Slider
                  value={[gameConfig.customSettings.sequenceLength || 8]}
                  onValueChange={([value]) => onCustomSettingUpdate(gameId, 'sequenceLength', value)}
                  max={15}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{gameConfig.customSettings.sequenceLength || 8} elementos</span>
              </div>
              
              <div>
                <Label className="text-white">Velocidad (ms)</Label>
                <Slider
                  value={[gameConfig.customSettings.speed || 1000]}
                  onValueChange={([value]) => onCustomSettingUpdate(gameId, 'speed', value)}
                  max={2000}
                  min={500}
                  step={100}
                  className="w-full"
                />
                <span className="text-gray-400 text-sm">{gameConfig.customSettings.speed || 1000}ms</span>
              </div>
            </div>
          )}
          
          {/* Puzzle Game Settings */}
          {gameId === 'puzzle' && (
            <div>
              <Label className="text-white">Número de Piezas</Label>
              <Select
                value={gameConfig.customSettings.pieces?.toString()}
                onValueChange={(value) => onCustomSettingUpdate(gameId, 'pieces', Number(value))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 piezas (fácil)</SelectItem>
                  <SelectItem value="9">9 piezas (medio)</SelectItem>
                  <SelectItem value="12">12 piezas (difícil)</SelectItem>
                  <SelectItem value="16">16 piezas (experto)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
