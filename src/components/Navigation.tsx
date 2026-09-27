import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeWorkoutRunning?: boolean;
  onOpenActiveWorkout?: () => void;
  elapsedSeconds?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  activeWorkoutRunning,
  onOpenActiveWorkout,
  elapsedSeconds = 0,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {activeWorkoutRunning && (
        <div className="fixed bottom-18 left-0 right-0 z-30 px-4 max-w-md mx-auto pointer-events-none">
          <button
            onClick={onOpenActiveWorkout}
            className="w-full pointer-events-auto h-11 px-3.5 bg-[#1b1b1d] border border-[#34d399]/40 rounded-xl shadow-xl flex items-center justify-between active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5af0b3] animate-pulse"></span>
              <span className="text-[13px] font-semibold text-[#e5e1e4]">
                Workout in Progress
              </span>
              <span className="text-[12px] text-[#bbcac0] font-mono">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-semibold text-[#5af0b3]">
              <span>Resume</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </div>
          </button>
        </div>
      )}

      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0e0e10]/95 backdrop-blur-xl border-t border-[#202024] shadow-[0_-1px_12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
          {/* LOG TAB */}
          <button
            onClick={() => onSelectTab('log')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors gap-0.5 ${
              currentTab === 'log'
                ? 'text-[#5af0b3] font-semibold'
                : 'text-[#bbcac0] hover:text-[#e5e1e4]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">fitness_center</span>
            <span className="text-[11px] uppercase tracking-wider">Log</span>
          </button>

          {/* HISTORY TAB */}
          <button
            onClick={() => onSelectTab('history')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors gap-0.5 ${
              currentTab === 'history'
                ? 'text-[#5af0b3] font-semibold'
                : 'text-[#bbcac0] hover:text-[#e5e1e4]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            <span className="text-[11px] uppercase tracking-wider">History</span>
          </button>

          {/* FOOD TAB */}
          <button
            onClick={() => onSelectTab('food')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors gap-0.5 ${
              currentTab === 'food'
                ? 'text-[#5af0b3] font-semibold'
                : 'text-[#bbcac0] hover:text-[#e5e1e4]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">restaurant</span>
            <span className="text-[11px] uppercase tracking-wider">Food</span>
          </button>

          {/* EXERCISES TAB */}
          <button
            onClick={() => onSelectTab('exercises')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors gap-0.5 ${
              currentTab === 'exercises'
                ? 'text-[#5af0b3] font-semibold'
                : 'text-[#bbcac0] hover:text-[#e5e1e4]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">list_alt</span>
            <span className="text-[11px] uppercase tracking-wider">Exercises</span>
          </button>
        </div>
      </nav>
    </>
  );
};
