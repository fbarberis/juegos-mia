
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PuzzleSettingsProps {
  puzzleImage: string;
  onUpdate: (imageUrl: string) => void;
}

export const PuzzleSettings: React.FC<PuzzleSettingsProps> = ({
  puzzleImage,
  onUpdate
}) => {
  const suggestedImages = [
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="puzzleImage" className="text-white">URL de Imagen del Puzzle</Label>
        <Input
          id="puzzleImage"
          value={puzzleImage}
          onChange={(e) => onUpdate(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      {puzzleImage && (
        <div className="space-y-2">
          <Label className="text-white">Vista Previa</Label>
          <div className="bg-gray-800 rounded-lg p-4">
            <img 
              src={puzzleImage} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded mx-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/128?text=Error';
              }}
            />
          </div>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">Imágenes Sugeridas</h4>
        <div className="grid grid-cols-3 gap-2">
          {suggestedImages.map((url, index) => (
            <button
              key={index}
              onClick={() => onUpdate(url)}
              className="aspect-square rounded overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            >
              <img src={url} alt={`Sugerencia ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
