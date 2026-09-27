import React from 'react';
import { ExerciseDefinition } from '../../types';

interface ExerciseDetailScreenProps {
  exercise: ExerciseDefinition;
  onBack: () => void;
  onAddToSession: (exercise: ExerciseDefinition) => void;
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  exercise,
  onBack,
  onAddToSession,
}) => {
  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-16 max-w-md mx-auto text-[#e5e1e4]">
      {/* Category & Equipment Tags */}
      <div className="flex items-center gap-2 pt-2 mb-3">
        {exercise.tags.map((tag, idx) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide ${
              idx === 0
                ? 'bg-[#34d399]/20 text-[#5af0b3] border border-[#34d399]/30'
                : 'bg-[#201f21] text-[#bbcac0] border border-[#2a2a2c]'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-[26px] font-bold text-[#e5e1e4] tracking-tight mb-3">
        {exercise.name}
      </h1>

      {/* Suggested Parameter Card matching Image 5 */}
      <div className="w-full rounded-2xl bg-[#1b1b1d] border border-[#202024] p-4 flex flex-col gap-2 mb-4 shadow-sm">
        <span className="text-[14px] font-bold text-[#e5e1e4]">Suggested</span>

        <div className="grid grid-cols-3 gap-2 py-1 bg-[#201f21] rounded-xl p-3 text-center border border-[#2a2a2c]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              SETS
            </span>
            <span className="text-[22px] font-bold text-[#e5e1e4] font-mono mt-0.5">
              {exercise.suggested.sets}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#2a2a2c]">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              REPS
            </span>
            <span className="text-[22px] font-bold text-[#e5e1e4] font-mono mt-0.5">
              {exercise.suggested.reps}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              REST
            </span>
            <span className="text-[22px] font-bold text-[#e5e1e4] font-mono mt-0.5">
              {exercise.suggested.rest}
            </span>
          </div>
        </div>

        <span className="text-[12px] text-[#85948b]">
          {exercise.suggested.level}
        </span>
      </div>

      {/* Technique Guide Visual Cards matching Image 5 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Grip Width Card */}
        <div className="rounded-2xl bg-[#1b1b1d] border border-[#202024] overflow-hidden flex flex-col group">
          <div className="w-full h-28 bg-[#0e0e10] flex items-center justify-center relative p-3">
            {/* Visual Barbell Grip Diagram */}
            <svg viewBox="0 0 160 100" className="w-full h-full text-[#85948b]">
              {/* Barbell Bar */}
              <line x1="10" y1="50" x2="150" y2="50" stroke="#4b5563" strokeWidth="6" strokeLinecap="round" />
              {/* Knurling bands */}
              <line x1="30" y1="50" x2="65" y2="50" stroke="#34d399" strokeWidth="6" strokeDasharray="2,2" />
              <line x1="95" y1="50" x2="130" y2="50" stroke="#34d399" strokeWidth="6" strokeDasharray="2,2" />
              {/* Left hand grip */}
              <rect x="50" y="38" width="14" height="24" rx="4" fill="#34d399" opacity="0.8" />
              {/* Right hand grip */}
              <rect x="96" y="38" width="14" height="24" rx="4" fill="#34d399" opacity="0.8" />
              {/* Center Ring Indicator */}
              <circle cx="80" cy="50" r="3" fill="#e5e1e4" />
            </svg>
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#201f21] text-[9px] font-mono text-[#5af0b3]">
              1.5x SH
            </span>
          </div>
          <div className="p-2.5 bg-[#1b1b1d]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5e1e4]">
              GRIP WIDTH
            </span>
          </div>
        </div>

        {/* Arch & Base Card */}
        <div className="rounded-2xl bg-[#1b1b1d] border border-[#202024] overflow-hidden flex flex-col group">
          <div className="w-full h-28 bg-[#0e0e10] flex items-center justify-center relative p-3">
            {/* Visual Powerlifter Arch Diagram */}
            <svg viewBox="0 0 160 100" className="w-full h-full text-[#85948b]">
              {/* Bench surface */}
              <line x1="20" y1="65" x2="140" y2="65" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              {/* Bench pad posts */}
              <line x1="35" y1="65" x2="35" y2="90" stroke="#374151" strokeWidth="4" />
              <line x1="125" y1="65" x2="125" y2="90" stroke="#374151" strokeWidth="4" />
              {/* Arched torso line */}
              <path d="M 35 60 Q 75 42 110 60" fill="none" stroke="#5af0b3" strokeWidth="3.5" strokeLinecap="round" />
              {/* Foot drive indicator */}
              <line x1="110" y1="60" x2="130" y2="85" stroke="#ffd16d" strokeWidth="3" strokeLinecap="round" />
              <line x1="125" y1="85" x2="140" y2="85" stroke="#ffd16d" strokeWidth="4" strokeLinecap="round" />
              {/* Shoulder blades pinned */}
              <circle cx="38" cy="58" r="4" fill="#34d399" />
            </svg>
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#201f21] text-[9px] font-mono text-[#ffd16d]">
              RETRACTED
            </span>
          </div>
          <div className="p-2.5 bg-[#1b1b1d]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5e1e4]">
              ARCH &amp; BASE
            </span>
          </div>
        </div>
      </div>

      {/* How to perform numbered steps matching Image 5 */}
      <div className="flex flex-col gap-2.5 mb-4">
        <h2 className="text-[17px] font-bold text-[#e5e1e4]">How to perform</h2>

        <div className="flex flex-col gap-3">
          {exercise.howToPerform.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#34d399]/20 text-[#5af0b3] font-bold text-[12px] flex items-center justify-center shrink-0 mt-0.5 border border-[#34d399]/30">
                {idx + 1}
              </span>
              <p className="text-[13px] text-[#bbcac0] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form cues matching Image 5 */}
      <div className="w-full rounded-2xl bg-[#1b1b1d] border border-[#202024] p-4 flex flex-col gap-2.5 mb-4">
        <h2 className="text-[15px] font-bold text-[#e5e1e4]">Form cues</h2>

        <div className="flex flex-col gap-2">
          {exercise.formCues.map((cue, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#34d399] text-[18px] shrink-0 mt-0.5">
                check
              </span>
              <span className="text-[13px] text-[#bbcac0] leading-snug">{cue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Your history & 1RM Progression Sparkline matching Image 5 */}
      <div className="w-full rounded-2xl bg-[#1b1b1d] border border-[#202024] p-4 flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#e5e1e4]">Your history</h2>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#85948b]">
            LAST 8 SESSIONS
          </span>
        </div>

        {/* 1RM Chart */}
        <div className="w-full h-24 bg-[#0e0e10] rounded-xl p-3 flex flex-col justify-end relative overflow-hidden border border-[#202024]">
          <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="detailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 50 L 50 48 L 90 48 L 130 40 L 170 32 L 210 32 L 250 20 L 290 12"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Data points */}
            {[
              [10, 50], [50, 48], [90, 48], [130, 40],
              [170, 32], [210, 32], [250, 20], [290, 12],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="#34d399" />
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[12px] text-[#85948b]">Best est. 1RM</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-bold text-[#e5e1e4] font-mono">
              {exercise.bestEst1RM}
            </span>
            <span className="text-[12px] text-[#85948b]">kg</span>
          </div>
        </div>
      </div>

      {/* Chunky Tactile "+ Add to session" button matching Image 5 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 max-w-md mx-auto bg-gradient-to-t from-[#131315] via-[#131315]/95 to-transparent pb-safe">
        <button
          onClick={() => onAddToSession(exercise)}
          className="w-full h-14 bg-[#34d399] text-[#003825] font-bold text-[16px] rounded-2xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span>Add to session</span>
        </button>
      </div>
    </div>
  );
};
