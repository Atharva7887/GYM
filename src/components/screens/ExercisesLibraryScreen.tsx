import React, { useState } from 'react';
import { ALL_EXERCISE_DEFINITIONS } from '../../data/mockData';
import { ExerciseDefinition } from '../../types';

interface ExercisesLibraryScreenProps {
  onSelectExercise: (exerciseId: string) => void;
  onAddExerciseToActive?: (exercise: ExerciseDefinition) => void;
  activeWorkoutRunning?: boolean;
}

export const ExercisesLibraryScreen: React.FC<ExercisesLibraryScreenProps> = ({
  onSelectExercise,
  onAddExerciseToActive,
  activeWorkoutRunning,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Chest', 'Back', 'Quads', 'Glutes', 'Shoulders', 'Triceps'];

  const filtered = ALL_EXERCISE_DEFINITIONS.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || ex.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-16 max-w-md mx-auto text-[#e5e1e4]">
      <div className="pt-2 pb-3">
        <h1 className="text-[26px] font-bold text-[#e5e1e4] tracking-tight">
          Exercise Library
        </h1>
        <span className="text-[12px] text-[#85948b]">
          Form guides, biomechanics cues &amp; 1RM history
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <span className="material-symbols-outlined absolute left-3 top-3 text-[#85948b] text-[18px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search exercise or muscle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-11 bg-[#1b1b1d] border border-[#2a2a2c] rounded-xl pl-9 pr-3 text-[14px] text-[#e5e1e4] placeholder-[#85948b] focus:outline-none focus:border-[#34d399]"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#34d399] text-[#003825] font-semibold'
                : 'bg-[#1b1b1d] text-[#bbcac0] hover:text-[#e5e1e4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => onSelectExercise(exercise.id)}
            className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] hover:bg-[#201f21] cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group"
          >
            <div className="flex flex-col min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-[#e5e1e4] group-hover:text-[#5af0b3] transition-colors truncate">
                  {exercise.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {exercise.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-[#85948b] font-medium"
                  >
                    {t} {idx < exercise.tags.length - 1 ? '·' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[14px] font-bold text-[#e5e1e4] font-mono">
                  {exercise.bestEst1RM}
                </span>
                <span className="text-[10px] text-[#85948b] block -mt-0.5">kg 1RM</span>
              </div>

              {activeWorkoutRunning && onAddExerciseToActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddExerciseToActive(exercise);
                  }}
                  title="Add to active session"
                  className="w-8 h-8 rounded-lg bg-[#34d399]/20 hover:bg-[#34d399] text-[#5af0b3] hover:text-[#003825] flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              )}

              <span className="material-symbols-outlined text-[#85948b] group-hover:text-[#5af0b3] text-[18px]">
                chevron_right
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
