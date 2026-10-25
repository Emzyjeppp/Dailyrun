import React from 'react';
import { RunActivity } from '../types/run';
import { formatDateIndo, formatDuration } from '../utils/formatters';
import { Edit2, Trash2, Maximize2, ShieldCheck, Clock, MapPin, Gauge } from 'lucide-react';

interface RunCardProps {
  run: RunActivity;
  isOwner: boolean;
  onSelect: (run: RunActivity) => void;
  onEdit?: (run: RunActivity) => void;
  onDelete?: (id: string) => void;
}

export const RunCard: React.FC<RunCardProps> = ({
  run,
  isOwner,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group bg-strava-bg-card rounded-2xl border border-strava-border hover:border-strava-orange transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header Kartu: Tanggal & Waktu */}
        <div className="p-4 pb-3 flex items-center justify-between border-b border-strava-border/60">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-strava-orange" />
            <span className="text-xs font-bold text-strava-dark">
              {formatDateIndo(run.date)}
            </span>
            {run.time && (
              <span className="text-xs text-strava-muted flex items-center">
                <Clock className="w-3 h-3 mr-0.5 inline" /> {run.time}
              </span>
            )}
          </div>

          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-strava-orange-subtle text-strava-orange border border-strava-orange/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Strava Proof</span>
          </div>
        </div>

        {/* Judul Aktivitas */}
        <div className="px-4 pt-3 pb-2">
          <h3
            onClick={() => onSelect(run)}
            className="text-base font-bold text-strava-dark hover:text-strava-orange transition-colors cursor-pointer line-clamp-1"
            title={run.title}
          >
            {run.title}
          </h3>
        </div>

        {/* Kontainer Screenshot Strava (Tekan untuk info lengkap) */}
        <div className="px-4 pb-3">
          <div
            onClick={() => onSelect(run)}
            className="relative rounded-xl overflow-hidden bg-strava-dark border border-strava-border group/img cursor-pointer aspect-[16/10] flex items-center justify-center shadow-inner"
          >
            {run.screenshotDataUrl ? (
              <img
                src={run.screenshotDataUrl}
                alt={run.title}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/img:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center text-strava-border">
                <span className="text-xs font-medium">Tangkapan layar tidak tersedia</span>
              </div>
            )}

            {/* Overlay Banner 'Tekan SS untuk info lengkap' */}
            <div className="absolute inset-0 bg-gradient-to-t from-strava-black/85 via-strava-black/20 to-transparent opacity-90 group-hover/img:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <div className="inline-flex items-center space-x-1.5 self-start bg-strava-orange text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tekan SS untuk info lengkap</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTIK:
            Hanya ditampilkan jika PEMILIK yang melihat.
            Orang asing (POV orang lain) HANYA bisa menekan SS untuk info lengkap! */}
        {isOwner && (
          <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center border-t border-strava-border/50 pt-3">
            <div className="p-2 rounded-lg bg-strava-bg-subtle">
              <span className="text-[10px] uppercase font-bold text-strava-muted flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-0.5" /> Jarak
              </span>
              <p className="text-sm font-extrabold text-strava-dark mt-0.5">
                {Number(run.distanceKm).toFixed(2)} <span className="text-[10px] font-normal text-strava-muted">km</span>
              </p>
            </div>

            <div className="p-2 rounded-lg bg-strava-bg-subtle">
              <span className="text-[10px] uppercase font-bold text-strava-muted flex items-center justify-center">
                <Clock className="w-3 h-3 mr-0.5" /> Waktu
              </span>
              <p className="text-sm font-extrabold text-strava-dark mt-0.5">
                {formatDuration(run.durationMinutes, run.durationSeconds)}
              </p>
            </div>

            <div className="p-2 rounded-lg bg-strava-bg-subtle">
              <span className="text-[10px] uppercase font-bold text-strava-muted flex items-center justify-center">
                <Gauge className="w-3 h-3 mr-0.5" /> Pace
              </span>
              <p className="text-sm font-extrabold text-strava-orange mt-0.5">
                {run.paceFormatted.replace(' /km', '')}
                <span className="text-[10px] font-normal text-strava-muted"> /km</span>
              </p>
            </div>
          </div>
        )}

        {/* Catatan Pelari (Hanya di mode pemilik) */}
        {isOwner && run.notes && (
          <div className="px-4 pb-3">
            <p className="text-xs text-strava-muted-dark bg-strava-warm/50 border border-strava-warm-border/60 p-2 rounded-md line-clamp-2">
              "{run.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Footer Aksi Edit & Hapus (Hanya muncul jika PEMILIK) */}
      {isOwner && (
        <div className="p-3 bg-strava-bg-subtle border-t border-strava-border flex items-center justify-end space-x-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(run)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-strava-dark hover:text-strava-orange bg-strava-bg-card border border-strava-border hover:border-strava-orange/40 rounded-md transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>Ubah</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Hapus catatan lari "${run.title}"?`)) {
                  onDelete(run.id);
                }
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
