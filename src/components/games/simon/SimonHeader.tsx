
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface SimonHeaderProps {
  attempts: number;
  maxAttempts: number;
  onReset: () => void;
  canReset: boolean;
}

export const SimonHeader: React.FC<SimonHeaderProps> = ({
  attempts,
  maxAttempts,
  onReset,
  canReset
}) => {
  const navigate = useNavigate();
  const { config } = useAdmin();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button 
        onClick={() => navigate('/')} 
        variant="outline"
        className="bg-black/20 border-white/20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
      
      {config.logoUrl && (
        <div className="flex justify-center">
          <img 
            src={config.logoUrl} 
            alt={config.brandName}
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <Button
        onClick={onReset}
        variant="outline"
        className="bg-black/20 border-white/20 text-white hover:bg-white/10"
        disabled={!canReset}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        ({attempts}/{maxAttempts})
      </Button>
    </div>
  );
};
