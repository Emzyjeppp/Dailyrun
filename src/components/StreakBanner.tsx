import React from 'react';
import { StreakStats } from '../types/run';
import { Flame, Trophy, MapPin, Activity, CheckCircle, Clock } from 'lucide-react';

interface StreakBannerProps {
  stats: StreakStats;
  onOpenAddModal?: () => void;
  isRunnerMode: boolean;
}

export const StreakBanner: React.FC<StreakBannerProps> = ({
  stats,
  onOpenAddModal,
  isRunnerMode,
}) => {
  return (
    <div className="bg-strava-bg-card rounded-xl border border-strava-border p-5 shadow-sm space-y-5">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-strava-border">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-strava-dark">
              Status Streak Lari Harian
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-strava-bg-subtle text-strava-muted-dark border border-strava-border">
              Strava Tracking
            </span>
          </div>
          <p className="text-xs text-strava-muted mt-0.5">
            Membangun kedisiplinan lari satu hari demi satu hari tanpa terputus.
          </p>
        </div>

        {/* Status Hari Ini Badge */}
        <div>
          {stats.ranToday ? (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-strava-green-subtle text-strava-green border border-strava-green/30 text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-strava-green" />
              <span>Streak Hari Ini Terpenuhi</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-strava-warm text-strava-warm-text border border-strava-warm-border text-xs font-bold">
              <Clock className="w-4 h-4 text-strava-warm-text" />
              <span>Belum Lari Hari Ini</span>
              {isRunnerMode && onOpenAddModal && (
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="ml-2 underline font-bold hover:text-strava-dark text-strava-orange"
                >
                  Catat sekarang
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid 4 Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak Aktif */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-strava-orange-subtle to-white border border-strava-orange/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-strava-orange">
              Streak Berjalan
            </span>
            <div className="w-7 h-7 rounded-full bg-strava-orange/10 flex items-center justify-center text-strava-orange">
              <Flame className="w-4 h-4 fill-strava-orange" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-black text-strava-orange">
                {stats.currentStreak}
              </span>
              <span className="text-sm font-bold text-strava-orange">HARI</span>
            </div>
            <p className="text-[11px] text-strava-muted mt-1">
              {stats.ranToday
                ? 'Target hari ini selesai'
                : 'Selesaikan lari untuk menjaga streak'}
            </p>
          </div>
        </div>

        {/* Rekor Terpanjang */}
        <div className="p-4 rounded-xl bg-strava-bg-subtle border border-strava-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-strava-muted-dark">
              Rekor Terpanjang
            </span>
            <div className="w-7 h-7 rounded-full bg-strava-border/50 flex items-center justify-center text-strava-muted-dark">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-black text-strava-dark">
                {stats.longestStreak}
              </span>
              <span className="text-sm font-bold text-strava-muted-dark">HARI</span>
            </div>
            <p className="text-[11px] text-strava-muted mt-1">
              Pencapaian streak terpanjang
            </p>
          </div>
        </div>

        {/* Total Jarak */}
        <div className="p-4 rounded-xl bg-strava-bg-subtle border border-strava-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-strava-muted-dark">
              Total Jarak
            </span>
            <div className="w-7 h-7 rounded-full bg-strava-border/50 flex items-center justify-center text-strava-muted-dark">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-black text-strava-dark">
                {stats.totalDistanceKm}
              </span>
              <span className="text-sm font-bold text-strava-muted-dark">KM</span>
            </div>
            <p className="text-[11px] text-strava-muted mt-1">
              Akumulasi jarak keseluruhan
            </p>
          </div>
        </div>

        {/* Total Sesi Lari */}
        <div className="p-4 rounded-xl bg-strava-bg-subtle border border-strava-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide uppercase text-strava-muted-dark">
              Total Aktivitas
            </span>
            <div className="w-7 h-7 rounded-full bg-strava-border/50 flex items-center justify-center text-strava-muted-dark">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-black text-strava-dark">
                {stats.totalRuns}
              </span>
              <span className="text-sm font-bold text-strava-muted-dark">SESI</span>
            </div>
            <p className="text-[11px] text-strava-muted mt-1">
              Log aktivitas tersimpan
            </p>
          </div>
        </div>
      </div>

      {/* Mini Bar 7 Hari Terakhir */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-strava-muted-dark">
            Kalender Streak 7 Hari Terakhir
          </span>
          <span className="text-[11px] text-strava-muted">
            Warna oranye menandakan sesi lari tercatat
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {stats.recentDatesStatus.map((item) => (
            <div
              key={item.date}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all ${
                item.ran
                  ? 'bg-strava-orange text-white border-strava-orange font-bold shadow-xs'
                  : 'bg-strava-bg-subtle text-strava-muted border-strava-border'
              }`}
              title={`${item.date}: ${item.ran ? 'Lari tercatat' : 'Tidak ada lari'}`}
            >
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
              <div className="mt-1">
                {item.ran ? (
                  <CheckCircle className="w-3.5 h-3.5 mx-auto" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-strava-border" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
