import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (answers: string[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(questions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  useEffect(() => {
    // Reset state for new question
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(userAnswers);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = 'skipped';
    setUserAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
    }
    if (option === currentQuestion.answer) {
      // Add a scale transform and shadow to make the correct answer 'pop'
      return 'bg-green-500 text-white transform scale-105 shadow-lg';
    }
    if (option === selectedOption && option !== currentQuestion.answer) {
      return 'bg-red-500 text-white';
    }
    // Fade out the other incorrect options
    return 'bg-white dark:bg-gray-700 opacity-50';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
      </div>
      
      <div className="flex justify-between items-baseline mb-6 text-sm text-gray-600 dark:text-gray-400">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        {isAnswered && <span className="font-semibold text-gray-700 dark:text-gray-200">Reference: {currentQuestion.reference}</span>}
      </div>

      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-500 ease-in-out ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {isAnswered ? (
          <div className="animate-fade-in">
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSkip}
            className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            aria-label="Skip to next question"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;