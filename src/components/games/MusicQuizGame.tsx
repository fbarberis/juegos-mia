
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Music, Volume2 } from 'lucide-react';

const MUSIC_QUESTIONS = [
  {
    id: 1,
    question: "¿Qué ritmo es característico de la música electrónica?",
    options: ["Rock", "House", "Jazz", "Country"],
    correct: 1,
    emoji: "🎛️"
  },
  {
    id: 2,
    question: "¿Cuál es el BPM típico de la música dance?",
    options: ["60-80", "120-140", "200-220", "40-60"],
    correct: 1,
    emoji: "💃"
  },
  {
    id: 3,
    question: "¿Qué significa DJ?",
    options: ["Dance Jockey", "Disk Jockey", "Digital Jockey", "Dynamic Jockey"],
    correct: 1,
    emoji: "🎧"
  },
  {
    id: 4,
    question: "¿En qué década surgió la música disco?",
    options: ["1960s", "1970s", "1980s", "1990s"],
    correct: 1,
    emoji: "🕺"
  },
  {
    id: 5,
    question: "¿Cuál es el nombre del efecto que modifica gradualmente la velocidad?",
    options: ["Echo", "Reverb", "Pitch Bend", "Flanger"],
    correct: 2,
    emoji: "🎚️"
  }
];

export const MusicQuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useAdmin();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver && !showResult && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, showResult, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(15);
  };

  const handleTimeUp = () => {
    setAnswers(prev => [...prev, false]);
    nextQuestion();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !gameStarted) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === MUSIC_QUESTIONS[currentQuestion].correct;
    setAnswers(prev => [...prev, isCorrect]);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      setScore(prev => prev + 10 + timeBonus);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion >= MUSIC_QUESTIONS.length - 1) {
      // Game over
      setGameOver(true);
      setGameStarted(false);
      
      // Determine prize
      const correctAnswers = answers.filter(Boolean).length + (selectedAnswer === MUSIC_QUESTIONS[currentQuestion]?.correct ? 1 : 0);
      let prizeIndex = 0;
      
      if (correctAnswers >= 4) {
        prizeIndex = 0; // Music expert
      } else if (correctAnswers >= 3) {
        prizeIndex = 1; // Music fan
      } else {
        prizeIndex = 2; // Participation
      }
      
      setWonPrize(config.prizes[prizeIndex] || config.prizes[0]);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(15);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setTimeLeft(15);
    setGameStarted(false);
    setAnswers([]);
    setWonPrize(null);
  };

  const currentQ = MUSIC_QUESTIONS[currentQuestion];
  const correctAnswers = answers.filter(Boolean).length + (showResult && selectedAnswer === currentQ?.correct ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-purple-900 p-6 relative overflow-hidden">
      {/* Animated music notes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-2xl animate-bounce">🎵</div>
        <div className="absolute top-40 right-20 text-xl animate-pulse">🎶</div>
        <div className="absolute bottom-40 left-32 text-lg animate-bounce">🎤</div>
        <div className="absolute bottom-20 right-40 text-xl animate-pulse">🎸</div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
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
          🎵 {config.gameTexts.musicQuiz}
        </h1>

        {/* Game Stats */}
        {gameStarted && !gameOver && (
          <div className="bg-black/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-300 text-sm">Pregunta</p>
                <p className="text-white text-xl font-bold">{currentQuestion + 1}/5</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Tiempo</p>
                <p className="text-white text-xl font-bold flex items-center justify-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  {timeLeft}s
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Puntos</p>
                <p className="text-white text-xl font-bold">{score}</p>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        {!gameStarted && !gameOver && (
          <div className="text-center mb-6">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-8 py-4 text-xl font-bold rounded-full"
            >
              <Music className="w-6 h-6 mr-2" />
              Iniciar Quiz Musical
            </Button>
          </div>
        )}

        {/* Question */}
        {gameStarted && !gameOver && currentQ && (
          <div className="bg-black/20 rounded-lg p-6 mb-6 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{currentQ.emoji}</div>
              <h2 className="text-white text-xl font-bold mb-4">
                {currentQ.question}
              </h2>
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200 font-semibold
                    ${showResult
                      ? index === currentQ.correct
                        ? 'bg-green-600 text-white'
                        : index === selectedAnswer
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
            
            {showResult && (
              <div className="mt-4 text-center">
                <p className={`text-lg font-bold ${
                  selectedAnswer === currentQ.correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedAnswer === currentQ.correct ? '🎉 ¡Correcto!' : '❌ Incorrecto'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Final Results */}
        {gameOver && (
          <div className="space-y-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-4 text-center">Resultados del Quiz</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {MUSIC_QUESTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-white font-bold ${
                      answers[index] ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-white text-lg">
                  <span className="font-bold">{correctAnswers}/5</span> respuestas correctas
                </p>
                <p className="text-white text-lg">
                  Puntuación: <span className="font-bold">{score}</span> puntos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Prize Result */}
        {wonPrize && (
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg p-6 text-center animate-bounce-in border-4 border-violet-300 shadow-xl backdrop-blur-sm">
            <div className="text-4xl mb-2 animate-bounce">🎊🎵🎊</div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Quiz Completado!</h2>
            <p className="text-white mb-2">
              {correctAnswers}/5 correctas | {score} puntos
            </p>
            <p className="text-white text-lg font-semibold">{wonPrize}</p>
            <div className="mt-4 text-3xl animate-spin-slow">🌟</div>
          </div>
        )}

        {/* Instructions */}
        {!gameStarted && !gameOver && (
          <div className="bg-black/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <p className="text-gray-300 text-sm">
              🎯 Responde 5 preguntas sobre música<br/>
              ⏰ 15 segundos por pregunta<br/>
              🏆 Demuestra tus conocimientos musicales
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
