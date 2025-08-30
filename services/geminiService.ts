import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, QuizSettings, Lesson } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: 'The quiz question.'
        },
        options: {
            type: Type.ARRAY,
            description: 'An array of 4 multiple-choice options.',
            items: {
                type: Type.STRING
            }
        },
        answer: {
            type: Type.STRING,
            description: 'The correct answer, which must be one of the provided options.'
        },
        reference: {
            type: Type.STRING,
            description: 'The Bible book, chapter, and verse where the answer can be found (e.g., "John 3:16").'
        }
    },
     required: ['question', 'options', 'answer', 'reference']
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        quiz: {
            type: Type.ARRAY,
            description: 'An array of quiz questions.',
            items: questionSchema
        }
    },
    required: ['quiz']
};

const lessonSchema = {
    type: Type.OBJECT,
    properties: {
        lesson: {
            type: Type.OBJECT,
            properties: {
                title: { 
                    type: Type.STRING,
                    description: "The title of the lesson."
                },
                content: {
                    type: Type.ARRAY,
                    description: "An array of strings, where each string is a paragraph of the lesson.",
                    items: { type: Type.STRING }
                },
                exam: {
                    type: Type.ARRAY,
                    description: "An array of 5 quiz questions based on the lesson content.",
                    items: questionSchema
                }
            },
            required: ['title', 'content', 'exam']
        }
    },
    required: ['lesson']
};


export const generateQuiz = async (settings: QuizSettings): Promise<QuizQuestion[]> => {
  const { topic, difficulty, numQuestions } = settings;

  const prompt = `Generate a Bible quiz with ${numQuestions} questions.
  Topic: ${topic}
  Difficulty: ${difficulty}
  
  Each question must have exactly 4 multiple-choice options.
  One of the options must be the correct answer.
  Provide the Bible reference for each question's answer.
  Return the result as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: quizSchema,
        }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && result.quiz && Array.isArray(result.quiz)) {
        return result.quiz as QuizQuestion[];
    } else {
        console.error("Unexpected JSON structure:", result);
        return [];
    }
  } catch (error) {
    console.error('Error generating quiz with Gemini:', error);
    throw error;
  }
};

export const generateLesson = async (topic: string): Promise<Lesson | null> => {
    const prompt = `Generate a concise Bible lesson on the topic of "${topic}".
    The lesson should include a title and the content broken down into multiple paragraphs (as an array of strings).
    After the lesson, create a 5-question multiple-choice exam based strictly on the lesson's content.
    Each exam question must have exactly 4 options, one correct answer, and a Bible reference.
    Return the entire result as a single JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: lessonSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.lesson) {
            return result.lesson as Lesson;
        } else {
            console.error("Unexpected JSON structure for lesson:", result);
            return null;
        }
    } catch (error) {
        console.error('Error generating lesson with Gemini:', error);
        throw error;
    }
};
