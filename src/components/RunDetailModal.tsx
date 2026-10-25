import React, { useEffect } from 'react';
import { RunActivity, AthleteProfile } from '../types/run';
import { formatDateIndo, formatDuration } from '../utils/formatters';
import { X, MapPin, Clock, Gauge, Mountain, Heart, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface RunDetailModalProps {
  run: RunActivity | null;
  athlete: AthleteProfile;
  onClose: () => void;
}

export const RunDetailModal: React.FC<RunDetailModalProps> = ({
  run,
  athlete,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (run) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [run, onClose]);

  if (!run) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-strava-black/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      {/* Background click overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-strava-bg-card rounded-2xl border border-strava-border shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-strava-dark text-white flex items-center justify-between border-b border-strava-dark">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-strava-orange flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.2 13.828h4.169" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest text-strava-orange uppercase">
                Strava Proof Inspector
              </span>
              <span className="text-[11px] text-zinc-400 hidden sm:inline">
                • Atlet: {athlete.fullName} ({athlete.country})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Grid 2 Kolom: Gambar Screenshot Penuh & Rincian Statistik */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Screenshot Area (Kolom 7) */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <span className="text-xs font-bold text-strava-muted-dark uppercase tracking-wider flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-strava-orange" />
                Tangkapan Layar Strava Asli
              </span>

              <div className="relative rounded-xl overflow-hidden bg-strava-black border border-strava-border flex items-center justify-center min-h-[300px] shadow-sm">
                {run.screenshotDataUrl ? (
                  <img
                    src={run.screenshotDataUrl}
                    alt={run.title}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-strava-muted">
                    <p className="text-sm">Tidak ada tangkapan layar yang dilampirkan.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Informasi & Metrik (Kolom 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Title & Verified Tag */}
                <div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-strava-green-subtle text-strava-green border border-strava-green/30 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lari Terverifikasi Strava</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-strava-dark leading-tight">
                    {run.title}
                  </h2>
                </div>

                {/* Tanggal & Waktu */}
                <div className="flex items-center space-x-3 text-xs text-strava-muted p-2.5 rounded-lg bg-strava-bg-subtle border border-strava-border">
                  <div className="flex items-center space-x-1 text-strava-dark font-medium">
                    <Calendar className="w-3.5 h-3.5 text-strava-orange" />
                    <span>{formatDateIndo(run.date)}</span>
                  </div>
                  {run.time && (
                    <div className="flex items-center space-x-1 text-strava-dark font-medium">
                      <Clock className="w-3.5 h-3.5 text-strava-orange" />
                      <span>{run.time}</span>
                    </div>
                  )}
                </div>

                {/* Metrik Statistik Utama */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-strava-bg-subtle border border-strava-border">
                    <span className="text-[11px] uppercase font-bold text-strava-muted flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-strava-orange" /> Jarak
                    </span>
                    <p className="text-2xl font-black text-strava-dark mt-1">
                      {Number(run.distanceKm).toFixed(2)}{' '}
                      <span className="text-xs font-medium text-strava-muted">km</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-strava-bg-subtle border border-strava-border">
                    <span className="text-[11px] uppercase font-bold text-strava-muted flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-strava-orange" /> Waktu
                    </span>
                    <p className="text-2xl font-black text-strava-dark mt-1">
                      {formatDuration(run.durationMinutes, run.durationSeconds)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-strava-bg-subtle border border-strava-border col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-strava-muted flex items-center">
                        <Gauge className="w-3.5 h-3.5 mr-1 text-strava-orange" /> Rata-Rata Pace
                      </span>
                      <span className="text-[11px] font-semibold text-strava-orange">Kecepatan Rata-rata</span>
                    </div>
                    <p className="text-2xl font-black text-strava-orange mt-1">
                      {run.paceFormatted}
                    </p>
                  </div>

                  {run.elevationGainMeters !== undefined && run.elevationGainMeters > 0 && (
                    <div className="p-3 rounded-xl bg-strava-bg-subtle border border-strava-border">
                      <span className="text-[11px] uppercase font-bold text-strava-muted flex items-center">
                        <Mountain className="w-3.5 h-3.5 mr-1 text-strava-blue" /> Elevasi
                      </span>
                      <p className="text-lg font-bold text-strava-dark mt-1">
                        {run.elevationGainMeters} <span className="text-xs font-normal text-strava-muted">m</span>
                      </p>
                    </div>
                  )}

                  {run.avgHeartRate !== undefined && run.avgHeartRate > 0 && (
                    <div className="p-3 rounded-xl bg-strava-bg-subtle border border-strava-border">
                      <span className="text-[11px] uppercase font-bold text-strava-muted flex items-center">
                        <Heart className="w-3.5 h-3.5 mr-1 text-red-500" /> Detak Jantung
                      </span>
                      <p className="text-lg font-bold text-strava-dark mt-1">
                        {run.avgHeartRate} <span className="text-xs font-normal text-strava-muted">bpm</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Catatan Sesi */}
                {run.notes && (
                  <div className="p-3.5 rounded-xl bg-strava-warm border border-strava-warm-border">
                    <span className="text-xs font-bold text-strava-warm-text uppercase tracking-wider block mb-1">
                      Catatan Sesi Lari
                    </span>
                    <p className="text-xs text-strava-dark leading-relaxed">
                      {run.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Tombol Tutup di Bagian Bawah */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-strava-dark hover:bg-strava-black text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Tutup Tampilan Bukti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
