import React, { useState, useEffect } from 'react';

interface KeypadBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g. "SET 3 · WEIGHT" or "SET 3 · REPS"
  unit: string;  // "kg" or "reps" or "rpe"
  initialValue: number | string;
  onConfirm: (val: number) => void;
}

export const KeypadBottomSheet: React.FC<KeypadBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  unit,
  initialValue,
  onConfirm,
}) => {
  const [valStr, setValStr] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setValStr(initialValue !== null && initialValue !== undefined ? initialValue.toString() : '');
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (digit === '.') {
      if (!valStr.includes('.')) {
        setValStr((prev) => (prev === '' ? '0.' : prev + '.'));
      }
      return;
    }
    // prevent too long inputs
    if (valStr.length >= 6) return;
    setValStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleBackspace = () => {
    setValStr((prev) => prev.slice(0, -1));
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(valStr) || 0;
    const next = Math.round((current + amount) * 100) / 100;
    setValStr(next.toString());
  };

  const handleConfirm = () => {
    const numeric = parseFloat(valStr) || 0;
    onConfirm(numeric);
    onClose();
  };

  const quickPills =
    unit === 'reps'
      ? [1, 2, 5, 10]
      : unit === 'rpe'
      ? [0.5, 1.0]
      : [1.25, 2.5, 5, 10];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md mx-auto bg-[#1b1b1d] rounded-t-3xl border-t border-[#2a2a2c] p-5 shadow-2xl flex flex-col gap-4 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-[#353437] rounded-full mx-auto -mt-1 cursor-pointer" onClick={onClose}></div>

        {/* Readout Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#85948b]">
              {title}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[34px] font-bold text-[#e5e1e4] tracking-tight tabular-nums">
                {valStr || '0'}
              </span>
              <span className="text-[18px] text-[#bbcac0] font-medium">{unit}</span>
            </div>
          </div>

          <button
            aria-label="Confirm Value"
            onClick={handleConfirm}
            className="w-14 h-14 rounded-full bg-[#34d399] text-[#003825] flex items-center justify-center shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[30px] font-bold">check</span>
          </button>
        </div>

        {/* Quick Increment Pills */}
        <div className="grid grid-cols-4 gap-2">
          {quickPills.map((pill) => (
            <button
              key={pill}
              onClick={() => handleQuickAdd(pill)}
              className="h-9 rounded-lg bg-[#2a2a2c] hover:bg-[#353437] text-[#5af0b3] text-[13px] font-semibold tabular-nums active:scale-95 transition-all flex items-center justify-center"
            >
              +{pill}
            </button>
          ))}
        </div>

        {/* 3x4 Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] active:bg-[#353437] text-[#e5e1e4] text-[22px] font-semibold tabular-nums active:scale-95 transition-transform flex items-center justify-center shadow-sm select-none"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={() => handleDigit('.')}
            className="h-14 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] active:bg-[#353437] text-[#e5e1e4] text-[24px] font-bold active:scale-95 transition-transform flex items-center justify-center shadow-sm select-none"
          >
            .
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] active:bg-[#353437] text-[#e5e1e4] text-[22px] font-semibold tabular-nums active:scale-95 transition-transform flex items-center justify-center shadow-sm select-none"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            aria-label="Backspace"
            className="h-14 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] active:bg-[#353437] text-[#bbcac0] active:text-[#ffb4ab] active:scale-95 transition-all flex items-center justify-center shadow-sm select-none"
          >
            <span className="material-symbols-outlined text-[24px]">backspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
