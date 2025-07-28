
import React from 'react';

interface LogoHuntInstructionsProps {
  logosToFind: number;
  maxAttempts: number;
  config: any;
  isGameComplete: boolean;
}

export const LogoHuntInstructions: React.FC<LogoHuntInstructionsProps> = ({
  logosToFind,
  maxAttempts,
  config,
  isGameComplete
}) => {
  if (isGameComplete) return null;

  return (
    <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
      <p className="text-gray-300 text-sm">
        🔍 Encuentra las {logosToFind} fotos especiales de Umma en {maxAttempts} intentos
      </p>
      <p className="text-gray-400 text-xs mt-1">
        💫 Consigue rachas para más puntos • Celebrando el {config.eventTheme.eventType} de {config.eventTheme.personName} 🎂
      </p>
    </div>
  );
};
