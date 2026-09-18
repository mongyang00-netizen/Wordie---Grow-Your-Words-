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

    if (option === currentQ.correctOption) {
      // Correct!
      setIsCorrectState(true);
      sound.playCorrect();
      setShowGrowthFeedback(true);

      // Only if choices were Korean (EN_TO_KR), speak the target word so the child hears the English pronunciation again
      if (currentQ.promptType === 'EN_TO_KR') {
        setTimeout(() => {
          sound.speak(currentQ.targetWord.word);
        }, 350);
      }

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
      }, 1000);
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
      <div className="w-full flex-1 flex flex-col justify-between mt-1">
        {/* Center prompt card */}
        <motion.div
          key={`prompt-${currentQ.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            if (currentQ.promptType === 'EN_TO_KR') {
              sound.speak(currentQ.prompt);
            }
          }}
          className={`w-full min-h-[110px] sm:min-h-[125px] bg-gradient-to-b from-slate-50 to-blue-50/40 rounded-3xl flex flex-col items-center justify-center p-3.5 sm:p-4 shadow-xs relative border-3 border-slate-200 transition-colors shrink-0 ${
            currentQ.promptType === 'EN_TO_KR' ? 'cursor-pointer hover:border-blue-300' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-800 font-['Fredoka'] tracking-wide">
              {currentQ.prompt}
            </span>
            {currentQ.promptType === 'EN_TO_KR' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.speak(currentQ.prompt);
                }}
                className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 bg-white/95 rounded-full shadow-xs border border-slate-200 transition-colors cursor-pointer"
                title="영어 발음 듣기"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <span className="text-[11px] sm:text-xs text-slate-600 mt-1.5 font-bold bg-white/90 px-3 py-0.5 rounded-full border border-slate-200">
            {currentQ.promptType === 'KR_TO_EN'
              ? '한국어 뜻에 맞는 영어 단어를 고르세요'
              : '영어 단어를 듣고 맞는 한국어 뜻을 고르세요'}
          </span>
        </motion.div>

        {/* 6 Choices grid (2 columns x 3 rows) filling bottom space harmoniously */}
        <div className="mt-3 sm:mt-4 w-full flex-1 flex flex-col justify-center pb-2">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = isSelected && isCorrectState === true;
              const isShaking = shakeOption === opt;

              // 6 totally distinct, non-overlapping pastel colors (Sky, Rose, Emerald, Purple, Amber, Teal)
              const colorThemes = [
                'bg-sky-50 text-sky-950 border-sky-200 border-b-sky-300 hover:bg-sky-100 hover:border-sky-400',
                'bg-rose-50 text-rose-950 border-rose-200 border-b-rose-300 hover:bg-rose-100 hover:border-rose-400',
                'bg-emerald-50 text-emerald-950 border-emerald-200 border-b-emerald-300 hover:bg-emerald-100 hover:border-emerald-400',
                'bg-purple-50 text-purple-950 border-purple-200 border-b-purple-300 hover:bg-purple-100 hover:border-purple-400',
                'bg-amber-50 text-amber-950 border-amber-200 border-b-amber-300 hover:bg-amber-100 hover:border-amber-400',
                'bg-teal-50 text-teal-950 border-teal-200 border-b-teal-300 hover:bg-teal-100 hover:border-teal-400',
              ];
              const theme = colorThemes[idx % colorThemes.length];

              return (
                <motion.button
                  key={opt}
                  type="button"
                  id={`choice-${opt}`}
                  onClick={() => {
                    // Only play sound if option is English (when promptType is KR_TO_EN)
                    if (currentQ.promptType === 'KR_TO_EN') {
                      sound.speak(opt);
                    }
                    handleSelect(opt);
                  }}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full min-h-[58px] sm:min-h-[66px] rounded-2xl flex items-center justify-center px-3 py-2 font-bold text-sm sm:text-base text-center transition-all cursor-pointer shadow-xs border-2 border-b-4 relative ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-500 border-b-emerald-600 font-extrabold ring-2 ring-emerald-300'
                      : isSelected && isCorrectState === false
                      ? 'bg-rose-100 text-rose-900 border-rose-400 border-b-rose-500'
                      : theme
                  }`}
                >
                  <span className="break-keep line-clamp-2 leading-snug font-['Fredoka']">
                    {opt}
                  </span>
                  {isCorrect && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        hint={currentQ.targetWord.hint}
        onClose={handleCloseHint}
      />
    </div>
  );
};
