import React from 'react';
import { Lightbulb, Volume2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/sound';

interface HintModalProps {
  isOpen: boolean;
  word?: string;
  meaning?: string;
  hint: string;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  word,
  meaning,
  hint,
  onClose,
}) => {
  React.useEffect(() => {
    if (isOpen && word) {
      sound.speak(word);
    }
  }, [isOpen, word]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="hint-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          id="hint-modal-card"
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-3 border-amber-300 text-center flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mb-2 text-amber-600 shadow-xs">
            <Lightbulb className="w-7 h-7 fill-amber-300 text-amber-600" />
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-1">
            다시 한번 생각해 볼까요?
          </h3>

          {word && (
            <div
              onClick={() => sound.speak(word)}
              className="my-2 px-4 py-2 bg-sky-50 border-2 border-sky-200 rounded-2xl flex items-center gap-2 cursor-pointer hover:bg-sky-100/70 transition-colors shadow-2xs"
            >
              <span className="font-black text-sky-950 font-['Fredoka'] text-lg">{word}</span>
              {meaning && <span className="text-slate-600 text-sm font-medium">({meaning})</span>}
              <span className="p-1 text-sky-600">
                <Volume2 className="w-4 h-4" />
              </span>
            </div>
          )}

          <div className="w-full bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 my-3 text-sm text-slate-700 leading-relaxed text-left">
            <div className="font-extrabold text-amber-900 mb-1 flex items-center gap-1.5">
              <span>🌱 Wordie의 힌트:</span>
            </div>
            <p className="font-medium text-slate-800">{hint}</p>
          </div>

          <button
            id="hint-retry-button"
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md border-b-4 border-emerald-700 cursor-pointer font-['Fredoka']"
          >
            <span>다시 선택하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
