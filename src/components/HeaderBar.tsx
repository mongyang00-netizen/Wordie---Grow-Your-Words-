import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';
import { WORDIE_IMAGES } from '../assets/images';

interface HeaderBarProps {
  stepText: string; // e.g., "STEP 1/3", "STEP 2/3", "STEP 3/3"
  rightText: string; // e.g., "세트 1/2", "문제 3/10"
  stageImage?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stepText,
  rightText,
  stageImage,
}) => {
  const [soundOn, setSoundOn] = React.useState(sound.isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.setSoundEnabled(next);
  };

  return (
    <header className="w-full flex items-center justify-between px-3 py-2.5 select-none">
      {/* Step pill */}
      <div
        id="header-step-pill"
        className="bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-xs border-b-2 border-emerald-700 flex items-center gap-1"
      >
        <span>🌱</span>
        <span>{stepText}</span>
      </div>

      {/* Wordie Character display */}
      <div
        id="header-wordie-icon"
        className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50/80 border-2 border-amber-300 px-3 py-1 rounded-2xl shadow-xs"
      >
        <img
          src={stageImage || WORDIE_IMAGES.babyEgg}
          alt="Wordie character"
          referrerPolicy="no-referrer"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-amber-300 shadow-xs bg-white shrink-0"
        />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-amber-700 leading-tight">성장 중</span>
          <span className="text-xs font-black text-amber-950 font-['Fredoka'] leading-tight">
            Wordie
          </span>
        </div>
      </div>

      {/* Right pill (matches PDF: "세트 1/2" or "문제 3/10") + audio toggle */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleSound}
          title={soundOn ? '소리 끄기' : '소리 켜기'}
          aria-label={soundOn ? '소리 끄기' : '소리 켜기'}
          className="p-1.5 bg-white text-emerald-700 hover:text-emerald-900 rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors shadow-xs"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
        </button>
        <div
          id="header-counter-pill"
          className="bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full border border-amber-300 shadow-xs whitespace-nowrap"
        >
          {rightText}
        </div>
      </div>
    </header>
  );
};
