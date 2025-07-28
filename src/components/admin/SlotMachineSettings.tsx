
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';

interface SlotMachineConfig {
  enabled: boolean;
  totalPrizes: number;
  prizesAwarded: number;
  winProbability: number;
  slotSymbols: string[];
}

interface SlotMachineSettingsProps {
  config: SlotMachineConfig;
  onUpdate: (updates: Partial<SlotMachineConfig>) => void;
  onResetPrizeCount: () => void;
}

export const SlotMachineSettings: React.FC<SlotMachineSettingsProps> = ({
  config,
  onUpdate,
  onResetPrizeCount
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Configuración Tragaperras</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
          <Button
            onClick={onResetPrizeCount}
            variant="outline"
            size="sm"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Total de Premios</Label>
          <Input
            type="number"
            value={config.totalPrizes}
            onChange={(e) => onUpdate({ totalPrizes: Number(e.target.value) })}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        
        <div>
          <Label className="text-white">Premios Otorgados</Label>
          <Input
            type="number"
            value={config.prizesAwarded}
            readOnly
            className="bg-gray-700 border-gray-600 text-gray-400"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-white">Probabilidad de Ganar (%)</Label>
        <Slider
          value={[config.winProbability * 100]}
          onValueChange={([value]) => onUpdate({ winProbability: value / 100 })}
          max={100}
          min={1}
          step={1}
          className="w-full"
        />
        <span className="text-gray-400 text-sm">{Math.round(config.winProbability * 100)}%</span>
      </div>
      
      <div>
        <Label className="text-white">Símbolos de la Tragaperras</Label>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {config.slotSymbols.map((symbol, index) => (
            <Input
              key={index}
              value={symbol}
              onChange={(e) => {
                const newSymbols = [...config.slotSymbols];
                newSymbols[index] = e.target.value;
                onUpdate({ slotSymbols: newSymbols });
              }}
              className="bg-gray-800 border-gray-600 text-white text-center"
              maxLength={2}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
