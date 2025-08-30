import React from 'react';
import type { QuizQuestion } from '../types';

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: string[];
  context: 'quiz' | 'exam';
  onRestartQuiz: () => void;
  onRestartExam: () => void;
  onNewQuiz: () => void;
  onNewLesson: () => void;
}

// Icons
const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const CrossIcon = () => (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const SkipIcon = () => (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
);

const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, context, onRestartQuiz, onRestartExam, onNewQuiz, onNewLesson }) => {
  const score = userAnswers.filter((answer, index) => questions[index].answer === answer).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent work! Truly a Bible scholar.";
    if (percentage >= 70) return "Great job! Your knowledge is impressive.";
    if (percentage >= 50) return "Good effort! Keep studying and you'll master it.";
    return "Keep practicing! Every step is progress.";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {context === 'quiz' ? 'Quiz Results' : 'Exam Results'}
      </h2>

      <div className="text-center mb-8">
        <div className={`text-6xl font-bold ${getScoreColor()}`}>{percentage}%</div>
        <div className="text-xl text-gray-700 dark:text-gray-300">
          You answered {score} out of {totalQuestions} questions correctly.
        </div>
         <p className="text-gray-600 dark:text-gray-400 mt-2">{getResultMessage()}</p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.answer;
          const isSkipped = userAnswer === 'skipped';
          
          let statusIcon;
          let userAnswerText;
          let resultColorClass;

          if (isCorrect) {
            statusIcon = <CheckIcon />;
            userAnswerText = `Your answer: ${userAnswer}`;
            resultColorClass = 'border-l-4 border-green-500';
          } else if (isSkipped) {
            statusIcon = <SkipIcon />;
            userAnswerText = 'You skipped this question.';
            resultColorClass = 'border-l-4 border-yellow-500';
          } else {
            statusIcon = <CrossIcon />;
            userAnswerText = userAnswer ? `Your answer: ${userAnswer}` : 'Not answered';
            resultColorClass = 'border-l-4 border-red-500';
          }

          return (
            <div key={index} className={`bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg ${resultColorClass} transition-all duration-300`}>
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2" dangerouslySetInnerHTML={{ __html: question.question }} />
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                {statusIcon}
                <span className="ml-2">{userAnswerText}</span>
              </div>
              {!isCorrect && !isSkipped && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-1">
                  <CheckIcon />
                  <span className="ml-2">Correct answer: {question.answer}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Reference: {question.reference}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {context === 'quiz' ? (
          <>
            <button
              onClick={onRestartQuiz}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onNewQuiz}
              className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              New Quiz
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onRestartExam}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retake Exam
            </button>
            <button
              onClick={onNewLesson}
              className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              New Lesson
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResults;
