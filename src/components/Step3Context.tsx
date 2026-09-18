import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { HeaderBar } from './HeaderBar';
import { HintModal } from './HintModal';
import { Step3Question } from '../types';
import { generateStep3Questions } from '../data/words';
import { sound } from '../utils/sound';
import { WORDIE_IMAGES } from '../assets/images';

interface Step3ContextProps {
  onComplete: () => void;
  onRecordWrong: (wordId: string) => void;
}

export const Step3Context: React.FC<Step3ContextProps> = ({
  onComplete,
  onRecordWrong,
}) => {
  const [questions] = useState<Step3Question[]>(() => generateStep3Questions());
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [showGrowthFeedback, setShowGrowthFeedback] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (selectedOption !== null && isCorrectState === true) return;

    setSelectedOption(option);
    // Pronounce the clicked word immediately!
    sound.speak(option);

    if (option === currentQ.correctOption) {
      // Correct!
      setIsCorrectState(true);
      sound.playCorrect();
      setShowGrowthFeedback(true);

      // Short delay then speak full sentence
      setTimeout(() => {
        sound.speak(currentQ.targetWord.fullSentence);
      }, 400);

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
      }, 1200);
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

  // Render sentence with blank or filled word
  const renderSentence = () => {
    const parts = currentQ.sentence.split('______');
    return (
      <div className="text-xl sm:text-2xl font-black text-slate-800 text-center leading-relaxed tracking-wide font-['Fredoka']">
        <span>{parts[0]}</span>
        {isCorrectState === true ? (
          <span className="text-emerald-800 font-black underline decoration-emerald-500 decoration-3 mx-1 bg-emerald-100/90 px-3 py-1 rounded-xl shadow-xs">
            {currentQ.correctOption}
          </span>
        ) : (
          <span className="inline-block bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400 px-3 py-0.5 rounded-xl min-w-[70px] text-center mx-1 font-sans text-sm font-extrabold shadow-2xs">
            ? 빈칸
          </span>
        )}
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div
      id="step3-screen"
      className="w-full h-full flex flex-col max-w-md mx-auto py-2.5 px-4 select-none relative"
    >
      {/* Top bar */}
      <HeaderBar
        stepText="STEP 3/3"
        rightText={`문제 ${currentIndex + 1}/10`}
        stageImage={WORDIE_IMAGES.stageChild}
      />

      {/* Guidance text */}
      <div className="text-center mt-2.5 mb-1.5 bg-sky-50/80 border border-sky-200/90 rounded-2xl py-1.5 px-3 shadow-2xs">
        <p className="text-[10px] font-extrabold text-sky-700 tracking-wider">안내 문구</p>
        <h2 className="text-sm sm:text-base font-extrabold text-sky-950">
          문맥에 알맞은 단어를 선택하세요.
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
                src={WORDIE_IMAGES.stageChild}
                alt="Wordie Child Explorer"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
              <span>Wordie가 무럭무럭 자라나요! 🌿</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cohesive Quiz Block: Sentence Card + Choices directly beneath */}
      <div className="w-full flex flex-col mt-1">
        {/* Center Sentence card */}
        <motion.div
          key={`sentence-${currentQ.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full min-h-[135px] sm:min-h-[155px] bg-gradient-to-b from-sky-50/90 to-emerald-50/50 rounded-3xl flex flex-col items-center justify-center p-4 sm:p-5 shadow-xs relative border-3 border-sky-200"
        >
          {renderSentence()}

          <button
            type="button"
            onClick={() => sound.speak(currentQ.targetWord.fullSentence)}
            className="mt-3 flex items-center gap-1.5 text-xs text-sky-800 hover:text-sky-950 bg-white/90 px-3 py-1 rounded-full border border-sky-300 shadow-xs transition-colors font-bold cursor-pointer"
            title="문장 발음 듣기"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>문장 듣기</span>
          </button>
        </motion.div>

        {/* Choices row positioned right below sentence card */}
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
                  className={`w-full h-18 sm:h-22 rounded-2xl flex flex-col items-center justify-center p-2 font-bold text-base sm:text-lg text-center transition-all cursor-pointer shadow-xs ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 border-b-4 border-emerald-600 font-extrabold ring-2 ring-emerald-200'
                      : isSelected && isCorrectState === false
                      ? 'bg-rose-100 text-rose-900 border-2 border-rose-400 border-b-4 border-rose-500'
                      : 'bg-white text-slate-800 hover:bg-emerald-50/70 border-2 border-emerald-200 border-b-4 border-emerald-300 active:border-b-2 active:translate-y-0.5'
                  }`}
                >
                  <span className="truncate font-['Fredoka']">{opt}</span>
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
