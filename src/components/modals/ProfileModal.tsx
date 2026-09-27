import React from 'react';
import { User } from 'firebase/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLicenses: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  authLoading: boolean;
  authError?: string | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenLicenses,
  soundEnabled,
  onToggleSound,
  user,
  onSignIn,
  onSignOut,
  authLoading,
  authError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#131315] border-t sm:border border-[#2a2a2c] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#353437] rounded-full mx-auto sm:hidden cursor-pointer" onClick={onClose}></div>

        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#e5e1e4]">Profile &amp; Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#201f21] hover:bg-[#2a2a2c] text-[#bbcac0] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1b1b1d] border border-[#2a2a2c]">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-12 h-12 rounded-full border border-[#34d399]/40 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#5af0b3] flex items-center justify-center text-[#003825] font-bold text-[20px]">
              <span className="material-symbols-outlined text-[26px]">person</span>
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[15px] font-semibold text-[#e5e1e4] truncate">
              {user ? user.displayName || 'Authorized Athlete' : 'Atharva Shirke'}
            </span>
            <span className="text-[12px] text-[#85948b] truncate">
              {user ? user.email : 'athshirke2002@gmail.com'}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${user ? 'bg-[#34d399]' : 'bg-[#ffd16d]'}`}></span>
              <span className="text-[11px] text-[#34d399] font-medium uppercase tracking-wider">
                {user ? 'Firestore Cloud Synced' : 'Offline / Local Cache'}
              </span>
            </div>
          </div>
        </div>

        {/* Firebase Google Auth Action */}
        <div className="flex flex-col gap-1.5">
          {user ? (
            <button
              onClick={onSignOut}
              disabled={authLoading}
              className="w-full h-11 bg-[#201f21] hover:bg-[#2a2a2c] border border-[#ffb4ab]/30 text-[#ffb4ab] font-semibold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out of Google Account</span>
            </button>
          ) : (
            <button
              onClick={onSignIn}
              disabled={authLoading}
              className="w-full h-12 bg-[#34d399] hover:bg-[#45dfa4] text-[#003825] font-bold text-[14px] rounded-xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span>{authLoading ? 'Signing In...' : 'Sign In with Google (Firebase)'}</span>
            </button>
          )}

          {authError && (
            <p className="text-[11px] text-[#ffb4ab] text-center font-medium">
              {authError}
            </p>
          )}
        </div>

        {/* Quick Settings */}
        <div className="flex flex-col gap-2">
          {/* Sound alert toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b1d] border border-[#202024]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#5af0b3] text-[20px]">volume_up</span>
              <span className="text-[14px] text-[#e5e1e4] font-medium">Rest Timer Sound</span>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#34d399]' : 'bg-[#353437]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Unit selection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b1d] border border-[#202024]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#5af0b3] text-[20px]">scale</span>
              <span className="text-[14px] text-[#e5e1e4] font-medium">Weight Unit</span>
            </div>
            <span className="text-[12px] font-semibold text-[#5af0b3] bg-[#34d399]/20 px-2 py-0.5 rounded">
              Metric (KG)
            </span>
          </div>

          {/* Open Source Licenses Link */}
          <button
            onClick={() => {
              onClose();
              onOpenLicenses();
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b1d] border border-[#202024] hover:bg-[#201f21] active:scale-[0.99] transition-all text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#5af0b3] text-[20px]">policy</span>
              <div className="flex flex-col">
                <span className="text-[14px] text-[#e5e1e4] font-medium">Open Source Licences</span>
                <span className="text-[11px] text-[#85948b]">ODbL v1.0, USDA CC0 &amp; Zero Telemetry</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#85948b] text-[18px]">chevron_right</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 bg-[#201f21] hover:bg-[#2a2a2c] text-[#e5e1e4] font-medium text-[14px] rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

