
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

interface PuzzleSettingsProps {
  timeLimit: number;
  onTimeLimitChange: (value: number) => void;
}

export const PuzzleSettings: React.FC<PuzzleSettingsProps> = ({
  timeLimit,
  onTimeLimitChange
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
          <DialogTitle>Configuración del Rompecabezas</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Tiempo Límite: {timeLimit} segundos</Label>
            <Slider
              value={[timeLimit]}
              onValueChange={(value) => onTimeLimitChange(value[0])}
              min={15}
              max={120}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
