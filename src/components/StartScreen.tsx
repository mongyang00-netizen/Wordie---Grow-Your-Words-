import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play } from 'lucide-react';
import { WORDIE_IMAGES } from '../assets/images';
import { sound } from '../utils/sound';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    sound.playPop();
    onStart();
  };

  return (
    <div
      id="start-screen"
      className="w-full h-full min-h-[640px] flex flex-col items-center justify-between py-10 px-6 max-w-md mx-auto text-center select-none"
    >
      {/* Title area (matches PDF Page 1) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-2"
      >
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2 border border-emerald-300">
          <span>🌱 10분 영단어 모험</span>
        </div>
        <h1 className="text-5xl font-black text-emerald-800 tracking-tight font-['Fredoka'] drop-shadow-xs">
          Wordie
        </h1>
        <p className="text-lg font-extrabold text-emerald-600 mt-1 tracking-wide font-['Fredoka']">
          - Grow Your Words! -
        </p>
      </motion.div>

      {/* Baby Wordie in eggshell (matches PDF Page 1) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative my-4"
      >
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200 mx-auto bg-gradient-to-b from-amber-50 to-emerald-50/50 p-2">
          <img
            src={WORDIE_IMAGES.babyEgg}
            alt="Baby Wordie in eggshell"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute -top-3 right-3 bg-amber-100 px-3 py-1.5 rounded-full text-xs font-extrabold text-amber-900 shadow-md border-2 border-amber-300 flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>아기 Wordie</span>
        </motion.div>
      </motion.div>

      {/* Guidance text and Start Button (matches PDF Page 1) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full flex flex-col items-center gap-5 mb-2"
      >
        <div className="w-full bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-4 shadow-xs">
          <p className="text-xs font-bold text-amber-700 mb-1">안내 문구</p>
          <p className="text-base sm:text-lg font-semibold text-gray-700">단어 10개를 배우고</p>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700">Wordie를 성장시켜요! 🌱</p>
        </div>

        <button
          id="game-start-button"
          type="button"
          onClick={handleStart}
          className="w-64 sm:w-72 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xl font-black rounded-2xl shadow-lg border-b-4 border-emerald-700 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
        >
          <span>게임 시작</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </motion.div>
    </div>
  );
};
