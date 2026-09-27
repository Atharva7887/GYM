import React from 'react';

interface CircularProgressArcProps {
  percentage: number; // 0 to 100+
  size?: number; // width & height in px
  strokeWidth?: number;
  strokeColor: string;
  trackColor?: string;
  glowColor?: string;
  className?: string;
  label?: string;
  valueText?: string;
  unitText?: string;
}

export const CircularProgressArc: React.FC<CircularProgressArcProps> = ({
  percentage,
  size = 110,
  strokeWidth = 9,
  strokeColor,
  trackColor = '#201f21',
  glowColor,
  className = '',
  label,
  valueText,
  unitText,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  // Clamp fill percentage between 0 and 100 for SVG dashoffset
  const clamped = Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 overflow-visible"
      >
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined,
          }}
        />
      </svg>

      {/* Centered label readouts inside ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
        {label && (
          <span className="text-[9px] uppercase tracking-wider text-[#85948b] font-semibold leading-none mb-0.5">
            {label}
          </span>
        )}
        {valueText && (
          <span className="text-[15px] font-bold text-[#e5e1e4] tabular-nums font-mono leading-none">
            {valueText}
          </span>
        )}
        {unitText && (
          <span className="text-[10px] text-[#bbcac0] font-mono leading-none mt-0.5">
            {unitText}
          </span>
        )}
      </div>
    </div>
  );
};
