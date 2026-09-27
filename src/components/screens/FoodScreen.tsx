import React, { useState } from 'react';
import { MealCategory, FoodItem } from '../../types';
import { AddFoodModal } from '../modals/AddFoodModal';

interface FoodScreenProps {
  meals: MealCategory[];
  onAddFoodItem: (mealName: string, item: FoodItem) => void;
  onDeleteFoodItem: (mealId: string, itemId: string) => void;
  onOpenScanner: (mealName?: string) => void;
}

export const FoodScreen: React.FC<FoodScreenProps> = ({
  meals,
  onAddFoodItem,
  onDeleteFoodItem,
  onOpenScanner,
}) => {
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [activeAddMeal, setActiveAddMeal] = useState<string | null>(null);

  // Calculate live consumed totals
  const totalKcal = meals.reduce(
    (sum, m) => sum + m.items.reduce((iSum, i) => iSum + i.kcal, 0),
    0
  );
  const totalProtein = Math.round(
    meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + i.p, 0), 0) * 10
  ) / 10;
  const totalCarbs = Math.round(
    meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + i.c, 0), 0) * 10
  ) / 10;
  const totalFat = Math.round(
    meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + i.f, 0), 0) * 10
  ) / 10;
  const totalFiber = Math.round(
    meals.reduce((sum, m) => sum + m.items.reduce((iSum, i) => iSum + (i.fiber || 0), 0), 0) * 10
  ) / 10;

  const targetKcal = 2350;
  const targetProtein = 160.0;
  const targetCarbs = 240.0;
  const targetFat = 65.0;
  const targetFiber = 30.0;

  const epochDay = 20721 + dayOffset;
  const getDateLabel = () => {
    if (dayOffset === 0) return 'Today · Wed, 24 Sep';
    if (dayOffset === -1) return 'Yesterday · Tue, 23 Sep';
    if (dayOffset === 1) return 'Tomorrow · Thu, 25 Sep';
    return `Day ${dayOffset > 0 ? '+' : ''}${dayOffset} · Sep 2026`;
  };

  return (
    <div className="flex flex-col w-full pb-28 px-4 pt-16 max-w-md mx-auto">
      {/* Date Navigation Strip matching Image 7 & 10 */}
      <div className="flex items-center justify-between w-full h-12 px-2 rounded-2xl bg-[#0e0e10] border border-[#202024] mb-3">
        <button
          aria-label="Previous day"
          onClick={() => setDayOffset((prev) => prev - 1)}
          className="w-9 h-9 rounded-xl bg-[#1b1b1d] hover:bg-[#201f21] flex items-center justify-center text-[#bbcac0] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold text-[#e5e1e4] leading-tight">
              {getDateLabel()}
            </span>
            <span className="material-symbols-outlined text-[15px] text-[#5af0b3]">calendar_today</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#85948b]">
            Epoch Day {epochDay}
          </span>
        </div>

        <button
          aria-label="Next day"
          onClick={() => setDayOffset((prev) => prev + 1)}
          className="w-9 h-9 rounded-xl bg-[#1b1b1d] hover:bg-[#201f21] flex items-center justify-center text-[#bbcac0] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* Totals Hero Card matching Image 7 & 10 */}
      <div className="w-full rounded-2xl bg-[#0e0e10] border border-[#202024] p-4 flex flex-col space-y-4 mb-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#85948b] tracking-widest uppercase">
              CONSUMED TODAY
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[32px] font-bold text-[#e5e1e4] tracking-tight tabular-nums font-mono">
                {totalKcal.toLocaleString()}
              </span>
              <span className="text-[14px] text-[#85948b] font-normal">/ {targetKcal.toLocaleString()} kcal</span>
            </div>
            <span className="text-[11px] text-[#85948b] mt-0.5">
              Mifflin-St Jeor estimated maintenance (2,350 kcal)
            </span>
          </div>

          <button
            onClick={() => onOpenScanner('Lunch')}
            className="w-10 h-10 rounded-xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#34d399]/40 text-[#5af0b3] flex items-center justify-center transition-all"
            title="Scan Barcode"
          >
            <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
          </button>
        </div>

        {/* 4 Macro Columns matching Image 7 */}
        <div className="grid grid-cols-4 gap-2 pt-2 bg-[#1b1b1d]/60 rounded-xl p-2.5 border border-[#202024]">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              Protein
            </span>
            <span className="text-[15px] text-[#e5e1e4] font-bold font-mono mt-0.5">
              {totalProtein}
              <span className="text-[11px] text-[#85948b] font-normal ml-0.5">g</span>
            </span>
            <div className="w-full bg-[#201f21] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#34d399] h-full rounded-full"
                style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              Carbs
            </span>
            <span className="text-[15px] text-[#e5e1e4] font-bold font-mono mt-0.5">
              {totalCarbs}
              <span className="text-[11px] text-[#85948b] font-normal ml-0.5">g</span>
            </span>
            <div className="w-full bg-[#201f21] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#cebdff] h-full rounded-full"
                style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              Fat
            </span>
            <span className="text-[15px] text-[#e5e1e4] font-bold font-mono mt-0.5">
              {totalFat}
              <span className="text-[11px] text-[#85948b] font-normal ml-0.5">g</span>
            </span>
            <div className="w-full bg-[#201f21] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#ffd16d] h-full rounded-full"
                style={{ width: `${Math.min(100, (totalFat / targetFat) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-semibold text-[#85948b] uppercase tracking-wider">
              Fibre
            </span>
            <span className="text-[15px] text-[#e5e1e4] font-bold font-mono mt-0.5">
              {totalFiber}
              <span className="text-[11px] text-[#85948b] font-normal ml-0.5">g</span>
            </span>
            <div className="w-full bg-[#201f21] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#85948b] h-full rounded-full"
                style={{ width: `${Math.min(100, (totalFiber / targetFiber) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Contrast Healthy Food Banner Image matching user asset */}
      <div className="w-full h-32 rounded-2xl overflow-hidden relative shadow-md mb-3 border border-[#202024]">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFUHx4h_pFxZYN1lGqAwL3-VNrgthA02_JPa5VpmPlAHk13s2yPawM0o34My2wD1GlohjlVesx06Js5oftVzIf4gF9cO1r53O2bfmnGLz9YGa-wexkiumVoMaVmIqXZEHaMOuzJVxKFe_72Dletj1Jl-H7YmOpJt78eSHFbImV7Ys4OBm5hgDmZodk3vpytTbzb-IgKmB_a7RPIycD-jFLyckDQud7yMgS03gBBYEs008DDQJP9nBw')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/40 to-transparent flex items-end p-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#5af0b3] text-[18px]">verified</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e5e1e4]">
              Raw Weighing Applied · Zero-Oil Prep Baseline
            </span>
          </div>
        </div>
      </div>

      {/* MEALS LIST (Breakfast, Lunch, Dinner, Snacks) */}
      <div className="flex flex-col gap-3">
        {meals.map((meal) => {
          const mealKcal = meal.items.reduce((sum, item) => sum + item.kcal, 0);

          return (
            <div
              key={meal.id}
              className="w-full rounded-2xl bg-[#0e0e10] border border-[#202024] p-4 flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-[#e5e1e4] tracking-tight">
                    {meal.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#e5e1e4] font-mono">
                    {mealKcal}{' '}
                    <span className="text-[11px] text-[#85948b] font-normal">kcal</span>
                  </span>
                  <button
                    aria-label={`Add food to ${meal.name}`}
                    onClick={() => setActiveAddMeal(meal.name)}
                    className="w-8 h-8 rounded-full bg-[#34d399] text-[#003825] flex items-center justify-center shadow-sm active:translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                  </button>
                </div>
              </div>

              {/* Items in meal */}
              <div className="flex flex-col space-y-2">
                {meal.items.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-xl bg-[#1b1b1d] border border-[#202024] flex items-stretch group"
                  >
                    <div className="flex-1 p-2.5 flex flex-col space-y-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-[#e5e1e4] font-medium truncate pr-2">
                          {item.name}
                        </span>
                        <span className="text-[13px] text-[#e5e1e4] font-semibold whitespace-nowrap font-mono">
                          {item.kcal} kcal
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#85948b]">
                        <span className="truncate pr-1">{item.portion}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] shrink-0 text-[#bbcac0]">
                          <span>P: <strong className="text-[#e5e1e4]">{item.p}g</strong></span>
                          <span>·</span>
                          <span>C: <strong className="text-[#e5e1e4]">{item.c}g</strong></span>
                          <span>·</span>
                          <span>F: <strong className="text-[#e5e1e4]">{item.f}g</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button (matching paneer swipe row in Image 7) */}
                    <button
                      aria-label={`Delete ${item.name}`}
                      onClick={() => onDeleteFoodItem(meal.id, item.id)}
                      className="w-10 bg-[#201f21] hover:bg-[#ffb4ab]/20 hover:text-[#ffb4ab] text-[#85948b] flex items-center justify-center transition-colors"
                      title="Delete item"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                    </button>
                  </div>
                ))}

                {meal.items.length === 0 && (
                  <div className="py-3 text-center text-[12px] text-[#85948b] italic">
                    No items logged for {meal.name} yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chunky Quick Food Log Entry Button matching Image 10 */}
      <div className="mt-4 pt-2">
        <button
          onClick={() => setActiveAddMeal('Lunch')}
          className="w-full h-12 bg-[#34d399] text-[#003825] font-semibold text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_0_0_#00563b] active:translate-y-0.5 active:shadow-[0_2px_0_0_#00563b] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Quick Food Log Entry</span>
        </button>
      </div>

      {/* Add Food Modal */}
      {activeAddMeal && (
        <AddFoodModal
          isOpen={!!activeAddMeal}
          onClose={() => setActiveAddMeal(null)}
          targetMealName={activeAddMeal}
          onAddFood={(mealName, item) => onAddFoodItem(mealName, item)}
          onOpenScanner={(mealName) => onOpenScanner(mealName)}
        />
      )}
    </div>
  );
};
