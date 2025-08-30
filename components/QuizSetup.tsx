import React, { useState } from 'react';
import { QUIZ_TOPICS, QUIZ_DIFFICULTIES, NUM_QUESTIONS_OPTIONS, TOPIC_ICONS } from '../constants';
import type { QuizSettings } from '../types';
import { BackArrowIcon } from './icons';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
  error: string | null;
  onBack: () => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, error, onBack }) => {
  const [topic, setTopic] = useState<string>(QUIZ_TOPICS[0]);
  const [difficulty, setDifficulty] = useState<string>(QUIZ_DIFFICULTIES[1]);
  const [numQuestions, setNumQuestions] = useState<number>(NUM_QUESTIONS_OPTIONS[1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({ topic, difficulty, numQuestions });
  };

  const OptionCard: React.FC<{ value: string; selectedValue: string; onClick: (value: string) => void; children: React.ReactNode }> = ({ value, selectedValue, onClick, children }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800
        ${selectedValue === value 
            ? 'bg-indigo-600 text-white shadow-lg' 
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
            <BackArrowIcon className="w-6 h-6" />
        </button>
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Your Quiz</h2>
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Topic</label>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUIZ_TOPICS.map(t => {
                const Icon = TOPIC_ICONS[t];
                return (
                     <button
                        type="button"
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 flex flex-col items-center justify-center gap-2
                        ${topic === t 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        {Icon && <Icon className="w-6 h-6" />}
                        <span>{t}</span>
                    </button>
                )
            })}
           </div>
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Questions</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {NUM_QUESTIONS_OPTIONS.map(num => (
              <OptionCard key={num} value={String(num)} selectedValue={String(numQuestions)} onClick={(val) => setNumQuestions(Number(val))}>
                {num} Questions
              </OptionCard>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {QUIZ_DIFFICULTIES.map(d => (
              <OptionCard key={d} value={d} selectedValue={difficulty} onClick={setDifficulty}>
                {d}
              </OptionCard>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;