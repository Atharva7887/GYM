import React, { useState } from 'react';

interface LicensesScreenProps {
  onBack: () => void;
}

export const LicensesScreen: React.FC<LicensesScreenProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  const citationText =
    'U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, 2019. fdc.nal.usda.gov.';

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 px-4 pt-16 max-w-md mx-auto text-[#e5e1e4]">
      {/* Top Banner Chip & Offline Guarantee matching Image 9 & 11 */}
      <div className="pt-2 pb-4 flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#1b1b1d] border border-[#202024]">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
          <span className="text-[12px] text-[#bbcac0] font-mono uppercase tracking-wider">
            Local SQLite v4.12
          </span>
        </div>
        <p className="text-[13px] text-[#bbcac0] leading-relaxed">
          IronTrack is built entirely offline. Nutrition data originates from public domain and open databases with zero telemetry or network calls.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Section 1: Open Food Facts — India Subset matching Image 9 & 11 */}
        <section className="bg-[#0e0e10] border border-[#202024] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4f319c]/40 text-[#cebdff] text-[11px] font-semibold border border-[#4f319c]/50">
              <span className="material-symbols-outlined text-[13px]">policy</span>
              ODbL v1.0 Licence
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85948b]">
              Verified Set
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-[#e5e1e4]">
              Open Food Facts — India Subset
            </h2>
            <p className="text-[13px] text-[#bbcac0] leading-relaxed">
              Contains information from Open Food Facts, which is made available here under the Open Database License (ODbL) v1.0.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <a
              href="https://openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-3.5 rounded-xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] flex items-center justify-between text-[#e5e1e4] active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#34d399] text-[20px]">public</span>
                <span className="text-[13px] font-medium">Open Food Facts (openfoodfacts.org)</span>
              </div>
              <span className="material-symbols-outlined text-[#85948b] group-hover:text-[#34d399] text-[18px]">
                open_in_new
              </span>
            </a>

            <a
              href="https://opendatacommons.org/licenses/odbl/1-0/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-3.5 rounded-xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] flex items-center justify-between text-[#e5e1e4] active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#34d399] text-[20px]">description</span>
                <span className="text-[13px] font-medium">Read ODbL v1.0 Licence</span>
              </div>
              <span className="material-symbols-outlined text-[#85948b] group-hover:text-[#34d399] text-[18px]">
                open_in_new
              </span>
            </a>
          </div>

          <div className="bg-[#1b1b1d] border border-[#202024] rounded-xl p-3 flex flex-col gap-2.5 mt-1">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#34d399] text-[18px] shrink-0 mt-0.5">
                inventory_2
              </span>
              <p className="text-[12px] text-[#bbcac0] leading-relaxed">
                In compliance with ODbL Share-Alike provisions, the bundled 14,280 Indian product subset extracted for this build is published as a standalone SQLite table and CSV.
              </p>
            </div>

            <div className="h-11 px-3 rounded-lg bg-[#201f21] border border-[#2a2a2c] flex items-center justify-between text-[#e5e1e4]">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="material-symbols-outlined text-[#85948b] text-[16px]">terminal</span>
                <span className="text-[12px] font-mono text-[#34d399] truncate">
                  github.com/irontrack/off-india-subset
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0e0e10] text-[#bbcac0] uppercase shrink-0 font-mono">
                CSV • SQLITE
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: USDA FoodData Central matching Image 9 & 11 */}
        <section className="bg-[#0e0e10] border border-[#202024] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecb210]/20 text-[#ffd16d] text-[11px] font-semibold border border-[#ecb210]/30">
              <span className="material-symbols-outlined text-[13px]">lock_open</span>
              CC0 Public Domain
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85948b]">
              Raw Staples
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-[#e5e1e4]">USDA FoodData Central</h2>
            <p className="text-[13px] text-[#bbcac0] leading-relaxed">
              Foundation ingredient profiles for staple raw ingredients and home-cooked dish calculations.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#85948b]">
                Suggested Citation
              </span>
              <button
                aria-label="Copy citation"
                onClick={handleCopyCitation}
                className="flex items-center gap-1 text-[12px] text-[#34d399] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-[#1b1b1d] border border-[#202024] rounded-xl p-3 select-all">
              <code className="text-[12px] text-[#e5e1e4] font-mono leading-relaxed block break-words">
                {citationText}
              </code>
            </div>
          </div>
        </section>

        {/* Section 3: Offline Data Guarantee matching Image 9 & 11 */}
        <section className="bg-[#0e0e10] border border-[#202024] rounded-2xl p-4 flex flex-col gap-2.5 shadow-md mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#34d399]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#34d399] text-[18px]">verified_user</span>
            </div>
            <span className="text-[15px] font-bold text-[#e5e1e4]">Zero Network &amp; Data Safety</span>
          </div>

          <p className="text-[13px] text-[#bbcac0] leading-relaxed pl-10">
            All food databases are pre-indexed into SQLite on your device. The camera feed processes frames directly via ML Kit in memory and never uploads frames or telemetry.
          </p>

          <div className="mt-1 pt-2 border-t border-[#202024] flex items-center justify-between text-[11px] text-[#85948b]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#34d399]">wifi_off</span>
              <span>Offline operational verified</span>
            </div>
            <span>Zero trackers</span>
          </div>
        </section>
      </div>

      <button
        onClick={onBack}
        className="w-full h-12 bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] font-semibold text-[14px] rounded-xl transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
};
