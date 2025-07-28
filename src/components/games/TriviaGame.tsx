
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { GameResult } from '../GameResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Home, RotateCcw, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

// Función para mezclar array de preguntas
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const TriviaGame: React.FC = () => {
  const navigate = useNavigate();
  const adminContext = useAdmin();
  
  // Add defensive check for context
  if (!adminContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
            <p className="text-gray-300">Iniciando el juego de trivia</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { config } = adminContext;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [questionsPerGame, setQuestionsPerGame] = useState(5);

  const allQuestions: Question[] = config.gameConfigs.trivia?.customSettings?.questions || [];
  console.log('TriviaGame - Questions loaded:', allQuestions.length);

  // Inicializar preguntas mezcladas al cargar el componente
  useEffect(() => {
    if (allQuestions.length > 0) {
      const shuffled = shuffleArray(allQuestions).slice(0, questionsPerGame);
      setShuffledQuestions(shuffled);
      console.log('TriviaGame - Shuffled questions:', shuffled.map(q => q.question));
    }
  }, [allQuestions, questionsPerGame]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered || shuffledQuestions.length === 0) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === shuffledQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    // Show result for 1.5 seconds
    setTimeout(() => {
      if (currentQuestion + 1 < questionsPerGame) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Game finished
        const finalScore = isCorrect ? score + 1 : score;
        setGameWon(finalScore === questionsPerGame);
        setGameOver(true);
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setGameWon(false);
    setIsAnswered(false);
    // Mezclar preguntas de nuevo al reiniciar
    if (allQuestions.length > 0) {
      const shuffled = shuffleArray(allQuestions).slice(0, questionsPerGame);
      setShuffledQuestions(shuffled);
    }
  };

  const handleQuestionsChange = (newCount: number) => {
    setQuestionsPerGame(newCount);
    // Si hay un juego en curso, reiniciarlo con la nueva cantidad
    if (currentQuestion > 0 || score > 0) {
      handleRestart();
    }
  };

  const getButtonVariant = (index: number) => {
    if (!isAnswered) return 'outline';
    if (index === shuffledQuestions[currentQuestion]?.correct) return 'default';
    if (index === selectedAnswer && index !== shuffledQuestions[currentQuestion]?.correct) return 'destructive';
    return 'outline';
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40, #1e1b4b)`
        }}
      >
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">No hay preguntas disponibles</h2>
            <p className="text-gray-300 mb-6">
              Configura las preguntas desde el panel de administración
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    return (
      <GameResult
        gameCompleted={true}
        gameWon={gameWon}
        gameTitle="Trivia"
        gameIcon="🧠"
        gameStats={{
          score: `${score}/${questionsPerGame}`,
          questionsAnswered: questionsPerGame,
          correctAnswers: score
        }}
        onPlayAgain={handleRestart}
      />
    );
  }

  const progress = ((currentQuestion + 1) / questionsPerGame) * 100;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4"
      style={{
        background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40, #1e1b4b)`
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-black/20 border-white/20 text-white hover:bg-white/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Button>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">Trivia de Uma</h1>
            <p className="text-gray-300">Pregunta {currentQuestion + 1} de {questionsPerGame}</p>
          </div>
          
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-black/20 border-white/20 text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-black/90 backdrop-blur-sm border-white/20 text-white z-50"
                align="end"
              >
                <DropdownMenuLabel className="text-gray-300">Cantidad de Preguntas</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/20" />
                {[3, 5, 8, 10].map((count) => (
                  <DropdownMenuItem
                    key={count}
                    onClick={() => handleQuestionsChange(count)}
                    className={`cursor-pointer hover:bg-white/10 ${
                      questionsPerGame === count ? 'bg-white/20 font-bold' : ''
                    }`}
                  >
                    {count} preguntas {questionsPerGame === count && '✓'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              onClick={handleRestart}
              className="bg-black/20 border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-white text-sm mt-2">
            <span>Puntuación: {score}</span>
            <span>Progreso: {Math.round(progress)}%</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              {shuffledQuestions[currentQuestion]?.question}
            </h2>
            
            <div className="space-y-3">
              {shuffledQuestions[currentQuestion]?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={getButtonVariant(index)}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className="w-full p-4 text-left justify-start h-auto min-h-[3rem] text-white border-white/20"
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>

            {isAnswered && (
              <div className="mt-4 text-center">
                {selectedAnswer === shuffledQuestions[currentQuestion]?.correct ? (
                  <p className="text-green-400 font-bold">¡Correcto! 🎉</p>
                ) : (
                  <p className="text-red-400 font-bold">
                    Incorrecto. La respuesta correcta era: {shuffledQuestions[currentQuestion]?.options[shuffledQuestions[currentQuestion]?.correct]} 😔
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <p className="text-gray-300 text-sm text-center">
              🎯 ¿Cuánto conoces sobre Uma? Responde {questionsPerGame} preguntas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
