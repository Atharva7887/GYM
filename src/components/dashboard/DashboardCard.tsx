import React from 'react';
import { CircularProgressArc } from '../ui/CircularProgressArc';

interface DashboardCardProps {
  dailyKcal: number;
  targetKcal?: number;
  dailyVolumeKg: number;
  targetVolumeKg?: number;
  activeWorkoutRunning?: boolean;
  onOpenFoodTab: () => void;
  onOpenHistoryTab: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  dailyKcal,
  targetKcal = 2350,
  dailyVolumeKg,
  targetVolumeKg = 15000,
  activeWorkoutRunning,
  onOpenFoodTab,
  onOpenHistoryTab,
}) => {
  const kcalPercent = Math.round((dailyKcal / targetKcal) * 100);
  const volumePercent = Math.round((dailyVolumeKg / targetVolumeKg) * 100);

  return (
    <div className="w-full rounded-2xl bg-[#0e0e10] border border-[#202024] p-4 flex flex-col gap-3 shadow-md mb-4 relative overflow-hidden">
      {/* Background ambient subtle accent */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#34d399]/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#5af0b3] text-[18px]">dashboard</span>
          <h2 className="text-[14px] font-bold text-[#e5e1e4] uppercase tracking-wider">
            Daily Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1b1b1d] border border-[#202024]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5af0b3] animate-pulse"></span>
          <span className="text-[10px] font-mono text-[#bbcac0] uppercase tracking-wider">
            {activeWorkoutRunning ? 'Active Live' : 'Telemetry Synced'}
          </span>
        </div>
      </div>

      {/* Dual Circular Progress Rings: Caloric Intake & Workout Volume */}
      <div className="grid grid-cols-2 gap-3 py-1 bg-[#151517] rounded-xl p-3 border border-[#202024]">
        {/* Caloric Intake Ring */}
        <div
          onClick={onOpenFoodTab}
          className="flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-transform"
        >
          <CircularProgressArc
            percentage={kcalPercent}
            size={108}
            strokeWidth={8}
            strokeColor="#5af0b3"
            glowColor="rgba(90, 240, 179, 0.35)"
            label="Calories"
            valueText={`${dailyKcal.toLocaleString()}`}
            unitText={`/ ${targetKcal} kcal`}
          />
          <div className="flex items-center gap-1 mt-2 text-center">
            <span className="text-[12px] font-semibold text-[#e5e1e4] group-hover:text-[#5af0b3] transition-colors">
              Intake ({kcalPercent}%)
            </span>
            <span className="material-symbols-outlined text-[#85948b] text-[14px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </div>

        {/* Workout Volume Ring */}
        <div
          onClick={onOpenHistoryTab}
          className="flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-transform"
        >
          <CircularProgressArc
            percentage={volumePercent}
            size={108}
            strokeWidth={8}
            strokeColor="#ffd16d"
            glowColor="rgba(255, 209, 109, 0.35)"
            label="Volume"
            valueText={`${(dailyVolumeKg / 1000).toFixed(1)}k`}
            unitText={`/ 15k kg`}
          />
          <div className="flex items-center gap-1 mt-2 text-center">
            <span className="text-[12px] font-semibold text-[#e5e1e4] group-hover:text-[#ffd16d] transition-colors">
              Tonnage ({volumePercent}%)
            </span>
            <span className="material-symbols-outlined text-[#85948b] text-[14px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Details Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#85948b] px-1 font-mono">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#5af0b3]"></span>
          <span>Remaining: {Math.max(0, targetKcal - dailyKcal)} kcal</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#ffd16d]"></span>
          <span>Logged: {dailyVolumeKg.toLocaleString()} kg</span>
        </div>
      </div>
    </div>
  );
};
