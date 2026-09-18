import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WORDIE_IMAGES } from '../assets/images';
import { sound } from '../utils/sound';

interface GrowthScreenProps {
  growthStage: 1 | 2;
  onNextStep: () => void;
}

export const GrowthScreen: React.FC<GrowthScreenProps> = ({
  growthStage,
  onNextStep,
}) => {
  useEffect(() => {
    sound.playGrowth();
  }, [growthStage]);

  const title =
    growthStage === 1 ? 'Wordie 가 성장했어요!' : 'Wordie 가 또 성장했어요!';
  const subtitle =
    growthStage === 1 ? '-Step 1 완료-' : '-Step 2 완료-';
  const image =
    growthStage === 1 ? WORDIE_IMAGES.stageBaby : WORDIE_IMAGES.stageChild;
  const stageBadge =
    growthStage === 1 ? '1차 성장 (아기 Wordie)' : '2차 성장 (모험가 Wordie)';

  const handleNext = () => {
    sound.playPop();
    onNextStep();
  };

  return (
    <div
      id={`growth-screen-step-${growthStage}`}
      className="w-full h-full min-h-[640px] flex flex-col items-center justify-between py-10 px-6 max-w-md mx-auto text-center select-none"
    >
      {/* Title area (matches PDF Pages 5 & 6) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-2"
      >
        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full mb-2 border border-amber-300">
          <span>✨ 축하해요!</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight font-['Fredoka']">
          {title}
        </h1>
        <p className="text-lg sm:text-xl font-extrabold text-emerald-600 mt-1 font-['Fredoka']">
          {subtitle}
        </p>
      </motion.div>

      {/* Grown Wordie Image (matches PDF Pages 5 & 6) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 100, delay: 0.2 }}
        className="relative my-4"
      >
        <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200 mx-auto bg-gradient-to-b from-amber-50 to-emerald-50 p-2">
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute -top-3 right-6 bg-amber-100 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-900 shadow-md border-2 border-amber-300 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{stageBadge}</span>
        </motion.div>
      </motion.div>

      {/* Button: 다음 STEP (matches PDF Pages 5 & 6) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-full flex justify-center mb-4"
      >
        <button
          id="growth-next-step-button"
          type="button"
          onClick={handleNext}
          className="w-64 sm:w-72 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xl font-black rounded-2xl shadow-lg border-b-4 border-emerald-700 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
        >
          <span>다음 STEP</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
