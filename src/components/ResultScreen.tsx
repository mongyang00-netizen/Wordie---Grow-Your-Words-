import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Volume2, Award, Sparkles } from 'lucide-react';
import { WORDIE_IMAGES } from '../assets/images';
import { VOCABULARY_WORDS } from '../data/words';
import { sound } from '../utils/sound';

interface ResultScreenProps {
  wrongWordIds: string[];
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  wrongWordIds,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    sound.playGrowth();
  }, []);

  const wrongWords = VOCABULARY_WORDS.filter((w) => wrongWordIds.includes(w.id));

  return (
    <div
      id="result-screen"
      className="w-full h-full min-h-[640px] flex flex-col items-center justify-between py-6 px-5 max-w-md mx-auto text-center select-none"
    >
      {/* Title area (matches PDF Page 7) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-2"
      >
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-1 rounded-full mb-1.5 border border-amber-300">
          <span>👑 탐험 완료</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight font-['Fredoka']">
          Wordie 가 다 자랐어요!
        </h1>
        <p className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-1 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>축하합니다! 3단계 학습을 모두 완료했습니다</span>
        </p>
      </motion.div>

      {/* Final Grown Wordie Image (matches PDF Page 7) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 100, delay: 0.2 }}
        className="relative my-3"
      >
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 mx-auto bg-gradient-to-b from-amber-50 to-emerald-50 p-2">
          <img
            src={WORDIE_IMAGES.stageFinal}
            alt="Wordie 가 다 자랐어요"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
          <span className="bg-amber-400 border-2 border-amber-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-900" />
            <span>최종 성장 완성! 🌟</span>
          </span>
        </div>
      </motion.div>

      {/* 틀린 단어 Card (matches PDF Page 7) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full bg-amber-50/90 rounded-2xl p-4 shadow-xs border-2 border-amber-200 text-left my-2"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold text-base text-amber-950 flex items-center gap-1.5">
            <span>📝 복습이 필요한 단어</span>
            <span className="text-xs bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {wrongWords.length}개
            </span>
          </h3>
          <span className="text-[11px] text-amber-700 font-medium">단어를 누르면 발음이 나와요!</span>
        </div>

        {wrongWords.length > 0 ? (
          <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {wrongWords.map((item) => (
              <li
                key={item.id}
                onClick={() => sound.speak(item.word)}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-xl text-slate-800 border border-amber-100 shadow-2xs hover:bg-amber-50/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-black">•</span>
                  <span className="font-black text-base text-slate-900 font-['Fredoka']">{item.word}</span>
                  <span className="text-xs text-gray-500">({item.meaning})</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.speak(item.word);
                  }}
                  className="p-1.5 text-amber-700 hover:text-amber-950 rounded-full hover:bg-amber-100"
                  title="발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
            🎉 대단해요! 한 번도 틀리지 않고 10개 단어를 완벽하게 마스터했어요!
          </div>
        )}
      </motion.div>

      {/* Bottom Buttons: [다시 하기] and [처음으로] (matches PDF Page 7) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-full grid grid-cols-2 gap-3 mt-2 mb-2"
      >
        <button
          id="restart-game-button"
          type="button"
          onClick={() => {
            sound.playPop();
            onRestart();
          }}
          className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 text-base sm:text-lg font-black rounded-2xl shadow-md border-b-4 border-amber-600 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 하기</span>
        </button>

        <button
          id="home-game-button"
          type="button"
          onClick={() => {
            sound.playPop();
            onHome();
          }}
          className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-base sm:text-lg font-black rounded-2xl shadow-md border-b-4 border-emerald-700 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Fredoka']"
        >
          <Home className="w-4 h-4" />
          <span>처음으로</span>
        </button>
      </motion.div>
    </div>
  );
};
