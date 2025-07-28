
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

interface LogoHuntSettingsProps {
  maxAttempts: number;
  logosToFind: number;
  gridSize: number;
  onMaxAttemptsChange: (value: number) => void;
  onLogosToFindChange: (value: number) => void;
  onGridSizeChange: (value: number) => void;
}

export const LogoHuntSettings: React.FC<LogoHuntSettingsProps> = ({
  maxAttempts,
  logosToFind,
  gridSize,
  onMaxAttemptsChange,
  onLogosToFindChange,
  onGridSizeChange
}) => {
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
          <DialogTitle>Configuración del Tesoro</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Intentos Máximos: {maxAttempts}</Label>
            <Slider
              value={[maxAttempts]}
              onValueChange={(value) => onMaxAttemptsChange(value[0])}
              min={3}
              max={15}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Imágenes a Encontrar: {logosToFind}</Label>
            <Slider
              value={[logosToFind]}
              onValueChange={(value) => onLogosToFindChange(value[0])}
              min={1}
              max={Math.floor((gridSize * gridSize) / 2)}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Tamaño de Grilla: {gridSize}x{gridSize} ({gridSize * gridSize} celdas)</Label>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => onGridSizeChange(value[0])}
              min={3}
              max={6}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
