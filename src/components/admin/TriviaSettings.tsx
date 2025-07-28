
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface TriviaSettingsProps {
  questions: Question[];
  onUpdate: (questions: Question[]) => void;
}

export const TriviaSettings: React.FC<TriviaSettingsProps> = ({
  questions,
  onUpdate
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState<Question>({
    question: '',
    options: ['', '', ''],
    correct: 0
  });

  const handleAddQuestion = () => {
    setTempQuestion({
      question: '',
      options: ['', '', ''],
      correct: 0
    });
    setEditingIndex(-1);
  };

  const handleEditQuestion = (index: number) => {
    setTempQuestion({ ...questions[index] });
    setEditingIndex(index);
  };

  const handleSaveQuestion = () => {
    if (!tempQuestion.question.trim() || tempQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    const updatedQuestions = [...questions];
    if (editingIndex === -1) {
      updatedQuestions.push(tempQuestion);
    } else {
      updatedQuestions[editingIndex] = tempQuestion;
    }
    onUpdate(updatedQuestions);
    setEditingIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onUpdate(updatedQuestions);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempQuestion({
      question: '',
      options: ['', '', ''],
      correct: 0
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Configuración de Trivia</h3>
        <Button onClick={handleAddQuestion} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Pregunta
        </Button>
      </div>

      {/* Lista de preguntas existentes */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Card key={index} className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-sm">
                  Pregunta #{index + 1}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditQuestion(index)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-2">{question.question}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {question.options.map((option, optIndex) => (
                  <span 
                    key={optIndex}
                    className={`p-1 rounded ${
                      optIndex === question.correct 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}) {option}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor de pregunta */}
      {editingIndex !== null && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">
              {editingIndex === -1 ? 'Nueva Pregunta' : `Editando Pregunta #${editingIndex + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Pregunta</Label>
              <Input
                value={tempQuestion.question}
                onChange={(e) => setTempQuestion({ ...tempQuestion, question: e.target.value })}
                placeholder="Escribe la pregunta aquí..."
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tempQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label className="text-white min-w-[60px]">
                    Opción {String.fromCharCode(65 + index)}:
                  </Label>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...tempQuestion.options];
                      newOptions[index] = e.target.value;
                      setTempQuestion({ ...tempQuestion, options: newOptions });
                    }}
                    placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                  />
                  <Button
                    variant={tempQuestion.correct === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTempQuestion({ ...tempQuestion, correct: index })}
                  >
                    {tempQuestion.correct === index ? 'Correcta' : 'Marcar'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveQuestion}>
                Guardar Pregunta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {questions.length === 0 && editingIndex === null && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400 mb-4">No hay preguntas configuradas</p>
            <Button onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Pregunta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
