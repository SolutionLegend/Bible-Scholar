import React from 'react';
import { GenesisIcon, ExodusIcon, LifeOfJesusIcon, PaulsLettersIcon, OldTestamentIcon, NewTestamentIcon, ProphetsIcon, PsalmsIcon, RevelationIcon } from './components/icons';

export const QUIZ_TOPICS = [
  'Genesis',
  'Exodus',
  'Life of Jesus',
  'Paul\'s Letters',
  'Old Testament Overview',
  'New Testament Overview',
  'The Prophets',
  'Psalms & Proverbs',
  'Book of Revelation'
];

export const TOPIC_ICONS: { [key: string]: React.FC<any> } = {
  'Genesis': GenesisIcon,
  'Exodus': ExodusIcon,
  'Life of Jesus': LifeOfJesusIcon,
  'Paul\'s Letters': PaulsLettersIcon,
  'Old Testament Overview': OldTestamentIcon,
  'New Testament Overview': NewTestamentIcon,
  'The Prophets': ProphetsIcon,
  'Psalms & Proverbs': PsalmsIcon,
  'Book of Revelation': RevelationIcon,
};


export const QUIZ_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const NUM_QUESTIONS_OPTIONS = [5, 10, 15, 20];