import React from 'react';
import { TabType, ScreenView } from '../types';

interface HeaderProps {
  currentTab: TabType;
  screenView: ScreenView;
  onNavigateTab: (tab: TabType) => void;
  onNavigateScreen: (screen: ScreenView) => void;
  onBack?: () => void;
  onOpenProfile: () => void;
  onOpenPlateCalc?: () => void;
  activeWorkoutRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  screenView,
  onNavigateTab,
  onNavigateScreen,
  onBack,
  onOpenProfile,
  onOpenPlateCalc,
  activeWorkoutRunning,
}) => {
  // If we are in a sub-screen like active-workout, barcode-scanner, etc.
  if (screenView.type === 'active-workout') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#131315]/90 backdrop-blur-xl border-b border-[#202024] shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Back to dashboard"
              onClick={onBack}
              className="w-10 h-10 -ml-2 rounded-lg flex items-center justify-center text-[#e5e1e4] active:bg-[#201f21] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-semibold text-[17px] text-[#e5e1e4] tracking-tight uppercase">
              ACTIVE WORKOUT
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPlateCalc && (
              <button
                aria-label="Plate Calculator"
                onClick={onOpenPlateCalc}
                className="w-9 h-9 rounded-lg bg-[#201f21] text-[#5af0b3] hover:bg-[#2a2a2c] flex items-center justify-center transition-colors"
                title="Plate Calculator"
              >
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
              </button>
            )}
            <button
              aria-label="User Profile"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-[#5af0b3] flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[#003825] text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (screenView.type === 'barcode-scanner') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#131315]/90 backdrop-blur-xl border-b border-[#202024] shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 -ml-2 rounded-lg flex items-center justify-center text-[#e5e1e4] active:bg-[#201f21] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-semibold text-[17px] text-[#e5e1e4] tracking-tight uppercase">
              BARCODE SCANNER
            </h1>
          </div>
          <button
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#5af0b3] flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[#003825] text-[18px]">person</span>
          </button>
        </div>
      </header>
    );
  }

  if (screenView.type === 'exercise-detail') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#131315]/90 backdrop-blur-xl border-b border-[#202024] shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 -ml-2 rounded-lg flex items-center justify-center text-[#e5e1e4] active:bg-[#201f21] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-semibold text-[17px] text-[#e5e1e4] tracking-tight uppercase">
              EXERCISE DETAIL
            </h1>
          </div>
          <button
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#5af0b3] flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[#003825] text-[18px]">person</span>
          </button>
        </div>
      </header>
    );
  }

  if (screenView.type === 'licenses') {
    return (
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#131315]/90 backdrop-blur-xl border-b border-[#202024] shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 -ml-2 rounded-lg flex items-center justify-center text-[#e5e1e4] active:bg-[#201f21] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="font-semibold text-[17px] text-[#e5e1e4] tracking-tight uppercase">
              OPEN SOURCE LICENCES
            </h1>
          </div>
          <button
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#5af0b3] flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[#003825] text-[18px]">person</span>
          </button>
        </div>
      </header>
    );
  }

  // Main Tabs Header
  const brandTitle = currentTab === 'food' ? 'IRONTRACK' : 'IRONSYS';
  const sectionLabel =
    currentTab === 'log'
      ? 'LOG'
      : currentTab === 'history'
      ? 'HISTORY'
      : currentTab === 'food'
      ? 'FOOD'
      : 'EXERCISES';

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#131315]/90 backdrop-blur-xl border-b border-[#202024] shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[#5af0b3] font-bold text-[18px] tracking-tight uppercase">
            {brandTitle}
          </span>
          <span className="text-[#3c4a42] text-[13px] font-medium">/</span>
          <h1 className="text-[16px] font-semibold tracking-wide uppercase text-[#e5e1e4]">
            {sectionLabel}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeWorkoutRunning && (
            <button
              onClick={() => onNavigateScreen({ type: 'active-workout' })}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#34d399]/20 text-[#5af0b3] border border-[#34d399]/40 active:scale-95 transition-transform"
            >
              <span className="w-2 h-2 rounded-full bg-[#5af0b3] animate-pulse"></span>
              <span className="text-[11px] font-semibold uppercase tracking-wider">Live</span>
            </button>
          )}

          {currentTab === 'history' && (
            <button
              aria-label="Notifications"
              onClick={() => alert('No unread notifications. All telemetry synched.')}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#bbcac0] hover:text-[#e5e1e4] active:bg-[#201f21] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          )}

          <button
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#5af0b3] flex items-center justify-center active:scale-95 transition-transform shadow-sm"
          >
            <span className="material-symbols-outlined text-[#003825] text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
