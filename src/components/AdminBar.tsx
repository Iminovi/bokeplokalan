import React from 'react';
import { Shield, SlidersHorizontal, Lock, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

interface AdminBarProps {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  onLockAdmin: () => void;
  redirectEnabled: boolean;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  isSettingsOpen,
  onToggleSettings,
  onLockAdmin,
  redirectEnabled
}) => {
  return (
    <div className="bg-stone-900 text-stone-200 px-4 py-2 border-b border-stone-800 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 font-bold text-amber-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Sesi Pengelola (Admin) Aktif</span>
        </span>
        <span className="hidden sm:inline text-stone-600">|</span>
        <span className="hidden sm:inline text-stone-400">
          Status Redirect: {redirectEnabled ? (
            <span className="text-emerald-400 font-medium">Aktif</span>
          ) : (
            <span className="text-stone-400">Nonaktif</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSettings}
          className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 text-xs ${
            isSettingsOpen
              ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              : 'bg-stone-800 text-white hover:bg-stone-700 border border-stone-700'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3 text-amber-400" />
          <span>{isSettingsOpen ? 'Tutup Pengaturan' : 'Menu Pengaturan'}</span>
        </button>

        <button
          onClick={onLockAdmin}
          className="px-2.5 py-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs"
          title="Kunci kembali menu pengaturan agar aman dari pengguna biasa"
        >
          <Lock className="w-3 h-3" />
          <span>Kunci Akses</span>
        </button>
      </div>
    </div>
  );
};
