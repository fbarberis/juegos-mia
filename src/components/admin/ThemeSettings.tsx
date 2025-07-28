
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ThemeConfig {
  eventTheme: {
    personName: string;
    age: number;
    eventType: string;
    customMessage?: string;
  };
  brandName: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  gameTexts: Record<string, string>;
}

interface ThemeSettingsProps {
  config: ThemeConfig;
  onUpdate: (updates: Partial<ThemeConfig>) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="logoUrl" className="text-white">URL del Logo</Label>
        <Input
          id="logoUrl"
          value={config.logoUrl}
          onChange={(e) => onUpdate({ logoUrl: e.target.value })}
          className="bg-black border-red-600 text-white"
          placeholder="https://ejemplo.com/logo.png"
        />
        {config.logoUrl && (
          <div className="bg-black/60 border border-red-600/30 rounded-lg p-4">
            <img 
              src={config.logoUrl} 
              alt="Logo Preview" 
              className="h-20 w-auto object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200x80?text=Logo+Error';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personName" className="text-white">Nombre del Homenajeado/a</Label>
          <Input
            id="personName"
            value={config.eventTheme.personName}
            onChange={(e) => onUpdate({
              eventTheme: { ...config.eventTheme, personName: e.target.value }
            })}
            className="bg-black border-red-600 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age" className="text-white">Edad</Label>
          <Input
            id="age"
            type="number"
            value={config.eventTheme.age}
            onChange={(e) => onUpdate({
              eventTheme: { ...config.eventTheme, age: Number(e.target.value) }
            })}
            className="bg-black border-red-600 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventType" className="text-white">Tipo de Evento</Label>
        <Input
          id="eventType"
          value={config.eventTheme.eventType}
          onChange={(e) => onUpdate({
            eventTheme: { ...config.eventTheme, eventType: e.target.value }
          })}
          className="bg-black border-red-600 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="brandName" className="text-white">Nombre del Evento</Label>
        <Input
          id="brandName"
          value={config.brandName}
          onChange={(e) => onUpdate({ brandName: e.target.value })}
          className="bg-black border-red-600 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="welcomeMessage" className="text-white">Mensaje de Bienvenida</Label>
        <Textarea
          id="welcomeMessage"
          value={config.welcomeMessage}
          onChange={(e) => onUpdate({ welcomeMessage: e.target.value })}
          className="bg-black border-red-600 text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor" className="text-white">Color Primario</Label>
          <Input
            id="primaryColor"
            type="color"
            value={config.primaryColor}
            onChange={(e) => onUpdate({ primaryColor: e.target.value })}
            className="bg-black border-red-600 h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryColor" className="text-white">Color Secundario</Label>
          <Input
            id="secondaryColor"
            type="color"
            value={config.secondaryColor}
            onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
            className="bg-black border-red-600 h-12"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-white font-semibold">Nombres de Juegos</h4>
        {Object.entries(config.gameTexts).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
            <Input
              value={value}
              onChange={(e) => onUpdate({
                gameTexts: { ...config.gameTexts, [key]: e.target.value }
              })}
              className="bg-black border-red-600 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
