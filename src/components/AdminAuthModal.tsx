import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, ShieldAlert, KeyRound, Eye, EyeOff, Check } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Masukkan PIN Pengelola.');
      return;
    }

    if (pinInput.trim() === correctPin.trim()) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('PIN salah! Akses ditolak untuk pengunjung biasa.');
      setPinInput('');
      inputRef.current?.focus();
    }
  };

  const handleQuickKey = (num: string) => {
    if (pinInput.length < 8) {
      setPinInput((prev) => prev + num);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative">
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Tutup autentikasi"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">
            Akses Khusus Pengelola
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Menu pengaturan sistem dikunci dengan PIN untuk mencegah pengunjung biasa mengubah tautan toko & konfigurasi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan PIN Admin"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center text-base tracking-widest font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 text-stone-400 hover:text-stone-700 p-1"
                title={showPin ? 'Sembunyikan PIN' : 'Lihat PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-600 pt-1 font-medium justify-center animate-shake">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Number Pad */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuickKey(num)}
                className="py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs transition-colors active:scale-95"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => handleQuickKey('0')}
              className="py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors active:scale-95"
            >
              0
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors flex items-center justify-center active:scale-95"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-stone-600 block">
              PIN bawaan awal pemilik: <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-stone-800">1234</code>
            </span>
            <span className="text-[10px] text-stone-600 block mt-0.5">
              (Dapat diganti di dalam tab Keamanan setelah masuk)
            </span>
          </div>

          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl hover:bg-stone-50 transition-colors"
            >
              Batal / Kembali ke Katalog
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
