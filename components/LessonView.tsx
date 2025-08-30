import React from 'react';
import type { Lesson } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  onStartExam: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onStartExam }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 border-b-2 border-indigo-200 dark:border-indigo-800 pb-4">{lesson.title}</h2>
      
      <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 max-h-96 overflow-y-auto pr-4 mb-8">
        {lesson.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
            onClick={onStartExam}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
        >
            Take the Exam
        </button>
      </div>

    </div>
  );
};

export default LessonView;