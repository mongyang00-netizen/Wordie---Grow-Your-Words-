import { WordItem, Step2Question, Step3Question } from '../types';

export const VOCABULARY_WORDS: WordItem[] = [
  // Set 1 (matches Page 2 of design)
  {
    id: 'apple',
    word: 'apple',
    meaning: '사과',
    sentenceWithBlank: 'I eat a sweet, red ______.',
    fullSentence: 'I eat a sweet, red apple.',
    hint: '빨갛고 달콤한 과일이에요!',
    setIndex: 1,
  },
  {
    id: 'dog',
    word: 'dog',
    meaning: '개',
    sentenceWithBlank: 'A pet ______ barks woof-woof.',
    fullSentence: 'A pet dog barks woof-woof.',
    hint: '"멍멍!" 하고 짖는 동물이에요!',
    setIndex: 1,
  },
  {
    id: 'beautiful',
    word: 'beautiful',
    meaning: '아름다운',
    sentenceWithBlank: 'The colorful rainbow is very ______.',
    fullSentence: 'The colorful rainbow is very beautiful.',
    hint: '알록달록 무지개처럼 아주 고운 모습이에요!',
    setIndex: 1,
  },
  {
    id: 'borrow',
    word: 'borrow',
    meaning: '빌리다',
    sentenceWithBlank: 'Can I ______ your pencil?',
    fullSentence: 'Can I borrow your pencil?',
    hint: '친구가 가진 물건을 잠시 빌려 쓸 때 써요!',
    setIndex: 1,
  },
  {
    id: 'buy',
    word: 'buy',
    meaning: '사다',
    sentenceWithBlank: 'I use money to ______ snacks.',
    fullSentence: 'I use money to buy snacks.',
    hint: '가게에서 돈을 내고 물건을 살 때 쓰는 말이에요!',
    setIndex: 1,
  },

  // Set 2 (completes the 10 words)
  {
    id: 'school',
    word: 'school',
    meaning: '학교',
    sentenceWithBlank: 'We study in our classroom at ______.',
    fullSentence: 'We study in our classroom at school.',
    hint: '선생님과 교실에서 수업을 듣는 배움터예요!',
    setIndex: 2,
  },
  {
    id: 'library',
    word: 'library',
    meaning: '도서관',
    sentenceWithBlank: 'Thousands of books are in the quiet ______.',
    fullSentence: 'Thousands of books are in the quiet library.',
    hint: '쉿! 조용히 책을 읽고 빌리는 곳이에요!',
    setIndex: 2,
  },
  {
    id: 'friend',
    word: 'friend',
    meaning: '친구',
    sentenceWithBlank: 'We play together because you are my ______.',
    fullSentence: 'We play together because you are my friend.',
    hint: '함께 놀고 서로 돕는 소중한 동무예요!',
    setIndex: 2,
  },
  {
    id: 'happy',
    word: 'happy',
    meaning: '행복한',
    sentenceWithBlank: 'I smile when I am ______.',
    fullSentence: 'I smile when I am happy.',
    hint: '신나고 기분이 좋을 때 웃는 마음 상태예요!',
    setIndex: 2,
  },
  {
    id: 'teach',
    word: 'teach',
    meaning: '가르치다',
    sentenceWithBlank: 'Teachers ______ students in class.',
    fullSentence: 'Teachers teach students in class.',
    hint: '선생님이 학생들에게 새로운 것을 알려줄 때 써요!',
    setIndex: 2,
  },
];

// Helper to generate Step 2 questions (bidirectional 10 questions with 6 options each)
export function generateStep2Questions(): Step2Question[] {
  const allEnglish = VOCABULARY_WORDS.map((w) => w.word);
  const allKorean = VOCABULARY_WORDS.map((w) => w.meaning);

  const get6Options = (correct: string, isKorean: boolean): string[] => {
    const pool = isKorean ? allKorean : allEnglish;
    const others = pool.filter((item) => item !== correct);
    // Shuffle others and pick 5
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
    const combined = [correct, ...shuffledOthers];
    // Shuffle combined 6 options
    return combined.sort(() => Math.random() - 0.5);
  };

  const questions: Step2Question[] = [
    {
      id: 'q1',
      prompt: '사과',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[0],
      options: get6Options('apple', false),
      correctOption: 'apple',
    },
    {
      id: 'q2',
      prompt: 'dog',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[1],
      options: get6Options('개', true),
      correctOption: '개',
    },
    {
      id: 'q3',
      prompt: '빌리다',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[3],
      options: get6Options('borrow', false),
      correctOption: 'borrow',
    },
    {
      id: 'q4',
      prompt: 'beautiful',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[2],
      options: get6Options('아름다운', true),
      correctOption: '아름다운',
    },
    {
      id: 'q5',
      prompt: '사다',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[4],
      options: get6Options('buy', false),
      correctOption: 'buy',
    },
    {
      id: 'q6',
      prompt: 'school',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[5],
      options: get6Options('학교', true),
      correctOption: '학교',
    },
    {
      id: 'q7',
      prompt: '도서관',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[6],
      options: get6Options('library', false),
      correctOption: 'library',
    },
    {
      id: 'q8',
      prompt: 'friend',
      promptType: 'EN_TO_KR',
      targetWord: VOCABULARY_WORDS[7],
      options: get6Options('친구', true),
      correctOption: '친구',
    },
    {
      id: 'q9',
      prompt: '행복한',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[8],
      options: get6Options('happy', false),
      correctOption: 'happy',
    },
    {
      id: 'q10',
      prompt: '가르치다',
      promptType: 'KR_TO_EN',
      targetWord: VOCABULARY_WORDS[9],
      options: get6Options('teach', false),
      correctOption: 'teach',
    },
  ];

  return questions;
}

// Helper to generate Step 3 questions (10 context sentence questions with 6 options each)
export function generateStep3Questions(): Step3Question[] {
  const allEnglish = VOCABULARY_WORDS.map((w) => w.word);

  const get6EnglishOptions = (correct: string): string[] => {
    const others = allEnglish.filter((item) => item !== correct);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
    const combined = [correct, ...shuffledOthers];
    return combined.sort(() => Math.random() - 0.5);
  };

  return [
    {
      id: 's1',
      sentence: 'I eat a sweet, red ______.',
      targetWord: VOCABULARY_WORDS[0],
      options: get6EnglishOptions('apple'),
      correctOption: 'apple',
    },
    {
      id: 's2',
      sentence: 'A pet ______ barks woof-woof.',
      targetWord: VOCABULARY_WORDS[1],
      options: get6EnglishOptions('dog'),
      correctOption: 'dog',
    },
    {
      id: 's3',
      sentence: 'We study in our classroom at ______.',
      targetWord: VOCABULARY_WORDS[5],
      options: get6EnglishOptions('school'),
      correctOption: 'school',
    },
    {
      id: 's4',
      sentence: 'The colorful rainbow is very ______.',
      targetWord: VOCABULARY_WORDS[2],
      options: get6EnglishOptions('beautiful'),
      correctOption: 'beautiful',
    },
    {
      id: 's5',
      sentence: 'Can I ______ your pencil?',
      targetWord: VOCABULARY_WORDS[3],
      options: get6EnglishOptions('borrow'),
      correctOption: 'borrow',
    },
    {
      id: 's6',
      sentence: 'I use money to ______ snacks.',
      targetWord: VOCABULARY_WORDS[4],
      options: get6EnglishOptions('buy'),
      correctOption: 'buy',
    },
    {
      id: 's7',
      sentence: 'Thousands of books are in the quiet ______.',
      targetWord: VOCABULARY_WORDS[6],
      options: get6EnglishOptions('library'),
      correctOption: 'library',
    },
    {
      id: 's8',
      sentence: 'We play together because you are my ______.',
      targetWord: VOCABULARY_WORDS[7],
      options: get6EnglishOptions('friend'),
      correctOption: 'friend',
    },
    {
      id: 's9',
      sentence: 'I smile when I am ______.',
      targetWord: VOCABULARY_WORDS[8],
      options: get6EnglishOptions('happy'),
      correctOption: 'happy',
    },
    {
      id: 's10',
      sentence: 'Teachers ______ students in class.',
      targetWord: VOCABULARY_WORDS[9],
      options: get6EnglishOptions('teach'),
      correctOption: 'teach',
    },
  ];
}
