import React from 'react';
import { Plus, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  onOpenAddModal: () => void;
  athleteName: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenAddModal,
  athleteName,
}) => {
  return (
    <div className="bg-strava-bg-card rounded-2xl border border-dashed border-strava-border p-8 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-strava-orange-subtle text-strava-orange mx-auto flex items-center justify-center shadow-xs">
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.2 13.828h4.169" />
        </svg>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-strava-dark">
          Belum Ada Catatan Lari Real
        </h3>
        <p className="text-xs text-strava-muted max-w-md mx-auto leading-relaxed">
          Log lari untuk <strong>{athleteName}</strong> masih kosong. Tambahkan sesi lari asli Anda dengan mengunggah tangkapan layar Strava asli untuk memulai streak harian yang terverifikasi.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-strava-orange hover:bg-strava-orange-hover text-white text-xs font-bold shadow-xs transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lari Real Sekarang</span>
        </button>
      </div>

      <div className="pt-2 border-t border-strava-border/60 text-[11px] text-strava-muted flex items-center justify-center space-x-1">
        <ShieldAlert className="w-3.5 h-3.5 text-strava-orange" />
        <span>Hanya data lari asli Anda yang akan ditampilkan di profil publik</span>
      </div>
    </div>
  );
};
