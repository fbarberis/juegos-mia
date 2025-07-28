
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw, Eye, EyeOff } from 'lucide-react';

const WORDS = [
  { word: 'FIESTA', hint: 'Celebración con música y baile' },
  { word: 'MUSICA', hint: 'Arte de combinar sonidos armoniosos' },
  { word: 'BAILE', hint: 'Movimiento al ritmo de la música' },
  { word: 'LUCES', hint: 'Iluminación de colores brillantes' },
  { word: 'SONIDO', hint: 'Lo que percibimos con los oídos' },
  { word: 'ESCENARIO', hint: 'Donde actúan los artistas' },
  { word: 'PUBLICO', hint: 'Grupo de personas que asisten' },
  { word: 'DISCOTECA', hint: 'Local de baile nocturno' },
  { word: 'BEBIDA', hint: 'Líquido refrescante para tomar' },
  { word: 'NOCHE', hint: 'Opuesto al día, tiempo de oscuridad' },
  { word: 'REGALO', hint: 'Obsequio que se da en celebraciones' },
  { word: 'TORTA', hint: 'Dulce especial para festejar' },
  { word: 'GLOBO', hint: 'Decoración inflable y colorida' },
  { word: 'CORONA', hint: 'Accesorio real para la cabeza' },
  { word: 'VESTIDO', hint: 'Prenda elegante para ocasiones especiales' }
];

export const WordGuessGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [currentWord, setCurrentWord] = useState('');
  const [hint, setHint] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [inputLetter, setInputLetter] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord.word);
    setHint(randomWord.hint);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setGameOver(false);
    setWon(false);
    setInputLetter('');
    setShowHint(false);
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setWonPrize(null);
    startNewGame();
  };

  const guessLetter = (letter: string) => {
    const upperLetter = letter.toUpperCase();
    
    if (guessedLetters.includes(upperLetter) || wrongGuesses.includes(upperLetter)) {
      return;
    }

    if (currentWord.includes(upperLetter)) {
      setGuessedLetters(prev => [...prev, upperLetter]);
      
      // Check if word is complete
      const newGuessedLetters = [...guessedLetters, upperLetter];
      const isWordComplete = currentWord.split('').every(letter => newGuessedLetters.includes(letter));
      
      if (isWordComplete) {
        setWon(true);
        setGameOver(true);
        const points = Math.max(10 - wrongGuesses.length, 1) + (showHint ? 0 : 2);
        setScore(prev => prev + points);
      }
    } else {
      setWrongGuesses(prev => [...prev, upperLetter]);
      
      if (wrongGuesses.length >= 5) {
        setGameOver(true);
      }
    }
    
    setInputLetter('');
  };

  const nextRound = () => {
    if (round >= 3) {
      // Game completed
      let prizeIndex = 0;
      if (score >= 25) {
        prizeIndex = 0; // Excellent score
      } else if (score >= 15) {
        prizeIndex = 1; // Good score
      } else {
        prizeIndex = 2; // Participation
      }
      setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
    } else {
      setRound(prev => prev + 1);
      startNewGame();
    }
  };

  const displayWord = () => {
    return currentWord.split('').map(letter => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputLetter.trim()) {
      guessLetter(inputLetter.trim());
    }
  };

  const maxWrongGuesses = 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 relative overflow-hidden">
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl font-bold text-center text-white mb-6 animate-neon-pulse">
          📝 {config.gameTexts.wordGuess}
        </h1>

        {/* Score and Round */}
        <div className="bg-black/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-300 text-sm">Ronda</p>
              <p className="text-white text-xl font-bold">{round}/3</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Puntos</p>
              <p className="text-white text-xl font-bold">{score}</p>
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-black/20 rounded-lg p-6 mb-6 text-center backdrop-blur-sm">
          <div className="text-4xl font-mono font-bold text-white mb-4 tracking-wider">
            {displayWord()}
          </div>
          
          {/* Hint */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="sm"
              className="bg-black/20 border-white/20 text-white hover:bg-white/10"
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHint ? 'Ocultar' : 'Pista'}
            </Button>
          </div>
          
          {showHint && (
            <p className="text-yellow-300 text-sm animate-fade-in">{hint}</p>
          )}
        </div>

        {/* Wrong Guesses Display */}
        <div className="bg-black/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-2">
              Errores: {wrongGuesses.length}/{maxWrongGuesses}
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: maxWrongGuesses }, (_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index < wrongGuesses.length ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            {wrongGuesses.length > 0 && (
              <p className="text-red-400 text-sm mt-2">
                Letras incorrectas: {wrongGuesses.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Input */}
        {!gameOver && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <Input
                value={inputLetter}
                onChange={(e) => setInputLetter(e.target.value.slice(0, 1))}
                placeholder="Letra..."
                className="bg-black/20 border-white/20 text-white text-center text-xl font-bold uppercase"
                maxLength={1}
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-purple-500"
                disabled={!inputLetter.trim()}
              >
                Enviar
              </Button>
            </div>
          </form>
        )}

        {/* Game Over Messages */}
        {gameOver && !wonPrize && (
          <div className={`rounded-lg p-6 text-center backdrop-blur-sm mb-6 ${
            won ? 'bg-green-600/80' : 'bg-red-600/80'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-2">
              {won ? '¡Correcto!' : '¡Palabra Perdida!'}
            </h2>
            <p className="text-white mb-2">
              La palabra era: <span className="font-bold">{currentWord}</span>
            </p>
            {won && (
              <p className="text-white">
                +{Math.max(10 - wrongGuesses.length, 1) + (showHint ? 0 : 2)} puntos
              </p>
            )}
            
            {round < 3 && (
              <Button
                onClick={nextRound}
                className="mt-4 bg-white text-black hover:bg-gray-200"
              >
                Siguiente Ronda
              </Button>
            )}
            
            {round >= 3 && (
              <Button
                onClick={nextRound}
                className="mt-4 bg-white text-black hover:bg-gray-200"
              >
                Ver Resultado Final
              </Button>
            )}
          </div>
        )}

        {/* Final Prize */}
        {wonPrize && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-yellow-300 shadow-xl backdrop-blur-sm">
            <div className="text-4xl mb-2 animate-bounce">🎊📝🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Juego Completado!</h2>
            <p className="text-white mb-2">Puntuación Final: {score} puntos</p>
            <p className="text-white text-lg font-semibold">{wonPrize}</p>
            <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Instructions */}
        {!gameOver && round === 1 && guessedLetters.length === 0 && (
          <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-sm">
              🎯 Adivina la palabra letra por letra<br/>
              💡 Usa la pista si necesitas ayuda<br/>
              🏆 Completa 3 rondas para ganar premios
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
