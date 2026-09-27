import React, { useState } from 'react';
import { calculatePlates } from '../../utils/plateCalculator';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  onApplyWeight?: (weight: number) => void;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 100,
  onApplyWeight,
}) => {
  const [barWeight, setBarWeight] = useState<number>(20);
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight || 100);

  if (!isOpen) return null;

  const result = calculatePlates(targetWeight, barWeight);

  const handleAdjust = (delta: number) => {
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 10) / 10));
  };

  const handleDone = () => {
    if (onApplyWeight) {
      onApplyWeight(targetWeight);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md mx-auto bg-[#131315] border-t sm:border border-[#2a2a2c] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-5 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle on mobile */}
        <div className="w-10 h-1 bg-[#353437] rounded-full mx-auto sm:hidden cursor-pointer" onClick={onClose}></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#e5e1e4]">Plate calculator</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#bbcac0] hover:text-[#e5e1e4] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Bar Selector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBarWeight(20)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
              barWeight === 20
                ? 'bg-[#34d399]/20 text-[#5af0b3] border border-[#34d399]'
                : 'bg-[#201f21] text-[#bbcac0] border border-transparent hover:text-[#e5e1e4]'
            }`}
          >
            20 kg bar
          </button>
          <button
            onClick={() => setBarWeight(15)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
              barWeight === 15
                ? 'bg-[#34d399]/20 text-[#5af0b3] border border-[#34d399]'
                : 'bg-[#201f21] text-[#bbcac0] border border-transparent hover:text-[#e5e1e4]'
            }`}
          >
            15 kg bar
          </button>
        </div>

        {/* Big Weight Readout with steppers */}
        <div className="flex flex-col items-center justify-center pt-1 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAdjust(-5)}
              aria-label="Decrease 5kg"
              className="w-10 h-10 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] font-bold text-[18px] flex items-center justify-center active:scale-95 transition-transform"
            >
              -5
            </button>

            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-[44px] font-bold text-[#e5e1e4] tracking-tight tabular-nums">
                  {targetWeight}
                </span>
                <span className="text-[20px] text-[#bbcac0] font-medium">kg</span>
              </div>
              <span className="text-[12px] text-[#85948b] -mt-1 font-medium">on the bar</span>
            </div>

            <button
              onClick={() => handleAdjust(5)}
              aria-label="Increase 5kg"
              className="w-10 h-10 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] font-bold text-[18px] flex items-center justify-center active:scale-95 transition-transform"
            >
              +5
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 mt-3">
            {[60, 80, 100, 120, 140].map((preset) => (
              <button
                key={preset}
                onClick={() => setTargetWeight(preset)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors ${
                  targetWeight === preset
                    ? 'bg-[#5af0b3] text-[#003825] font-bold'
                    : 'bg-[#201f21] text-[#bbcac0] hover:text-[#e5e1e4]'
                }`}
              >
                {preset}kg
              </button>
            ))}
          </div>
        </div>

        {/* Visual Barbell Graphic Rendering (Matching Image 6) */}
        <div className="w-full bg-[#0e0e10] border border-[#202024] rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[170px] overflow-hidden">
          <div className="relative w-full flex items-center justify-center h-32">
            {/* The Barbell Shaft (Left side extending out) */}
            <div className="absolute left-4 w-28 h-4 bg-[#4a4a50] rounded-l-sm shadow-inner"></div>

            {/* Inner Collar Stop */}
            <div className="absolute left-28 w-4 h-14 bg-[#6b7280] rounded-sm border-r border-[#374151]"></div>

            {/* Barbell Sleeve (extending to the right) */}
            <div className="absolute left-32 right-8 h-3.5 bg-[#4b5563] rounded-r-full shadow-inner"></div>

            {/* Stacked Plates on the Sleeve */}
            <div className="absolute left-32 flex items-center">
              {result.platesPerSide.flatMap((plate, groupIndex) =>
                Array.from({ length: plate.count }).map((_, itemIndex) => {
                  const spec = plate.spec;
                  return (
                    <div
                      key={`${groupIndex}-${itemIndex}`}
                      style={{
                        height: `${spec.heightPx}px`,
                        backgroundColor: spec.color,
                        borderColor: spec.borderColor,
                      }}
                      className="w-5 rounded-sm border flex flex-col items-center justify-center shadow-lg relative mx-[1px]"
                      title={`${spec.weight} kg`}
                    >
                      <span
                        style={{ color: spec.textColor }}
                        className="text-[9px] font-bold transform -rotate-90 select-none whitespace-nowrap"
                      >
                        {spec.weight}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Barbell Collar Clip / Clamp */}
              <div className="w-3.5 h-10 bg-[#374151] border border-[#4b5563] rounded-sm flex items-center justify-center ml-1">
                <span className="w-1.5 h-4 bg-[#111827] rounded-xs"></span>
              </div>
            </div>

            {/* Empty bar message if no plates */}
            {result.platesPerSide.length === 0 && (
              <span className="text-[12px] text-[#85948b] font-medium z-10">
                Empty barbell ({barWeight} kg)
              </span>
            )}
          </div>
        </div>

        {/* Text Breakdown & Status matching Image 6 */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-[14px] font-semibold text-[#e5e1e4]">
            {result.summaryText}
          </p>

          <div className="flex items-center gap-1 text-[13px] text-[#34d399] font-medium">
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>
              {result.exactMatch
                ? 'Exact match — no rounding needed.'
                : `Closest match: ${result.actualWeightOnBar} kg`}
            </span>
          </div>
        </div>

        {/* Chunky Done Button */}
        <button
          onClick={handleDone}
          className="w-full h-12 bg-[#34d399] text-[#003825] font-semibold text-[16px] rounded-xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all flex items-center justify-center cursor-pointer select-none"
        >
          Done
        </button>
      </div>
    </div>
  );
};
