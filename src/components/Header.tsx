import React, { useState } from 'react';
import { AthleteProfile } from '../types/run';
import { Plus, Flame, Share2, LogOut, Check } from 'lucide-react';

interface HeaderProps {
  athlete: AthleteProfile;
  isOwner: boolean;
  onOpenAddModal: () => void;
  onLogoutOwner: () => void;
  onCopyShareLink: () => void;
  currentStreak: number;
}

export const Header: React.FC<HeaderProps> = ({
  athlete,
  isOwner,
  onOpenAddModal,
  onLogoutOwner,
  onCopyShareLink,
  currentStreak,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    onCopyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-strava-bg-card border-b border-strava-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Profil Atlet */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-strava-orange flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.2 13.828h4.169" />
              </svg>
            </div>

            <div className="flex items-center space-x-2.5">
              <a
                href={athlete.stravaUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka profil Strava"
              >
                <img
                  src={athlete.profileImageUrl}
                  alt={athlete.fullName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-strava-orange hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </a>
              <div>
                <a
                  href={athlete.stravaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-strava-dark hover:text-strava-orange transition-colors block leading-tight"
                >
                  {athlete.fullName}
                </a>
                <span className="text-[11px] text-strava-muted">
                  Dailyrun Streak • {athlete.country}
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Streak + Tombol Aksi */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Indikator Streak (Dilihat oleh Semua Orang) */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-strava-orange-subtle border border-strava-orange/30 text-strava-orange">
              <Flame className="w-4 h-4 fill-strava-orange text-strava-orange" />
              <span className="text-xs font-bold">{currentStreak} HARI</span>
            </div>

            {/* JIKA PEMILIK: Tombol Bagikan Link + Catat Lari + Keluar */}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-strava-border bg-strava-bg-subtle hover:bg-strava-bg-card text-strava-dark text-xs font-bold transition-colors"
                  title="Salin link POV publik untuk dibagikan"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-strava-green" />
                      <span className="text-strava-green">Link Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-strava-orange" />
                      <span className="hidden sm:inline">Bagikan Link POV</span>
                      <span className="sm:hidden">Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="flex items-center space-x-1.5 bg-strava-orange hover:bg-strava-orange-hover text-white px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catat Lari</span>
                </button>

                <button
                  type="button"
                  onClick={onLogoutOwner}
                  className="p-1.5 rounded-xl text-strava-muted hover:text-red-600 hover:bg-red-50 border border-strava-border transition-colors"
                  title="Keluar dari Akses Pemilik"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
