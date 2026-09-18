import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { HeaderBar } from './HeaderBar';
import { HintModal } from './HintModal';
import { Step2Question } from '../types';
import { generateStep2Questions } from '../data/words';
import { sound } from '../utils/sound';
import { WORDIE_IMAGES } from '../assets/images';

interface Step2ChoiceProps {
  onComplete: () => void;
  onRecordWrong: (wordId: string) => void;
}

export const Step2Choice: React.FC<Step2ChoiceProps> = ({
  onComplete,
  onRecordWrong,
}) => {
  const [questions] = useState<Step2Question[]>(() => generateStep2Questions());
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [showGrowthFeedback, setShowGrowthFeedback] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const currentQ = questions[currentIndex];

  // Auto-speak English prompt when question changes
  React.useEffect(() => {
    if (currentQ.promptType === 'EN_TO_KR') {
      sound.speak(currentQ.prompt);
    }
  }, [currentQ]);

  const handleSelect = (option: string) => {
    if (selectedOption !== null && isCorrectState === true) return; // Already answered correctly

    setSelectedOption(option);

    // Speak English pronunciation on click
    if (currentQ.promptType === 'KR_TO_EN') {
      sound.speak(option);
    } else {
      sound.speak(currentQ.targetWord.word);
    }

    if (option === currentQ.correctOption) {
      // Correct!
      setIsCorrectState(true);
      sound.playCorrect();
      setShowGrowthFeedback(true);

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrectState(null);
          setShowGrowthFeedback(false);
        } else {
          // Finished all 10 questions
          onComplete();
        }
      }, 900);
    } else {
      // Incorrect!
      setIsCorrectState(false);
      sound.playWrong();
      setShakeOption(option);
      onRecordWrong(currentQ.targetWord.id);

      setTimeout(() => {
        setIsHintOpen(true);
        setShakeOption(null);
      }, 400);
    }
  };

  const handleCloseHint = () => {
    setIsHintOpen(false);
    setSelectedOption(null);
    setIsCorrectState(null);
  };

  return (
    <div
      id="step2-screen"
      className="w-full h-full flex flex-col max-w-md mx-auto py-2.5 px-4 select-none relative"
    >
      {/* Top bar */}
      <HeaderBar
        stepText="STEP 2/3"
        rightText={`문제 ${currentIndex + 1}/10`}
        stageImage={WORDIE_IMAGES.stageBaby}
      />

      {/* Guidance text */}
      <div className="text-center mt-2.5 mb-1.5 bg-amber-50/80 border border-amber-200 rounded-2xl py-1.5 px-3 shadow-2xs">
        <p className="text-[10px] font-extrabold text-amber-700 tracking-wider">안내 문구</p>
        <h2 className="text-sm sm:text-base font-extrabold text-amber-950">
          알맞은 단어를 선택하세요.
        </h2>
      </div>

      {/* Growth Feedback banner */}
      <div className="h-6 flex items-center justify-center mb-1">
        <AnimatePresence>
          {showGrowthFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold px-3.5 py-0.5 rounded-full shadow-xs flex items-center gap-1.5"
            >
              <img
                src={WORDIE_IMAGES.stageBaby}
                alt="Wordie Baby"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span>Wordie가 무럭무럭 자라나요! 🌱</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cohesive Quiz Block: Prompt Card + Choices directly beneath */}
      <div className="w-full flex flex-col mt-1">
        {/* Center prompt card */}
        <motion.div
          key={`prompt-${currentQ.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            sound.speak(
              currentQ.promptType === 'EN_TO_KR' ? currentQ.prompt : currentQ.targetWord.word
            );
          }}
          className="w-full min-h-[125px] sm:min-h-[145px] bg-gradient-to-b from-amber-50/90 to-orange-50/50 rounded-3xl flex flex-col items-center justify-center p-4 sm:p-5 shadow-xs relative border-3 border-amber-200 cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-950 font-['Fredoka'] tracking-wide">
              {currentQ.prompt}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.speak(
                  currentQ.promptType === 'EN_TO_KR' ? currentQ.prompt : currentQ.targetWord.word
                );
              }}
              className="p-1.5 sm:p-2 text-amber-600 hover:text-amber-900 bg-white/90 rounded-full shadow-xs border border-amber-200 transition-colors"
              title="발음 듣기"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <span className="text-[11px] sm:text-xs text-amber-800 mt-2 font-bold bg-white/80 px-3 py-0.5 rounded-full border border-amber-200/80">
            {currentQ.promptType === 'KR_TO_EN'
              ? '한국어 뜻에 맞는 영어 단어를 고르세요'
              : '영어 단어에 맞는 한국어 뜻을 고르세요'}
          </span>
        </motion.div>

        {/* Choices row positioned right below prompt card */}
        <div className="mt-3 sm:mt-3.5 w-full">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = isSelected && isCorrectState === true;
              const isShaking = shakeOption === opt;

              return (
                <motion.button
                  key={opt}
                  type="button"
                  id={`choice-${opt}`}
                  onClick={() => {
                    sound.speak(opt);
                    handleSelect(opt);
                  }}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-18 sm:h-22 rounded-2xl flex flex-col items-center justify-center p-2 font-bold text-sm sm:text-base text-center transition-all cursor-pointer shadow-xs ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500 border-b-4 border-emerald-600 font-extrabold ring-2 ring-emerald-200'
                      : isSelected && isCorrectState === false
                      ? 'bg-rose-100 text-rose-900 border-2 border-rose-400 border-b-4 border-rose-500'
                      : 'bg-white text-slate-800 hover:bg-sky-50/70 border-2 border-sky-200 border-b-4 border-sky-300 active:border-b-2 active:translate-y-0.5'
                  }`}
                >
                  <span className="break-keep line-clamp-2 leading-tight font-['Fredoka']">
                    {opt}
                  </span>
                  {isCorrect && <Check className="w-4 h-4 mt-0.5 text-emerald-700 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        word={currentQ.targetWord.word}
        meaning={currentQ.targetWord.meaning}
        hint={currentQ.targetWord.hint}
        onClose={handleCloseHint}
      />
    </div>
  );
};
