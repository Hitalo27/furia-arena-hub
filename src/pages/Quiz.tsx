
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuizQuestion, { QuestionProps } from '../components/QuizQuestion';
import { toast } from "sonner";

// Sample questions data (in a real app, this would come from an API)
const sampleQuestions: Omit<QuestionProps, 'onAnswer'>[] = [
  {
    id: '1',
    text: 'Qual jogador foi o primeiro a representar a FURIA no CS:GO?',
    options: [
      { id: '1a', text: 'kscerato', isCorrect: false },
      { id: '1b', text: 'arT', isCorrect: true },
      { id: '1c', text: 'VINI', isCorrect: false }
    ]
  },
  {
    id: '2',
    text: 'Em que ano a FURIA foi fundada?',
    options: [
      { id: '2a', text: '2016', isCorrect: false },
      { id: '2b', text: '2017', isCorrect: true },
      { id: '2c', text: '2018', isCorrect: false }
    ]
  },
  {
    id: '3',
    text: 'Qual destes jogos a FURIA NÃO possui um time competitivo?',
    options: [
      { id: '3a', text: 'Valorant', isCorrect: false },
      { id: '3b', text: 'Free Fire', isCorrect: false },
      { id: '3c', text: 'Dota 2', isCorrect: true }
    ]
  },
  {
    id: '4',
    text: 'Qual o nome do CEO da FURIA?',
    options: [
      { id: '4a', text: 'Jaime Pádua', isCorrect: true },
      { id: '4b', text: 'André Akkari', isCorrect: false },
      { id: '4c', text: 'Cris Guedes', isCorrect: false }
    ]
  }
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { user, isLoggedIn, updatePoints, setInSweepstakes } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < sampleQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeQuiz();
      }
    }, 1500);
  };
  
  const completeQuiz = () => {
    setQuizCompleted(true);
    
    const pointsEarned = correctAnswers * 25;
    
    if (pointsEarned > 0) {
      updatePoints(pointsEarned);
      
      if (correctAnswers >= 3 && user && !user.inSweepstakes) {
        setInSweepstakes(true);
        toast.success("Você agora está participando do sorteio semanal!");
      }
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    
    // In a real app, you might fetch new questions here
  };
  
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-furia-black to-furia-purple-dark/70">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2">
              Quiz FURIA <span className="text-gradient">Fans</span>
            </h1>
            <p className="text-white/70">
              Teste seus conhecimentos e ganhe pontos para trocar por prêmios!
            </p>
          </div>
          
          {!quizCompleted ? (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">
                    Pergunta {currentQuestionIndex + 1} de {sampleQuestions.length}
                  </span>
                  <span className="text-white/70 text-sm">
                    Corretas: {correctAnswers}
                  </span>
                </div>
                <div className="w-full h-2 bg-furia-black/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-furia-purple transition-all" 
                    style={{ width: `${((currentQuestionIndex + 1) / sampleQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <QuizQuestion
                {...currentQuestion}
                onAnswer={handleAnswer}
              />
            </div>
          ) : (
            <div className="bg-furia-black/60 backdrop-blur-md rounded-xl p-6 border border-furia-purple/20 text-center animate-fade-in">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
                Quiz Concluído!
              </h2>
              
              <div className="mb-8">
                <div className="text-5xl font-bold text-gradient mb-2">{correctAnswers}/{sampleQuestions.length}</div>
                <p className="text-white/70">Perguntas respondidas corretamente</p>
                
                <div className="mt-6 p-4 bg-furia-purple/10 rounded-lg border border-furia-purple/20">
                  <p className="text-lg text-white mb-1">Você ganhou {correctAnswers * 25} pontos!</p>
                  {correctAnswers >= 3 && (
                    <p className="text-furia-orange">
                      Parabéns! Você está participando do sorteio semanal!
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={resetQuiz} className="btn-primary">
                  Tentar Novamente
                </button>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
