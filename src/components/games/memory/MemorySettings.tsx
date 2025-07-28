
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

interface MemorySettingsProps {
  maxMoves: number;
  gridSize: number;
  onMaxMovesChange: (value: number) => void;
  onGridSizeChange: (value: number) => void;
}

export const MemorySettings: React.FC<MemorySettingsProps> = ({
  maxMoves,
  gridSize,
  onMaxMovesChange,
  onGridSizeChange
}) => {
  const maxPairs = Math.floor((gridSize * gridSize) / 2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/20 border-white/20 text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Configuración del Juego</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Máximo de Movimientos: {maxMoves}</Label>
            <Slider
              value={[maxMoves]}
              onValueChange={(value) => onMaxMovesChange(value[0])}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Tamaño de Grilla: {gridSize}x{gridSize} ({maxPairs} pares)</Label>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => onGridSizeChange(value[0])}
              min={2}
              max={6}
              step={2}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
