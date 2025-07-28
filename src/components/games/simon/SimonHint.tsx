
import React from 'react';
import { Volume2 } from 'lucide-react';

interface SimonHintProps {
  showHint: boolean;
  isPlaying: boolean;
  isShowingSequence: boolean;
}

export const SimonHint: React.FC<SimonHintProps> = ({
  showHint,
  isPlaying,
  isShowingSequence
}) => {
  if (!showHint || !isPlaying || isShowingSequence) return null;

  return (
    <div className="mb-4 p-3 bg-black/40 rounded-lg text-center">
      <div className="flex items-center justify-center gap-2 text-white">
        <Volume2 className="w-4 h-4" />
        <span className="text-sm">💡 Memoriza la secuencia de fotos de Uma</span>
      </div>
    </div>
  );
};
