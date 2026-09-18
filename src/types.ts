export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  sentenceWithBlank: string;
  fullSentence: string;
  hint: string;
  setIndex: 1 | 2; // Set 1 (first 5 words) or Set 2 (second 5 words)
}

export type GameStage =
  | 'START'
  | 'STEP1'
  | 'GROWTH1'
  | 'STEP2'
  | 'GROWTH2'
  | 'STEP3'
  | 'RESULT';

export interface Step2Question {
  id: string;
  prompt: string; // The text shown in center card (e.g., "빌리다" or "school")
  promptType: 'KR_TO_EN' | 'EN_TO_KR';
  targetWord: WordItem;
  options: string[]; // 3 options
  correctOption: string;
}

export interface Step3Question {
  id: string;
  sentence: string; // e.g. "I go to ______ every day."
  targetWord: WordItem;
  options: string[]; // 3 English words
  correctOption: string;
}
