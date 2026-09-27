import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

export interface ExerciseRPEDataPoint {
  sessionDate: string;
  displayDate: string;
  rpe: number;
  weightKg: number;
  reps: number;
  setIndex: number;
}

const EXERCISE_RPE_DATASET: Record<string, { name: string; color: string; data: ExerciseRPEDataPoint[] }> = {
  'bench-press': {
    name: 'Barbell Bench Press',
    color: '#5af0b3', // Emerald primary
    data: [
      { sessionDate: '2026-08-04', displayDate: 'Aug 04', rpe: 7.0, weightKg: 80, reps: 6, setIndex: 3 },
      { sessionDate: '2026-08-12', displayDate: 'Aug 12', rpe: 7.5, weightKg: 82.5, reps: 6, setIndex: 3 },
      { sessionDate: '2026-08-20', displayDate: 'Aug 20', rpe: 8.0, weightKg: 85, reps: 5, setIndex: 3 },
      { sessionDate: '2026-08-29', displayDate: 'Aug 29', rpe: 8.5, weightKg: 85, reps: 5, setIndex: 4 },
      { sessionDate: '2026-09-06', displayDate: 'Sep 06', rpe: 8.0, weightKg: 87.5, reps: 5, setIndex: 3 },
      { sessionDate: '2026-09-14', displayDate: 'Sep 14', rpe: 8.5, weightKg: 87.5, reps: 5, setIndex: 3 },
      { sessionDate: '2026-09-19', displayDate: 'Sep 19', rpe: 9.0, weightKg: 90, reps: 4, setIndex: 3 },
      { sessionDate: '2026-09-24', displayDate: 'Sep 24', rpe: 8.5, weightKg: 87.5, reps: 5, setIndex: 3 },
    ],
  },
  'back-squat': {
    name: 'Barbell Back Squat',
    color: '#ffd16d', // Amber
    data: [
      { sessionDate: '2026-07-28', displayDate: 'Jul 28', rpe: 7.5, weightKg: 120, reps: 5, setIndex: 3 },
      { sessionDate: '2026-08-10', displayDate: 'Aug 10', rpe: 8.0, weightKg: 125, reps: 5, setIndex: 4 },
      { sessionDate: '2026-08-24', displayDate: 'Aug 24', rpe: 8.5, weightKg: 130, reps: 5, setIndex: 4 },
      { sessionDate: '2026-09-05', displayDate: 'Sep 05', rpe: 8.0, weightKg: 135, reps: 4, setIndex: 4 },
      { sessionDate: '2026-09-22', displayDate: 'Sep 22', rpe: 8.5, weightKg: 140, reps: 5, setIndex: 4 },
    ],
  },
  'deadlift': {
    name: 'Conventional Deadlift',
    color: '#cebdff', // Violet
    data: [
      { sessionDate: '2026-07-28', displayDate: 'Jul 28', rpe: 7.0, weightKg: 150, reps: 5, setIndex: 2 },
      { sessionDate: '2026-08-14', displayDate: 'Aug 14', rpe: 7.5, weightKg: 160, reps: 4, setIndex: 3 },
      { sessionDate: '2026-08-28', displayDate: 'Aug 28', rpe: 8.0, weightKg: 165, reps: 3, setIndex: 3 },
      { sessionDate: '2026-09-12', displayDate: 'Sep 12', rpe: 8.5, weightKg: 170, reps: 3, setIndex: 3 },
      { sessionDate: '2026-09-20', displayDate: 'Sep 20', rpe: 9.0, weightKg: 175, reps: 3, setIndex: 3 },
    ],
  },
  'overhead-press': {
    name: 'Overhead Press',
    color: '#34d399',
    data: [
      { sessionDate: '2026-08-02', displayDate: 'Aug 02', rpe: 7.0, weightKg: 50, reps: 6, setIndex: 3 },
      { sessionDate: '2026-08-18', displayDate: 'Aug 18', rpe: 8.0, weightKg: 55, reps: 5, setIndex: 3 },
      { sessionDate: '2026-09-01', displayDate: 'Sep 01', rpe: 8.0, weightKg: 57.5, reps: 5, setIndex: 3 },
      { sessionDate: '2026-09-24', displayDate: 'Sep 24', rpe: 8.5, weightKg: 60, reps: 5, setIndex: 3 },
    ],
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ExerciseRPEDataPoint }>;
}

const CustomRpeTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1b1b1d] border border-[#2a2a2c] rounded-xl p-2.5 shadow-xl text-left pointer-events-none">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-[11px] font-mono text-[#85948b]">{data.displayDate}</span>
          <span className="px-1.5 py-0.2 rounded bg-[#34d399]/20 text-[#5af0b3] font-bold text-[10px] font-mono">
            RPE {data.rpe.toFixed(1)}
          </span>
        </div>
        <div className="text-[13px] font-bold text-[#e5e1e4] font-mono">
          {data.weightKg} kg × {data.reps} reps
        </div>
        <div className="text-[10px] text-[#85948b] mt-0.5">
          Top Working Set #{data.setIndex}
        </div>
      </div>
    );
  }
  return null;
};

export const ExerciseRPEProgressionChart: React.FC = () => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('bench-press');

  const currentExercise = EXERCISE_RPE_DATASET[selectedExerciseId] || EXERCISE_RPE_DATASET['bench-press'];
  const chartData = currentExercise.data;

  // Calculate current vs baseline RPE metrics
  const latestPoint = chartData[chartData.length - 1];
  const initialPoint = chartData[0];
  const averageRPE = (
    chartData.reduce((acc, curr) => acc + curr.rpe, 0) / chartData.length
  ).toFixed(1);

  return (
    <div className="w-full rounded-2xl bg-[#1b1b1d] border border-[#202024] p-4 flex flex-col gap-3 shadow-md mb-6">
      {/* Header and selector */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5af0b3] text-[18px]">monitoring</span>
            <h2 className="text-[17px] font-bold text-[#e5e1e4]">
              RPE Fatigue &amp; Progression
            </h2>
          </div>
          <span className="text-[11px] text-[#85948b] mt-0.5">
            Rating of Perceived Exertion (RPE 6.0 – 10.0 scale)
          </span>
        </div>

        <div className="px-2 py-0.5 rounded-full bg-[#201f21] border border-[#2a2a2c] text-[10px] font-mono uppercase text-[#bbcac0]">
          Recharts SVG
        </div>
      </div>

      {/* Exercise Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {Object.entries(EXERCISE_RPE_DATASET).map(([key, info]) => {
          const isActive = selectedExerciseId === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedExerciseId(key)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#34d399] text-[#003825] font-bold shadow-sm'
                  : 'bg-[#201f21] text-[#bbcac0] hover:text-[#e5e1e4] border border-[#2a2a2c]'
              }`}
            >
              {info.name.split(' ')[0]} {info.name.split(' ')[1] || ''}
            </button>
          );
        })}
      </div>

      {/* Primary KPI micro cards */}
      <div className="grid grid-cols-3 gap-2 bg-[#201f21] rounded-xl p-2.5 border border-[#2a2a2c]">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-semibold text-[#85948b]">Latest RPE</span>
          <span className="text-[18px] font-bold text-[#e5e1e4] font-mono leading-tight mt-0.5">
            {latestPoint.rpe.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#85948b]">{latestPoint.displayDate}</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center border-x border-[#2a2a2c]">
          <span className="text-[10px] uppercase font-semibold text-[#85948b]">Avg Effort</span>
          <span className="text-[18px] font-bold text-[#ffd16d] font-mono leading-tight mt-0.5">
            {averageRPE}
          </span>
          <span className="text-[10px] text-[#85948b]">Trailing sessions</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-semibold text-[#85948b]">Top Load</span>
          <span className="text-[18px] font-bold text-[#5af0b3] font-mono leading-tight mt-0.5">
            {latestPoint.weightKg} kg
          </span>
          <span className="text-[10px] text-[#85948b]">+{latestPoint.weightKg - initialPoint.weightKg} kg net</span>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="w-full h-52 pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${selectedExerciseId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentExercise.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentExercise.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="displayDate"
              stroke="#5a5a62"
              tick={{ fill: '#85948b', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#2a2a2c' }}
            />

            <YAxis
              domain={[6.0, 10.0]}
              ticks={[6, 7, 8, 9, 10]}
              stroke="#5a5a62"
              tick={{ fill: '#85948b', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#2a2a2c' }}
            />

            {/* Target RPE 8.0-8.5 Optimal Hypertrophy / Strength Band Reference */}
            <ReferenceLine
              y={8.5}
              stroke="#ffd16d"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />

            <Tooltip content={<CustomRpeTooltip />} />

            <Area
              type="monotone"
              dataKey="rpe"
              stroke={currentExercise.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${selectedExerciseId})`}
              dot={{ fill: currentExercise.color, stroke: '#1b1b1d', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ffffff', stroke: currentExercise.color, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Reference line key & legend note */}
      <div className="flex items-center justify-between pt-1 border-t border-[#202024] text-[11px] text-[#85948b] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#ffd16d] border-dashed"></span>
          <span>Target RPE 8.5 threshold</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentExercise.color }}></span>
          <span className="text-[#e5e1e4]">{currentExercise.name}</span>
        </div>
      </div>
    </div>
  );
};
