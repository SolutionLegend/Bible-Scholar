import React from 'react';

interface MainMenuProps {
  onSelectMode: (mode: 'quiz' | 'lesson') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">How would you like to test your knowledge today?</p>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => onSelectMode('quiz')}
          className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105"
        >
          Take a Quiz
        </button>
        <button
          onClick={() => onSelectMode('lesson')}
          className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105"
        >
          Start a Lesson
        </button>
      </div>
    </div>
  );
};

export default MainMenu;