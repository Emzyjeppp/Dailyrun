import React, { useState } from 'react';
import { verifyOwnerPin, setOwnerLoggedIn } from '../services/storage';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPin(pin)) {
      setOwnerLoggedIn(true);
      setErrorMsg('');
      setPin('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('PIN salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-strava-black/75 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm bg-strava-bg-card rounded-2xl border border-strava-border shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-strava-dark">
            <div className="w-8 h-8 rounded-lg bg-strava-orange-subtle flex items-center justify-center text-strava-orange">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold">Akses Pemilik</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-strava-muted hover:text-strava-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-strava-muted leading-relaxed">
          Masukkan PIN pemilik untuk membuka mode kelola aktivitas lari.
        </p>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-strava-dark block mb-1">
              PIN Pemilik
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-strava-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan PIN..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange text-strava-dark"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-strava-muted-dark hover:bg-strava-bg-subtle transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-strava-orange hover:bg-strava-orange-hover text-white text-xs font-bold shadow-xs transition-colors"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
