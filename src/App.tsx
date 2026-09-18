import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameStage } from './types';
import { StartScreen } from './components/StartScreen';
import { Step1Matching } from './components/Step1Matching';
import { GrowthScreen } from './components/GrowthScreen';
import { Step2Choice } from './components/Step2Choice';
import { Step3Context } from './components/Step3Context';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [stage, setStage] = useState<GameStage>('START');
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);

  const handleRecordWrong = (wordId: string) => {
    setWrongWordIds((prev) => (prev.includes(wordId) ? prev : [...prev, wordId]));
  };

  const handleStartGame = () => {
    setWrongWordIds([]);
    setStage('STEP1');
  };

  const handleRestart = () => {
    setWrongWordIds([]);
    setStage('STEP1');
  };

  const handleHome = () => {
    setWrongWordIds([]);
    setStage('START');
  };

  return (
    <main
      id="app-root"
      className="min-h-screen w-full bg-gradient-to-br from-amber-50/80 via-emerald-50/40 to-teal-50/60 flex items-center justify-center p-0 sm:p-4 text-slate-900 font-['Noto_Sans_KR',sans-serif]"
    >
      {/* Smartphone / Tablet Portrait Container */}
      <div
        id="phone-frame"
        className="w-full max-w-md min-h-[100dvh] sm:min-h-[720px] sm:max-h-[880px] sm:h-[840px] bg-white sm:rounded-[32px] sm:shadow-2xl sm:border-4 sm:border-emerald-100/80 flex flex-col overflow-y-auto overflow-x-hidden relative"
      >
        <AnimatePresence mode="wait">
          {stage === 'START' && (
            <motion.div
              key="stage-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <StartScreen onStart={handleStartGame} />
            </motion.div>
          )}

          {stage === 'STEP1' && (
            <motion.div
              key="stage-step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <Step1Matching
                onComplete={() => setStage('GROWTH1')}
                onRecordWrong={handleRecordWrong}
              />
            </motion.div>
          )}

          {stage === 'GROWTH1' && (
            <motion.div
              key="stage-growth1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <GrowthScreen
                growthStage={1}
                onNextStep={() => setStage('STEP2')}
              />
            </motion.div>
          )}

          {stage === 'STEP2' && (
            <motion.div
              key="stage-step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <Step2Choice
                onComplete={() => setStage('GROWTH2')}
                onRecordWrong={handleRecordWrong}
              />
            </motion.div>
          )}

          {stage === 'GROWTH2' && (
            <motion.div
              key="stage-growth2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <GrowthScreen
                growthStage={2}
                onNextStep={() => setStage('STEP3')}
              />
            </motion.div>
          )}

          {stage === 'STEP3' && (
            <motion.div
              key="stage-step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <Step3Context
                onComplete={() => setStage('RESULT')}
                onRecordWrong={handleRecordWrong}
              />
            </motion.div>
          )}

          {stage === 'RESULT' && (
            <motion.div
              key="stage-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <ResultScreen
                wrongWordIds={wrongWordIds}
                onRestart={handleRestart}
                onHome={handleHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
