
import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';

interface SimonProgressBarProps {
  level: number;
  targetSequenceLength: number;
}

export const SimonProgressBar: React.FC<SimonProgressBarProps> = ({
  level,
  targetSequenceLength
}) => {
  const { config } = useAdmin();
  
  const getProgress = () => {
    return Math.round((level / targetSequenceLength) * 100);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between text-white text-sm mb-2">
        <span>Progreso</span>
        <span>{level}/{targetSequenceLength}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div 
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${getProgress()}%`,
            background: `linear-gradient(90deg, ${config.primaryColor}, ${config.secondaryColor})`
          }}
        />
      </div>
    </div>
  );
};
