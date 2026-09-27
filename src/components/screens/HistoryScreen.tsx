import React, { useState } from 'react';
import { HistoryWorkoutItem } from '../../data/mockData';

interface HistoryScreenProps {
  loggedWorkouts: HistoryWorkoutItem[];
  onDeleteWorkout: (id: string) => void;
  onSelectExerciseDetail: (exerciseId: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  loggedWorkouts,
  onDeleteWorkout,
  onSelectExerciseDetail,
}) => {
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const handleExport = () => {
    // Generate CSV string of the logged workouts telemetry
    const headers = 'Workout Title,Date,Time,Volume (kg),Sets,Exercises\n';
    const rows = loggedWorkouts
      .map(
        (w) =>
          `"${w.title}","${w.dateTag}","${w.timeRange}",${w.volumeKg},${w.setsCount},${w.exercisesCount}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `irontrack-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportFeedback('Exported telemetry CSV');
    setTimeout(() => setExportFeedback(null), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-24 px-4 pt-16 max-w-md mx-auto">
      {/* Sub-header action bar & contextual metadata matching Image 10 */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85948b]">
            ARCHIVE REGISTRY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#5af0b3] animate-pulse"></span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#5af0b3]">ios_share</span>
            <span className="text-[12px] font-medium">
              {exportFeedback || 'Export'}
            </span>
          </button>

          <button
            aria-label="Filter"
            onClick={() => alert('Filtering archive by: All exercises, 2026')}
            className="w-8 h-8 rounded-lg bg-[#201f21] flex items-center justify-center text-[#bbcac0]"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Strip matching Image 4 & 10 */}
      <div className="p-4 rounded-2xl bg-[#0e0e10] border border-[#202024] shadow-md flex items-center justify-between relative overflow-hidden mb-5">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#34d399]/5 to-transparent pointer-events-none"></div>

        <div className="flex flex-col pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[#85948b] text-[14px]">event_available</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#85948b]">
              SESSIONS
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-bold text-[#e5e1e4] tabular-nums">48</span>
            <span className="text-[12px] text-[#5af0b3] font-medium">completed</span>
          </div>
        </div>

        <div className="w-px h-10 bg-[#2a2a2c]"></div>

        <div className="flex flex-col pl-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[#85948b] text-[14px]">tab_search</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#85948b]">
              TOTAL VOLUME
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[30px] font-bold text-[#e5e1e4] tabular-nums tracking-tight">
              312,400
            </span>
            <span className="text-[13px] text-[#85948b]">kg</span>
          </div>
        </div>
      </div>

      {/* Major Section: Insights & Summary */}
      <section className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold text-[#e5e1e4]">Insights &amp; Summary</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#201f21] text-[10px] font-bold uppercase text-[#5af0b3] tracking-wider border border-[#34d399]/30">
              Deterministic Analysis
            </span>
          </div>
          <span className="material-symbols-outlined text-[#85948b] text-[18px]">query_stats</span>
        </div>

        {/* Gemini Nano · On-Device Summary Card */}
        <div className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] shadow-sm mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#5af0b3] text-[18px]">neurology</span>
              <span className="text-[15px] font-bold text-[#e5e1e4]">Session Summary</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2a2c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
              <span className="text-[10px] text-[#bbcac0] font-medium uppercase tracking-wider">
                Gemini Nano · On-device
              </span>
            </div>
          </div>

          <p className="text-[13px] text-[#bbcac0] leading-relaxed mb-3">
            Bench Press estimated 1RM reached <strong className="text-[#e5e1e4]">102.5 kg</strong> (+5.0 kg increase across 5 sessions). Total volume accumulated <strong className="text-[#e5e1e4]">12,480 kg</strong> across 18 working sets. Pull-to-push volume balance tracked at <strong className="text-[#e5e1e4]">48%</strong> over the trailing 28 days.
          </p>

          <div className="flex items-center gap-3 pt-2 bg-[#0e0e10]/60 rounded-xl px-3 py-2 text-[11px] text-[#85948b]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#5af0b3] text-[14px]">lock</span>
              <span>Processed strictly offline</span>
            </div>
            <span>·</span>
            <span>Zero telemetry latency</span>
          </div>
        </div>

        {/* Structured Insight Cards Grid */}
        <div className="flex flex-col gap-2.5">
          {/* Card 1: Amber Plateau */}
          <div className="rounded-xl bg-[#1b1b1d] border border-[#202024] shadow-sm overflow-hidden flex">
            <div className="w-1.5 bg-[#f9bd22] shrink-0"></div>
            <div className="p-3.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#f9bd22] text-[16px]">horizontal_rule</span>
                  <h3 className="text-[14px] font-semibold text-[#e5e1e4] truncate">
                    Bench Press plateau
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ffd16d]/20 text-[#ffd16d] text-[10px] font-bold uppercase">
                  Observation
                </span>
              </div>
              <p className="text-[12px] text-[#bbcac0] mb-2.5">
                Best estimated 1RM unchanged at 102.5 kg across 5 consecutive logged bench sessions.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-[#201f21]">
                  <span className="text-[10px] uppercase text-[#85948b] block mb-0.5">Consecutive Static</span>
                  <span className="text-[14px] font-bold text-[#e5e1e4]">5 sessions</span>
                </div>
                <div className="p-2 rounded-lg bg-[#201f21]">
                  <span className="text-[10px] uppercase text-[#85948b] block mb-0.5">Static 1RM Floor</span>
                  <span className="text-[14px] font-bold text-[#ffd16d]">102.5 kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Violet Volume Balance */}
          <div className="rounded-xl bg-[#1b1b1d] border border-[#202024] shadow-sm overflow-hidden flex">
            <div className="w-1.5 bg-[#cebdff] shrink-0"></div>
            <div className="p-3.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#cebdff] text-[16px]">balance</span>
                  <h3 className="text-[14px] font-semibold text-[#e5e1e4] truncate">
                    Volume balance: Pull vs Push
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#4f319c]/40 text-[#cebdff] text-[10px] font-bold uppercase">
                  Distribution
                </span>
              </div>
              <p className="text-[12px] text-[#bbcac0] mb-2.5">
                Trailing 28-day pull volume is 48% of push volume (6,240 kg pull vs 12,980 kg push).
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="w-full h-2 rounded-full bg-[#201f21] overflow-hidden flex">
                  <div className="h-full bg-[#cebdff]" style={{ width: '32.5%' }}></div>
                  <div className="h-full bg-[#5af0b3]" style={{ width: '67.5%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#85948b] font-mono">
                  <span>Pull: 6,240 kg (32.5%)</span>
                  <span>Push: 12,980 kg (67.5%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Emerald Personal Record */}
          <div className="rounded-xl bg-[#1b1b1d] border border-[#202024] shadow-sm overflow-hidden flex">
            <div className="w-1.5 bg-[#34d399] shrink-0"></div>
            <div className="p-3.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#34d399] text-[16px]">emoji_events</span>
                  <h3 className="text-[14px] font-semibold text-[#e5e1e4] truncate">
                    Personal record: Squat volume
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34d399]/20 text-[#5af0b3] text-[10px] font-bold uppercase">
                  Delta Peak
                </span>
              </div>
              <p className="text-[12px] text-[#bbcac0] mb-2">
                New session volume record of 15,920 kg achieved on Back Squat.
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#201f21]">
                <span className="text-[12px] text-[#bbcac0]">Back Squat Cumulative</span>
                <span className="text-[15px] font-bold text-[#5af0b3] font-mono">
                  15,920 kg
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Emerald Nutrition Target */}
          <div className="rounded-xl bg-[#1b1b1d] border border-[#202024] shadow-sm overflow-hidden flex">
            <div className="w-1.5 bg-[#34d399] shrink-0"></div>
            <div className="p-3.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#34d399] text-[16px]">track_changes</span>
                  <h3 className="text-[14px] font-semibold text-[#e5e1e4] truncate">
                    Protein intake target
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34d399]/20 text-[#5af0b3] text-[10px] font-bold uppercase">
                  Nutrition
                </span>
              </div>
              <p className="text-[12px] text-[#bbcac0] mb-2">
                Averaged 142 g daily on training days against 150 g target (95% target adherence).
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#201f21]">
                <span className="text-[12px] text-[#bbcac0]">Target Variance</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#5af0b3] font-mono">142 / 150 g</span>
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#34d399]/20 text-[#5af0b3]">
                    95%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Line */}
        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#85948b]">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <span>Estimates for tracking only. Not medical advice.</span>
        </div>
      </section>

      {/* Progress Section: Core Telemetry Trends & Sparklines matching Image 4 & 10 */}
      <section className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-[#e5e1e4]">Core Telemetry Trends</h2>
            <span className="text-[11px] uppercase tracking-wider text-[#85948b]">
              Estimated 1RM Trailing 60 Days
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Bench Press Card */}
          <div
            onClick={() => onSelectExerciseDetail('bench-press')}
            className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] cursor-pointer hover:bg-[#201f21] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5af0b3]"></span>
                <h3 className="text-[16px] font-bold text-[#e5e1e4]">Bench Press</h3>
                <span className="text-[12px] font-bold text-[#5af0b3] bg-[#34d399]/20 px-1.5 py-0.5 rounded">
                  +5.0
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#e5e1e4] tabular-nums font-mono">
                  102.5
                </span>
                <span className="text-[12px] text-[#85948b]">kg</span>
              </div>
            </div>

            {/* Glowing Mint Sparkline */}
            <div className="w-full h-12 flex items-center py-1">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 40">
                <defs>
                  <linearGradient id="benchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5af0b3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#5af0b3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 32 Q 50 28, 90 25 T 160 18 T 230 12 L 280 12 L 320 12"
                  fill="none"
                  stroke="#5af0b3"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="320" cy="12" fill="#5af0b3" r="3.5" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#85948b]">
              <span>Jul 28: 97.5 kg</span>
              <span>Plateau (5 sessions)</span>
              <span>Current: 102.5 kg</span>
            </div>
          </div>

          {/* Back Squat Card */}
          <div
            onClick={() => onSelectExerciseDetail('back-squat')}
            className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] cursor-pointer hover:bg-[#201f21] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd16d]"></span>
                <h3 className="text-[16px] font-bold text-[#e5e1e4]">Back Squat</h3>
                <span className="text-[12px] font-bold text-[#ffd16d] bg-[#ffd16d]/20 px-1.5 py-0.5 rounded">
                  +7.5
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#e5e1e4] tabular-nums font-mono">
                  147.5
                </span>
                <span className="text-[12px] text-[#85948b]">kg</span>
              </div>
            </div>

            <div className="w-full h-12 flex items-center py-1">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 40">
                <path
                  d="M0 36 L 60 30 L 120 28 L 180 22 L 240 15 L 320 4"
                  fill="none"
                  stroke="#ffd16d"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="320" cy="4" fill="#ffd16d" r="3.5" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#85948b]">
              <span>Jul 28: 135.0 kg</span>
              <span className="text-[#ffd16d]">+12.5 kg peak</span>
              <span>Current: 147.5 kg</span>
            </div>
          </div>

          {/* Deadlift Card */}
          <div
            onClick={() => onSelectExerciseDetail('deadlift')}
            className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] cursor-pointer hover:bg-[#201f21] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cebdff]"></span>
                <h3 className="text-[16px] font-bold text-[#e5e1e4]">Conventional Deadlift</h3>
                <span className="text-[12px] font-bold text-[#cebdff] bg-[#4f319c]/40 px-1.5 py-0.5 rounded">
                  +10.0
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#e5e1e4] tabular-nums font-mono">
                  185.0
                </span>
                <span className="text-[12px] text-[#85948b]">kg</span>
              </div>
            </div>

            <div className="w-full h-12 flex items-center py-1">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 40">
                <path
                  d="M0 28 Q 70 30, 130 24 T 220 18 T 320 8"
                  fill="none"
                  stroke="#cebdff"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="320" cy="8" fill="#cebdff" r="3.5" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#85948b]">
              <span>Jul 28: 175.0 kg</span>
              <span className="text-[#cebdff]">+10.0 kg steady</span>
              <span>Current: 185.0 kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Logged Workouts Section matching Image 4 & 10 */}
      <section className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[20px] font-bold text-[#e5e1e4]">Logged Workouts</h2>
            <span className="text-[11px] uppercase tracking-wider text-[#85948b]">
              September 2026
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#201f21] text-[#bbcac0] text-[11px] font-medium">
            {loggedWorkouts.length} Sessions
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {loggedWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="p-4 rounded-2xl bg-[#1b1b1d] border border-[#202024] shadow-sm flex flex-col gap-2 relative group hover:border-[#2a2a2c] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#201f21] text-[11px] font-semibold text-[#e5e1e4] uppercase">
                    {workout.dateTag}
                  </span>
                  <span className="text-[11px] text-[#85948b]">{workout.timeRange}</span>
                </div>

                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  title="Delete workout entry"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#85948b] hover:text-[#ffb4ab] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                </button>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="text-[16px] font-bold text-[#e5e1e4]">{workout.title}</h3>
                <span className="text-[16px] font-bold text-[#5af0b3] font-mono">
                  {workout.volumeKg.toLocaleString()} kg
                </span>
              </div>

              {/* Volume, Sets, Exercises micro stats */}
              <div className="grid grid-cols-3 gap-2 py-1 text-[11px] text-[#85948b] border-t border-[#202024]">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Volume</span>
                  <span className="text-[#e5e1e4] font-semibold">{workout.volumeKg.toLocaleString()} kg</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Sets</span>
                  <span className="text-[#e5e1e4] font-semibold">{workout.setsCount}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider">Exercises</span>
                  <span className="text-[#e5e1e4] font-semibold">{workout.exercisesCount}</span>
                </div>
              </div>

              {/* Workout chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {workout.chips.map((chip, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-[#201f21] text-[#bbcac0] text-[10px] font-mono uppercase"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View Previous Archive Button */}
        <button
          onClick={() => alert('Viewing August 2026 Archive: 18 Sessions logged (294,800 kg total volume)')}
          className="mt-4 py-3.5 w-full rounded-2xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] text-[#e5e1e4] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <span className="material-symbols-outlined text-[18px] text-[#5af0b3]">calendar_month</span>
          <span>View August 2026 Archive</span>
        </button>
      </section>
    </div>
  );
};
