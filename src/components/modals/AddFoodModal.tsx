import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { OFFLINE_PACKAGED_DB } from '../../data/mockData';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMealName: string;
  onAddFood: (mealName: string, item: FoodItem) => void;
  onOpenScanner: (mealName: string) => void;
}

const COMMON_STAPLES: Omit<FoodItem, 'id'>[] = [
  { name: 'Eggs (boiled)', portion: '2 large (100 g)', kcal: 156, p: 12.6, c: 1.1, f: 10.6, fiber: 0 },
  { name: 'Egg White Omelette', portion: '4 whites (130 g)', kcal: 68, p: 14.2, c: 0.9, f: 0.2, fiber: 0 },
  { name: 'Rolled Oats (Dry)', portion: '1 bowl (50 g)', kcal: 195, p: 6.8, c: 33.5, f: 3.5, fiber: 5.2 },
  { name: 'Whole Wheat Atta Roti', portion: '1 roti (35 g raw)', kcal: 105, p: 3.2, c: 21.0, f: 0.8, fiber: 2.1 },
  { name: 'Yellow Moong Dal (Tadka)', portion: '1 katori (150 g)', kcal: 150, p: 9.4, c: 21.0, f: 3.2, fiber: 5.7 },
  { name: 'Cooked Basmati Rice', portion: '1 katori (150 g)', kcal: 195, p: 3.8, c: 43.5, f: 0.6, fiber: 0.8 },
  { name: 'Paneer (fresh raw)', portion: '100 g', kcal: 280, p: 18.2, c: 3.6, f: 22.0, fiber: 0 },
  { name: 'Skinless Chicken Breast', portion: '150 g raw', kcal: 165, p: 34.5, c: 0.0, f: 3.2, fiber: 0 },
  { name: 'Whey Protein Isolate', portion: '1 scoop (32 g)', kcal: 120, p: 25.0, c: 1.5, f: 0.8, fiber: 0 },
  { name: 'Banana (medium)', portion: '1 unit (100 g)', kcal: 89, p: 1.1, c: 22.8, f: 0.3, fiber: 2.6 },
  { name: 'Raw Almonds', portion: '15 pieces (15 g)', kcal: 90, p: 3.2, c: 3.2, f: 7.6, fiber: 1.8 },
  { name: 'Set Dahi (Curd)', portion: '150 g serving', kcal: 108, p: 6.0, c: 7.0, f: 6.0, fiber: 0 },
];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  targetMealName,
  onAddFood,
  onOpenScanner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaple, setSelectedStaple] = useState<Omit<FoodItem, 'id'> | null>(null);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  if (!isOpen) return null;

  const filteredStaples = COMMON_STAPLES.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: Omit<FoodItem, 'id'>) => {
    setSelectedStaple(item);
    setServingsMultiplier(1);
  };

  const handleAdd = () => {
    if (!selectedStaple) return;
    const finalItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: selectedStaple.name,
      portion: servingsMultiplier === 1 ? selectedStaple.portion : `${servingsMultiplier}x (${selectedStaple.portion})`,
      kcal: Math.round(selectedStaple.kcal * servingsMultiplier),
      p: Math.round(selectedStaple.p * servingsMultiplier * 10) / 10,
      c: Math.round(selectedStaple.c * servingsMultiplier * 10) / 10,
      f: Math.round(selectedStaple.f * servingsMultiplier * 10) / 10,
      fiber: selectedStaple.fiber ? Math.round(selectedStaple.fiber * servingsMultiplier * 10) / 10 : 0,
    };
    onAddFood(targetMealName, finalItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md mx-auto bg-[#131315] border-t sm:border border-[#2a2a2c] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-hidden pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#353437] rounded-full mx-auto sm:hidden cursor-pointer" onClick={onClose}></div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#e5e1e4]">Add to {targetMealName}</h2>
            <span className="text-[12px] text-[#85948b]">Offline Database · 14,280 Verified Items</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#bbcac0] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scan Barcode shortcut banner */}
        <button
          onClick={() => {
            onClose();
            onOpenScanner(targetMealName);
          }}
          className="w-full py-2.5 px-3.5 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#34d399]/40 flex items-center justify-between active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#34d399] text-[20px]">barcode_scanner</span>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold text-[#e5e1e4]">Scan Packaged Barcode</span>
              <span className="text-[11px] text-[#85948b]">Zero internet calls · Camera or manual code</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#34d399] text-[18px]">arrow_forward</span>
        </button>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3 text-[#85948b] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search staples (roti, dal, oats, eggs...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-[#1b1b1d] border border-[#2a2a2c] rounded-xl pl-9 pr-3 text-[14px] text-[#e5e1e4] placeholder-[#85948b] focus:outline-none focus:border-[#34d399]"
          />
        </div>

        {/* Food List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px] max-h-[220px]">
          {filteredStaples.map((item, idx) => {
            const isSelected = selectedStaple?.name === item.name;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#201f21] border-[#34d399]'
                    : 'bg-[#1b1b1d] border-[#202024] hover:bg-[#201f21]'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[14px] font-medium text-[#e5e1e4] truncate">{item.name}</span>
                  <span className="text-[11px] text-[#85948b]">{item.portion}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[#bbcac0]">
                    <span>P: <strong className="text-[#e5e1e4]">{item.p}g</strong></span>
                    <span>C: <strong className="text-[#e5e1e4]">{item.c}g</strong></span>
                    <span>F: <strong className="text-[#e5e1e4]">{item.f}g</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[15px] font-semibold text-[#e5e1e4] tabular-nums font-mono">
                    {item.kcal}
                  </span>
                  <span className="block text-[10px] text-[#85948b] uppercase">kcal</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected food serving selector & confirmation */}
        {selectedStaple && (
          <div className="p-3.5 rounded-2xl bg-[#1b1b1d] border border-[#2a2a2c] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#bbcac0] font-medium">Servings / Portions:</span>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setServingsMultiplier(s)}
                    className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold tabular-nums transition-colors ${
                      servingsMultiplier === s
                        ? 'bg-[#34d399] text-[#003825]'
                        : 'bg-[#2a2a2c] text-[#e5e1e4]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-[#202024]">
              <span className="text-[12px] text-[#85948b]">Total to log:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[18px] font-bold text-[#5af0b3] tabular-nums font-mono">
                  {Math.round(selectedStaple.kcal * servingsMultiplier)} kcal
                </span>
                <span className="text-[12px] text-[#bbcac0]">
                  ({Math.round(selectedStaple.p * servingsMultiplier)}g P)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Add button */}
        <button
          disabled={!selectedStaple}
          onClick={handleAdd}
          className={`w-full h-12 font-semibold text-[15px] rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedStaple
              ? 'bg-[#34d399] text-[#003825] shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b]'
              : 'bg-[#201f21] text-[#85948b] cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>Add to {targetMealName}</span>
        </button>
      </div>
    </div>
  );
};
