
import { useState } from 'react';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionProps {
  id: string;
  text: string;
  options: Option[];
  onAnswer: (isCorrect: boolean) => void;
}

const QuizQuestion = ({ text, options, onAnswer }: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return;
    
    setSelectedOption(optionId);
  };
  
  const handleSubmit = () => {
    if (!selectedOption || hasAnswered) return;
    
    const selectedAnswer = options.find(option => option.id === selectedOption);
    const correct = !!selectedAnswer?.isCorrect;
    
    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
  };
  
  const getOptionClass = (option: Option) => {
    if (!hasAnswered || selectedOption !== option.id) {
      return 'border-gray-700 hover:border-furia-purple';
    }
    
    if (option.isCorrect) {
      return 'border-green-500 bg-green-500/10';
    }
    
    return 'border-red-500 bg-red-500/10';
  };

  return (
    <div className="bg-furia-black/80 backdrop-blur-md rounded-xl p-6 shadow-lg shadow-furia-purple/10 animate-fade-in">
      <h3 className="text-xl font-medium text-white mb-6">{text}</h3>
      
      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={hasAnswered}
            className={`w-full text-left p-4 rounded-lg border transition-all
                      ${selectedOption === option.id ? 'border-furia-purple bg-furia-purple/10' : 'border-gray-700'}
                      ${hasAnswered && selectedOption === option.id ? getOptionClass(option) : ''}
                      ${hasAnswered ? 'cursor-default' : 'hover:border-furia-purple hover:bg-furia-purple/5'}`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 flex items-center justify-center
                            ${selectedOption === option.id ? 'border-furia-purple' : 'border-gray-500'}`}>
                {selectedOption === option.id && (
                  <div className={`w-3 h-3 rounded-full bg-furia-purple`}></div>
                )}
              </div>
              <span className="text-white">{option.text}</span>
            </div>
            
            {hasAnswered && selectedOption === option.id && (
              <div className={`mt-2 text-sm ${option.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {option.isCorrect ? 'Resposta correta!' : 'Resposta incorreta.'}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {!hasAnswered ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-3 rounded-lg font-medium transition-all
                   ${selectedOption 
                     ? 'bg-furia-purple text-white hover:bg-furia-purple/90' 
                     : 'bg-gray-700 text-gray-300 cursor-not-allowed'}`}
        >
          Confirmar Resposta
        </button>
      ) : (
        <div className={`text-center py-3 rounded-lg font-medium
                       ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isCorrect 
            ? 'Correto! Você ganhou pontos.' 
            : 'Incorreto! Tente novamente mais tarde.'}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
