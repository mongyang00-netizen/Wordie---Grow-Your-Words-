import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Volume2, Sparkles } from 'lucide-react';
import { HeaderBar } from './HeaderBar';
import { HintModal } from './HintModal';
import { WordItem } from '../types';
import { VOCABULARY_WORDS } from '../data/words';
import { sound } from '../utils/sound';
import { WORDIE_IMAGES } from '../assets/images';

interface Step1MatchingProps {
  onComplete: () => void;
  onRecordWrong: (wordId: string) => void;
}

export const Step1Matching: React.FC<Step1MatchingProps> = ({
  onComplete,
  onRecordWrong,
}) => {
  const [currentSetIndex, setCurrentSetIndex] = useState<1 | 2>(1);
  const [currentWords, setCurrentWords] = useState<WordItem[]>([]);
  const [shuffledKorean, setShuffledKorean] = useState<WordItem[]>([]);

  // Selection states
  const [selectedEnglishId, setSelectedEnglishId] = useState<string | null>(null);
  const [selectedKoreanId, setSelectedKoreanId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  // Feedback states
  const [growthFeedback, setGrowthFeedback] = useState<string | null>(null);
  const [hintWord, setHintWord] = useState<WordItem | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Setup current set
  useEffect(() => {
    const words = VOCABULARY_WORDS.filter((w) => w.setIndex === currentSetIndex);
    setCurrentWords(words);

    // If set 1, keep the exact order shown on PDF Page 2 for high fidelity!
    // Page 2 right column: 아름다운 (beautiful), 사과 (apple), 개 (dog), 빌리다 (borrow), 사다 (buy)
    if (currentSetIndex === 1) {
      const order = ['beautiful', 'apple', 'dog', 'borrow', 'buy'];
      const sorted = [...words].sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
      );
      setShuffledKorean(sorted);
    } else {
      // Set 2 shuffled
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledKorean(shuffled);
    }

    // Reset matching for this set
    setSelectedEnglishId(null);
    setSelectedKoreanId(null);
    setMatchedIds([]);
  }, [currentSetIndex]);

  // Handle matching check when both are selected
  useEffect(() => {
    if (!selectedEnglishId || !selectedKoreanId) return;

    if (selectedEnglishId === selectedKoreanId) {
      // Correct Match!
      sound.playCorrect();
      setMatchedIds((prev) => [...prev, selectedEnglishId]);
      setGrowthFeedback('Wordie가 성장하고 있어요! 🌱');

      setSelectedEnglishId(null);
      setSelectedKoreanId(null);

      const timer = setTimeout(() => {
        setGrowthFeedback(null);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Incorrect Match!
      sound.playWrong();
      setShakeId(selectedKoreanId);
      onRecordWrong(selectedEnglishId);

      // Trigger hint for the chosen English word
      const target = currentWords.find((w) => w.id === selectedEnglishId);
      if (target) {
        setTimeout(() => {
          setHintWord(target);
        }, 300);
      }

      const resetTimer = setTimeout(() => {
        setSelectedEnglishId(null);
        setSelectedKoreanId(null);
        setShakeId(null);
      }, 500);

      return () => clearTimeout(resetTimer);
    }
  }, [selectedEnglishId, selectedKoreanId, currentWords, onRecordWrong]);

  // Check if set is finished
  useEffect(() => {
    if (currentWords.length > 0 && matchedIds.length === currentWords.length) {
      const timer = setTimeout(() => {
        if (currentSetIndex === 1) {
          // Advance to Set 2
          sound.playGrowth();
          setCurrentSetIndex(2);
        } else {
          // Completed both sets (10 words total)
          onComplete();
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [matchedIds, currentWords, currentSetIndex, onComplete]);

  const handleSelectEnglish = (wordItem: WordItem) => {
    if (matchedIds.includes(wordItem.id)) return;
    sound.playPop();
    sound.speak(wordItem.word);
    setSelectedEnglishId(wordItem.id);
  };

  const handleSelectKorean = (wordItem: WordItem) => {
    if (matchedIds.includes(wordItem.id)) return;
    sound.playPop();
    // Do not speak English when clicking Korean card to prevent duplicate/delayed sound
    setSelectedKoreanId(wordItem.id);
  };

  return (
    <div
      id="step1-screen"
      className="w-full h-full min-h-[640px] flex flex-col justify-between max-w-md mx-auto py-3 px-4 select-none relative"
    >
      <div>
        {/* Top bar (matches PDF Page 2) */}
        <HeaderBar
          stepText="STEP 1/3"
          rightText={`세트 ${currentSetIndex}/2`}
          stageImage={WORDIE_IMAGES.babyEgg}
        />

        {/* Guidance text (matches PDF Page 2) */}
        <div className="text-center mt-3 mb-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl py-2 px-3 shadow-xs">
          <p className="text-[11px] font-extrabold text-emerald-700 tracking-wider">안내 문구</p>
          <h2 className="text-base sm:text-lg font-extrabold text-emerald-950">
            영어 단어와 뜻을 차례로 선택하세요!
          </h2>
        </div>

        {/* Instant Feedback Toast */}
        <div className="h-7 flex items-center justify-center mb-1">
          <AnimatePresence>
            {growthFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <img
                    src={WORDIE_IMAGES.babyEgg}
                    alt="Wordie"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                  />
                  <span>{growthFeedback}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2-Column Cards Grid (matches PDF Page 2) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-1">
          {/* Left Column: English Words */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="text-center text-xs font-bold text-sky-800 bg-sky-100/60 py-1 rounded-lg border border-sky-200">
              English 단어
            </div>
            {currentWords.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedEnglishId === item.id;

              return (
                <motion.button
                  key={`en-${item.id}`}
                  type="button"
                  id={`card-en-${item.id}`}
                  onClick={() => {
                    if (isMatched) {
                      sound.speak(item.word);
                      return;
                    }
                    handleSelectEnglish(item);
                  }}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  className={`relative w-full h-13 sm:h-14 rounded-xl flex items-center justify-center px-2 font-bold text-base sm:text-lg transition-all cursor-pointer shadow-xs ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-90'
                      : isSelected
                      ? 'bg-sky-100 text-sky-950 border-2 border-sky-500 shadow-md ring-3 ring-sky-200 border-b-4'
                      : 'bg-white text-slate-800 hover:bg-sky-50/70 border-2 border-sky-200/90 border-b-4 border-sky-300'
                  }`}
                >
                  <span className="truncate tracking-wide font-['Fredoka']">{item.word}</span>
                  {isMatched ? (
                    <span className="absolute right-2 text-emerald-600 bg-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="absolute left-2.5 text-sky-400 opacity-70 group-hover:opacity-100">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Korean Meanings */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="text-center text-xs font-bold text-amber-800 bg-amber-100/60 py-1 rounded-lg border border-amber-200">
              한국어 뜻
            </div>
            {shuffledKorean.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedKoreanId === item.id;
              const isShaking = shakeId === item.id;

              return (
                <motion.button
                  key={`kr-${item.id}`}
                  type="button"
                  id={`card-kr-${item.id}`}
                  onClick={() => handleSelectKorean(item)}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  className={`relative w-full h-13 sm:h-14 rounded-xl flex items-center justify-center px-2 font-bold text-base sm:text-lg transition-all cursor-pointer shadow-xs ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 opacity-90'
                      : isSelected
                      ? 'bg-amber-100 text-amber-950 border-2 border-amber-500 shadow-md ring-3 ring-amber-200 border-b-4'
                      : 'bg-white text-slate-800 hover:bg-amber-50/70 border-2 border-amber-200/90 border-b-4 border-amber-300'
                  }`}
                >
                  <span className="truncate">{item.meaning}</span>
                  {isMatched && (
                    <span className="absolute right-2 text-emerald-600 bg-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress note */}
      <div className="text-center py-2.5 text-xs text-emerald-800 font-bold bg-emerald-50 rounded-xl border border-emerald-200/70 my-2">
        ✨ 완료된 단어쌍: {matchedIds.length + (currentSetIndex === 2 ? 5 : 0)} / 10
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={Boolean(hintWord)}
        hint={hintWord?.hint || ''}
        onClose={() => setHintWord(null)}
      />
    </div>
  );
};
