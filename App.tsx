import React, { useState, useCallback, useEffect } from 'react';
import { QuizQuestion, QuizSettings, Lesson } from './types';
import { generateQuiz, generateLesson } from './services/geminiService';
import MainMenu from './components/MainMenu';
import QuizSetup from './components/QuizSetup';
import LessonSetup from './components/LessonSetup';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import QuizResults from './components/QuizResults';
import Spinner from './components/Spinner';
import Header from './components/Header';
import Footer from './components/Footer';

type GameState = 'menu' | 'quiz_setup' | 'lesson_setup' | 'generating' | 'in_lesson' | 'in_quiz' | 'results';
type QuizContext = 'quiz' | 'exam';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [quizContext, setQuizContext] = useState<QuizContext>('quiz');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentSettings, setCurrentSettings] = useState<QuizSettings | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!installPrompt) {
      return;
    }
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setInstallPrompt(null);
  }, [installPrompt]);

  const handleGoToMenu = useCallback(() => {
    setError(null);
    setGameState('menu');
  }, []);

  const handleGenerateQuiz = useCallback(async (settings: QuizSettings) => {
    setGameState('generating');
    setError(null);
    setCurrentSettings(settings);
    setQuizContext('quiz');
    try {
      const questions = await generateQuiz(settings);
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        setUserAnswers(new Array(questions.length).fill(null));
        setGameState('in_quiz');
      } else {
        setError('Failed to generate quiz questions. Please try again.');
        setGameState('quiz_setup');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the quiz. Please try again.');
      setGameState('quiz_setup');
    }
  }, []);
  
  const handleGenerateLesson = useCallback(async (topic: string) => {
      setGameState('generating');
      setError(null);
      try {
          const lesson = await generateLesson(topic);
          if (lesson) {
              setLessonData(lesson);
              setGameState('in_lesson');
          } else {
              setError('Failed to generate the lesson. Please try again.');
              setGameState('lesson_setup');
          }
      } catch (err) {
          console.error(err);
          setError('An error occurred while generating the lesson. Please try again.');
          setGameState('lesson_setup');
      }
  }, []);

  const handleStartExam = useCallback(() => {
    if (lessonData?.exam) {
      setQuizQuestions(lessonData.exam);
      setUserAnswers(new Array(lessonData.exam.length).fill(null));
      setQuizContext('exam');
      setGameState('in_quiz');
    }
  }, [lessonData]);

  const handleQuizComplete = useCallback((answers: string[]) => {
    setUserAnswers(answers);
    setGameState('results');
  }, []);

  const handleRestartQuiz = useCallback(() => {
    if (currentSettings) {
        handleGenerateQuiz(currentSettings);
    } else {
        setGameState('quiz_setup');
    }
  }, [currentSettings, handleGenerateQuiz]);

  const handleRestartExam = useCallback(() => {
    if (lessonData?.exam) {
        setQuizQuestions(lessonData.exam);
        setUserAnswers(new Array(lessonData.exam.length).fill(null));
        setGameState('in_quiz');
    }
  }, [lessonData]);
  
  const handleNewQuiz = useCallback(() => {
      setGameState('quiz_setup');
  }, []);
  
  const handleNewLesson = useCallback(() => {
      setGameState('lesson_setup');
  }, []);


  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu onSelectMode={(mode) => setGameState(mode === 'quiz' ? 'quiz_setup' : 'lesson_setup')} />;
      case 'quiz_setup':
        return <QuizSetup onStartQuiz={handleGenerateQuiz} error={error} onBack={handleGoToMenu} />;
      case 'lesson_setup':
        return <LessonSetup onStartLesson={handleGenerateLesson} error={error} onBack={handleGoToMenu} />;
      case 'generating':
        return <div className="text-center p-8"><Spinner /><p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Generating content...</p></div>;
      case 'in_lesson':
        return lessonData && <LessonView lesson={lessonData} onStartExam={handleStartExam} />;
      case 'in_quiz':
        return <QuizView questions={quizQuestions} onComplete={handleQuizComplete} />;
      case 'results':
        return <QuizResults 
                    questions={quizQuestions} 
                    userAnswers={userAnswers} 
                    context={quizContext}
                    onRestartQuiz={handleRestartQuiz}
                    onRestartExam={handleRestartExam}
                    onNewQuiz={handleNewQuiz}
                    onNewLesson={handleNewLesson}
                />;
      default:
        return <MainMenu onSelectMode={(mode) => setGameState(mode === 'quiz' ? 'quiz_setup' : 'lesson_setup')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 font-sans">
      <Header onInstallClick={handleInstallClick} showInstallButton={!!installPrompt} />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;