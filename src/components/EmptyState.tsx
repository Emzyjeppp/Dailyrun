import React from 'react';
import { Plus, CalendarX, ShieldCheck } from 'lucide-react';

interface EmptyStateProps {
  onOpenAddModal: () => void;
  athleteName: string;
  isOwner: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenAddModal,
  athleteName,
  isOwner,
}) => {
  return (
    <div className="bg-strava-bg-card rounded-2xl border border-dashed border-strava-border p-8 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-strava-orange-subtle text-strava-orange mx-auto flex items-center justify-center shadow-xs">
        {isOwner ? (
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.2 13.828h4.169" />
          </svg>
        ) : (
          <CalendarX className="w-8 h-8 text-strava-orange" />
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-strava-dark">
          {isOwner ? 'Mulai Streak Lari Pertama Anda' : 'Belum Ada Aktivitas Lari'}
        </h3>
        <p className="text-xs text-strava-muted max-w-md mx-auto leading-relaxed">
          {isOwner
            ? `Log lari untuk ${athleteName} masih kosong. Tambahkan sesi lari asli Anda dengan mengunggah tangkapan layar Strava asli untuk memulai streak harian.`
            : `Atlet ${athleteName} belum mencatat aktivitas lari pada jurnal ini. Setelah sesi dicatat, bukti screenshot Strava dan metrik lengkap akan langsung dapat dilihat di sini.`}
        </p>
      </div>

      {/* Tombol Tambah HANYA muncul untuk Pemilik, ORANG ASING TIDAK BISA MELIHAT ATAU MENAMBAH */}
      {isOwner ? (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-strava-orange hover:bg-strava-orange-hover text-white text-xs font-bold shadow-xs transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Lari Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 flex items-center justify-center space-x-1.5 text-xs text-strava-muted">
          <ShieldCheck className="w-4 h-4 text-strava-green" />
          <span>Profil Terverifikasi Strava</span>
        </div>
      )}
    </div>
  );
};
