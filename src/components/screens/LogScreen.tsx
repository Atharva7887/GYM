import React, { useState } from 'react';
import { RoutineTemplate } from '../../types';
import { DashboardCard } from '../dashboard/DashboardCard';

interface LogScreenProps {
  routines: RoutineTemplate[];
  onStartWorkout: (routine?: RoutineTemplate) => void;
  onOpenPlateCalc: () => void;
  onAddNewRoutine: (routine: RoutineTemplate) => void;
  dailyKcal: number;
  dailyVolumeKg: number;
  activeWorkoutRunning?: boolean;
  onOpenFoodTab: () => void;
  onOpenHistoryTab: () => void;
}

export const LogScreen: React.FC<LogScreenProps> = ({
  routines,
  onStartWorkout,
  onOpenPlateCalc,
  onAddNewRoutine,
  dailyKcal,
  dailyVolumeKg,
  activeWorkoutRunning,
  onOpenFoodTab,
  onOpenHistoryTab,
}) => {
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const customRoutine: RoutineTemplate = {
      id: `routine-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Custom Split',
      exerciseCount: 4,
      exercises: [
        { name: 'Barbell Bench Press', muscles: 'Chest', equipment: 'Barbell', sets: 3, reps: '8', weight: 80 },
        { name: 'Barbell Back Squat', muscles: 'Legs', equipment: 'Barbell', sets: 3, reps: '6', weight: 120 },
      ],
    };

    onAddNewRoutine(customRoutine);
    setShowNewRoutineModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-16 max-w-md mx-auto">
      {/* QUICK DISPATCH & Ready to Lift */}
      <div className="flex items-center justify-between pt-3 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85948b]">
          QUICK DISPATCH
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#5af0b3] animate-pulse"></span>
          <span className="text-[12px] font-medium text-[#5af0b3]">Ready to lift</span>
        </div>
      </div>

      <h1 className="text-[28px] font-bold text-[#e5e1e4] tracking-tight mb-3">
        Start a session
      </h1>

      {/* NEW: Dashboard Feature with Dual Circular Progress Rings (Caloric Intake & Workout Volume) */}
      <DashboardCard
        dailyKcal={dailyKcal}
        dailyVolumeKg={dailyVolumeKg}
        activeWorkoutRunning={activeWorkoutRunning}
        onOpenFoodTab={onOpenFoodTab}
        onOpenHistoryTab={onOpenHistoryTab}
      />

      {/* 2x2 Routine Cards Grid matching Image 3 */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {routines.map((routine) => (
          <div
            key={routine.id}
            onClick={() => onStartWorkout(routine)}
            className="p-4 rounded-2xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between min-h-[135px] group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#5af0b3] group-hover:bg-[#34d399]/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">fitness_center</span>
              </div>
              <span className="material-symbols-outlined text-[#85948b] group-hover:text-[#5af0b3] text-[20px] transition-colors">
                arrow_forward
              </span>
            </div>

            <div className="flex flex-col mt-3">
              <h2 className="text-[16px] font-bold text-[#e5e1e4] leading-snug">
                {routine.title}
              </h2>
              <span className="text-[12px] text-[#85948b] truncate mt-0.5">
                {routine.subtitle}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5af0b3] mt-2">
                {routine.exerciseCount} EXERCISES
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Routine Action Button */}
      <button
        onClick={() => setShowNewRoutineModal(true)}
        className="w-full h-12 rounded-2xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] text-[#e5e1e4] font-medium text-[14px] flex items-center justify-center gap-2 mb-3 active:scale-[0.99] transition-all"
      >
        <span className="material-symbols-outlined text-[#85948b] text-[20px]">add</span>
        <span>New routine</span>
      </button>

      {/* RECOVERY STATUS Card matching Image 3 */}
      <div className="w-full p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2a2a2c] flex items-center justify-center text-[#ffd16d]">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85948b]">
              RECOVERY STATUS
            </span>
            <span className="text-[14px] font-semibold text-[#e5e1e4]">
              48h since Leg Day
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#34d399]/20 text-[#5af0b3] text-[12px] font-bold">
          100%
        </span>
      </div>

      {/* Chunky Tactile EMPTY SESSION Button matching Image 3 */}
      <button
        onClick={() => onStartWorkout(undefined)}
        className="w-full h-14 bg-[#34d399] text-[#003825] font-bold text-[16px] rounded-2xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all flex items-center justify-center gap-2 cursor-pointer select-none uppercase tracking-wide"
      >
        <span className="material-symbols-outlined text-[22px]">play_arrow</span>
        <span>EMPTY SESSION</span>
      </button>

      {/* Quick Tool: Plate Calculator direct trigger */}
      <div className="mt-4 pt-3 border-t border-[#202024] flex items-center justify-between text-[#85948b]">
        <span className="text-[12px]">Need to check bar weights?</span>
        <button
          onClick={onOpenPlateCalc}
          className="text-[12px] font-semibold text-[#5af0b3] hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">calculate</span>
          <span>Open Plate Calculator</span>
        </button>
      </div>

      {/* New Routine Modal */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreateRoutine}
            className="w-full max-w-md bg-[#1b1b1d] border-t sm:border border-[#2a2a2c] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 pb-safe"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#e5e1e4]">Create New Routine</h3>
              <button
                type="button"
                onClick={() => setShowNewRoutineModal(false)}
                className="w-8 h-8 rounded-full bg-[#201f21] flex items-center justify-center text-[#bbcac0]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#85948b] font-medium">Routine Name</label>
              <input
                type="text"
                placeholder="e.g. Arms &amp; Weak Points"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full h-11 bg-[#131315] border border-[#2a2a2c] rounded-xl px-3.5 text-[14px] text-[#e5e1e4] focus:outline-none focus:border-[#34d399]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#85948b] font-medium">Focus Muscles</label>
              <input
                type="text"
                placeholder="e.g. Biceps, triceps, forearms"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full h-11 bg-[#131315] border border-[#2a2a2c] rounded-xl px-3.5 text-[14px] text-[#e5e1e4] focus:outline-none focus:border-[#34d399]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#34d399] text-[#003825] font-bold text-[15px] rounded-xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Save Routine</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
