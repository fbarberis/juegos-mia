
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PrizeSettingsProps {
  prizes: string[];
  instantPrizes: boolean;
  onAddPrize: () => void;
  onRemovePrize: (index: number) => void;
  onUpdatePrize: (index: number, value: string) => void;
  onToggleInstantPrizes: (enabled: boolean) => void;
}

export const PrizeSettings: React.FC<PrizeSettingsProps> = ({
  prizes,
  instantPrizes,
  onAddPrize,
  onRemovePrize,
  onUpdatePrize,
  onToggleInstantPrizes
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold">Sistema de Premios</h3>
          <Switch
            checked={instantPrizes}
            onCheckedChange={onToggleInstantPrizes}
          />
          <span className="text-gray-400 text-sm">
            {instantPrizes ? 'Premios Instantáneos' : 'Tragaperras'}
          </span>
        </div>
        <Button onClick={onAddPrize} size="sm" className="bg-purple-600 hover:bg-purple-700">
          Agregar Premio
        </Button>
      </div>
      
      {prizes.map((prize, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={prize}
            onChange={(e) => onUpdatePrize(index, e.target.value)}
            className="bg-gray-800 border-gray-600 text-white flex-1"
          />
          <Button
            onClick={() => onRemovePrize(index)}
            variant="destructive"
            size="sm"
          >
            Eliminar
          </Button>
        </div>
      ))}
    </div>
  );
};
