import { WordItem, Step2Question, Step3Question } from '../types';

export const VOCABULARY_WORDS: WordItem[] = [
  // Set 1 (matches Page 2 of design)
  {
    id: 'apple',
    word: 'apple',
    meaning: '사과',
    sentenceWithBlank: 'I eat a fresh ______ for breakfast.',
    fullSentence: 'I eat a fresh apple for breakfast.',
    hint: '빨갛고 아삭아삭 맛있는 과일이에요!',
    setIndex: 1,
  },
  {
    id: 'dog',
    word: 'dog',
    meaning: '개',
    sentenceWithBlank: 'My ______ wags its tail when I come home.',
    fullSentence: 'My dog wags its tail when I come home.',
    hint: '사람과 친하고 멍멍 짖는 동물이에요!',
    setIndex: 1,
  },
  {
    id: 'beautiful',
    word: 'beautiful',
    meaning: '아름다운',
    sentenceWithBlank: 'Look at the ______ flowers in the garden.',
    fullSentence: 'Look at the beautiful flowers in the garden.',
    hint: '보기에 정말 예쁘고 멋진 모습을 뜻해요!',
    setIndex: 1,
  },
  {
    id: 'borrow',
    word: 'borrow',
    meaning: '빌리다',
    sentenceWithBlank: 'Can I ______ your pencil for a minute?',
    fullSentence: 'Can I borrow your pencil for a minute?',
    hint: '다른 사람의 물건을 잠시 쓰고 돌려주기로 할 때 써요!',
    setIndex: 1,
  },
  {
    id: 'buy',
    word: 'buy',
    meaning: '사다',
    sentenceWithBlank: 'I want to ______ a new notebook at the stationery store.',
    fullSentence: 'I want to buy a new notebook at the stationery store.',
    hint: '돈을 내고 물건을 내 것으로 만들 때 쓰는 말이에요!',
    setIndex: 1,
  },

  // Set 2 (completes the 10 words)
  {
    id: 'school',
    word: 'school',
    meaning: '학교',
    sentenceWithBlank: 'I go to ______ every day.',
    fullSentence: 'I go to school every day.',
    hint: '선생님과 친구들과 함께 공부하러 가는 곳이에요!',
    setIndex: 2,
  },
  {
    id: 'library',
    word: 'library',
    meaning: '도서관',
    sentenceWithBlank: 'We read many interesting books in the ______.',
    fullSentence: 'We read many interesting books in the library.',
    hint: '조용히 많은 책을 읽거나 빌려갈 수 있는 곳이에요!',
    setIndex: 2,
  },
  {
    id: 'friend',
    word: 'friend',
    meaning: '친구',
    sentenceWithBlank: 'My best ______ helps me whenever I need support.',
    fullSentence: 'My best friend helps me whenever I need support.',
    hint: '서로 아끼고 사이좋게 지내는 단짝 동무예요!',
    setIndex: 2,
  },
  {
    id: 'happy',
    word: 'happy',
    meaning: '행복한',
    sentenceWithBlank: 'She smiled with a very ______ face.',
    fullSentence: 'She smiled with a very happy face.',
    hint: '마음이 기쁘고 즐거운 상태를 나타내는 단어예요!',
    setIndex: 2,
  },
  {
    id: 'teach',
    word: 'teach',
    meaning: '가르치다',
    sentenceWithBlank: 'Our teacher likes to ______ us English songs.',
    fullSentence: 'Our teacher likes to teach us English songs.',
    hint: '지식이나 방법을 다른 사람에게 알게 해 주는 행동이에요!',
    setIndex: 2,
  },
];

// Helper to generate Step 2 questions (bidirectional 10 questions)
export function generateStep2Questions(): Step2Question[] {
  // Let's create 10 questions covering all 10 words:
  // Some Korean -> English (e.g. Page 3: "빌리다" -> beautiful, borrow, buy)
  // Some English -> Korean (e.g. "school" -> 도서관, 학교, 친구)
  const questions: Step2Question[] = [
    {
      id: 'q1',
      prompt: '사과',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[0],
      options: ['apple', 'borrow', 'school'],
      correctOption: 'apple',
    },
    {
      id: 'q2',
      prompt: 'dog',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[1],
      options: ['개', '학교', '아름다운'],
      correctOption: '개',
    },
    {
      id: 'q3',
      prompt: '빌리다', // Exactly matches Page 3 screenshot!
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[3],
      options: ['beautiful', 'borrow', 'buy'],
      correctOption: 'borrow',
    },
    {
      id: 'q4',
      prompt: 'beautiful',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[2],
      options: ['사다', '아름다운', '빌리다'],
      correctOption: '아름다운',
    },
    {
      id: 'q5',
      prompt: '사다',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[4],
      options: ['borrow', 'buy', 'teach'],
      correctOption: 'buy',
    },
    {
      id: 'q6',
      prompt: 'school',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[5],
      options: ['학교', '도서관', '친구'],
      correctOption: '학교',
    },
    {
      id: 'q7',
      prompt: '도서관',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[6],
      options: ['friend', 'school', 'library'],
      correctOption: 'library',
    },
    {
      id: 'q8',
      prompt: 'friend',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[7],
      options: ['행복한', '친구', '가르치다'],
      correctOption: '친구',
    },
    {
      id: 'q9',
      prompt: '행복한',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[8],
      options: ['happy', 'beautiful', 'apple'],
      correctOption: 'happy',
    },
    {
      id: 'q10',
      prompt: '가르치다',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[9],
      options: ['buy', 'borrow', 'teach'],
      correctOption: 'teach',
    },
  ];

  return questions;
}

// Helper to generate Step 3 questions (10 context sentence questions)
export function generateStep3Questions(): Step3Question[] {
  return [
    {
      id: 's1',
      sentence: 'I eat an ______ every morning.',
      targetWord: VOCABULARY_WORDS[0],
      options: ['apple', 'dog', 'school'],
      correctOption: 'apple',
    },
    {
      id: 's2',
      sentence: 'My ______ barks happily when I return home.',
      targetWord: VOCABULARY_WORDS[1],
      options: ['library', 'dog', 'borrow'],
      correctOption: 'dog',
    },
    {
      id: 's3',
      sentence: 'I go to ______ every day.', // Exactly matches Page 4 screenshot!
      targetWord: VOCABULARY_WORDS[5],
      options: ['school', 'apple', 'buy'],
      correctOption: 'school',
    },
    {
      id: 's4',
      sentence: 'The sunset over the beach is so ______.',
      targetWord: VOCABULARY_WORDS[2],
      options: ['happy', 'beautiful', 'friend'],
      correctOption: 'beautiful',
    },
    {
      id: 's5',
      sentence: 'Can I ______ your pencil for a minute?',
      targetWord: VOCABULARY_WORDS[3],
      options: ['borrow', 'buy', 'teach'],
      correctOption: 'borrow',
    },
    {
      id: 's6',
      sentence: 'I want to ______ a new pencil case at the shop.',
      targetWord: VOCABULARY_WORDS[4],
      options: ['dog', 'buy', 'school'],
      correctOption: 'buy',
    },
    {
      id: 's7',
      sentence: 'We borrow interesting books from the ______.',
      targetWord: VOCABULARY_WORDS[6],
      options: ['library', 'friend', 'apple'],
      correctOption: 'library',
    },
    {
      id: 's8',
      sentence: 'She is my best ______ in our classroom.',
      targetWord: VOCABULARY_WORDS[7],
      options: ['teach', 'friend', 'beautiful'],
      correctOption: 'friend',
    },
    {
      id: 's9',
      sentence: 'I am so ______ because tomorrow is my birthday!',
      targetWord: VOCABULARY_WORDS[8],
      options: ['happy', 'borrow', 'school'],
      correctOption: 'happy',
    },
    {
      id: 's10',
      sentence: 'Teachers ______ students many fun things.',
      targetWord: VOCABULARY_WORDS[9],
      options: ['buy', 'teach', 'dog'],
      correctOption: 'teach',
    },
  ];
}
