export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  reference: string;
}

export interface QuizSettings {
  topic: string;
  difficulty: string;
  numQuestions: number;
}

export interface Lesson {
    title: string;
    content: string[];
    exam: QuizQuestion[];
}
