import { useState, useEffect } from 'react';
import { RunActivity, AthleteProfile } from './types/run';
import {
  getAllRuns,
  saveRun,
  deleteRun,
  getAthleteProfile,
  DEFAULT_ATHLETE,
  clearDemoRuns,
  clearAllRuns,
  isOwnerLoggedIn,
  setOwnerLoggedIn,
} from './services/storage';
import { calculateStreak } from './utils/streak';
import { Header } from './components/Header';
import { StreakBanner } from './components/StreakBanner';
import { RunCard } from './components/RunCard';
import { RunFormModal } from './components/RunFormModal';
import { RunDetailModal } from './components/RunDetailModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { EmptyState } from './components/EmptyState';
import { Plus, RefreshCw, Filter, Trash2, ShieldCheck } from 'lucide-react';

export function App() {
  const [runs, setRuns] = useState<RunActivity[]>([]);
  const [athlete, setAthlete] = useState<AthleteProfile>(DEFAULT_ATHLETE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [editingRun, setEditingRun] = useState<RunActivity | null>(null);
  const [selectedRunForDetail, setSelectedRunForDetail] = useState<RunActivity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        await clearDemoRuns();

        // Periksa apakah ini link yang dibagikan ke publik (?share=true)
        const urlParams = new URLSearchParams(window.location.search);
        const isSharedLink = urlParams.get('share') === 'true' || window.location.hash === '#share';

        if (isSharedLink) {
          // Jika dibuka dari link share publik, kunci ke mode orang asing (read-only)
          setIsOwner(false);
        } else {
          // Jika di browser Anda sendiri, baca status login pemilik (atau setel aktif secara bawaan)
          const loggedIn = isOwnerLoggedIn();
          // Jika belum diset di browser pemilik pertama kali, defaultkan aktif untuk kemudahan Anda
          if (localStorage.getItem('dailyrun_owner_initialized') === null) {
            setOwnerLoggedIn(true);
            localStorage.setItem('dailyrun_owner_initialized', 'true');
            setIsOwner(true);
          } else {
            setIsOwner(loggedIn);
          }
        }

        const [loadedAthlete, loadedRuns] = await Promise.all([
          getAthleteProfile(),
          getAllRuns(),
        ]);
        setAthlete(loadedAthlete);
        setRuns(loadedRuns);
      } catch (err) {
        console.error('Gagal membuka database:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const stats = calculateStreak(runs);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=true`;
    navigator.clipboard.writeText(shareUrl);
  };

  const handleLogoutOwner = () => {
    setOwnerLoggedIn(false);
    setIsOwner(false);
  };

  const handleClearAllRuns = async () => {
    if (window.confirm('Kosongkan seluruh riwayat lari yang tersimpan?')) {
      try {
        setIsLoading(true);
        await clearAllRuns();
        setRuns([]);
        setSelectedRunForDetail(null);
      } catch (err) {
        console.error('Gagal mengosongkan data:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveRun = async (newOrUpdatedRun: RunActivity) => {
    try {
      await saveRun(newOrUpdatedRun);
      const updatedList = await getAllRuns();
      setRuns(updatedList);
      setEditingRun(null);
    } catch (err) {
      console.error('Gagal menyimpan aktivitas lari:', err);
      alert('Gagal menyimpan aktivitas lari.');
    }
  };

  const handleDeleteRun = async (id: string) => {
    try {
      await deleteRun(id);
      const updatedList = await getAllRuns();
      setRuns(updatedList);
      if (selectedRunForDetail?.id === id) {
        setSelectedRunForDetail(null);
      }
    } catch (err) {
      console.error('Gagal menghapus aktivitas:', err);
      alert('Gagal menghapus aktivitas lari.');
    }
  };

  const filteredRuns = runs.filter((run) => {
    const q = searchQuery.toLowerCase();
    return run.title.toLowerCase().includes(q) || run.date.includes(q);
  });

  return (
    <div className="min-h-screen bg-strava-bg flex flex-col text-strava-dark">
      {/* Header Utama: Menyesuaikan apakah Pemilik atau Orang Asing (POV Publik) */}
      <Header
        athlete={athlete}
        isOwner={isOwner}
        onOpenAddModal={() => {
          setEditingRun(null);
          setIsFormModalOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogoutOwner={handleLogoutOwner}
        onCopyShareLink={handleCopyShareLink}
        currentStreak={stats.currentStreak}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isLoading ? (
          <div className="p-16 text-center text-strava-muted flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-strava-orange animate-spin" />
            <p className="text-sm font-semibold">Memuat rekam jejak lari...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Banner Status Streak & Statistik */}
            <StreakBanner
              stats={stats}
              onOpenAddModal={() => {
                setEditingRun(null);
                setIsFormModalOpen(true);
              }}
              isRunnerMode={isOwner}
            />

            {/* Bar Filter & Aksi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-strava-dark">
                  Log Aktivitas Lari
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-strava-bg-subtle text-strava-muted-dark border border-strava-border font-medium">
                  {runs.length} Sesi Terverifikasi
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search input */}
                <div className="relative">
                  <Filter className="w-3.5 h-3.5 text-strava-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari sesi atau tanggal..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-strava-border bg-strava-bg-card text-strava-dark focus:outline-none focus:ring-1 focus:ring-strava-orange"
                  />
                </div>

                {isOwner && runs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllRuns}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-strava-border bg-strava-bg-card hover:bg-red-50 hover:text-red-600 text-strava-muted-dark text-xs font-semibold transition-colors"
                    title="Kosongkan seluruh riwayat lari"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Kosongkan</span>
                  </button>
                )}

                {/* Tombol Tambah Lari (Hanya Pemilik) */}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRun(null);
                      setIsFormModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-strava-orange hover:bg-strava-orange-hover text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Lari</span>
                  </button>
                )}
              </div>
            </div>

            {/* List atau Empty State */}
            {runs.length === 0 ? (
              <EmptyState
                onOpenAddModal={() => {
                  setEditingRun(null);
                  setIsFormModalOpen(true);
                }}
                athleteName={athlete.fullName}
              />
            ) : filteredRuns.length === 0 ? (
              <div className="p-12 text-center bg-strava-bg-card rounded-xl border border-strava-border text-strava-muted">
                <p className="text-xs font-semibold">Tidak ada sesi lari yang cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRuns.map((run) => (
                  <RunCard
                    key={run.id}
                    run={run}
                    isOwner={isOwner}
                    onSelect={(selected) => setSelectedRunForDetail(selected)}
                    onEdit={(selected) => {
                      setEditingRun(selected);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={handleDeleteRun}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Bersih */}
      <footer className="border-t border-strava-border bg-strava-bg-card py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-strava-muted">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-strava-dark">DAILYRUN</span>
            <span>•</span>
            <a
              href={athlete.stravaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-strava-orange hover:underline font-semibold"
            >
              {athlete.fullName} ({athlete.country})
            </a>
          </div>

          <div className="flex items-center space-x-3 text-strava-muted-dark">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-strava-green" />
              <span>Verifikasi Strava Proof</span>
            </span>
            <span>•</span>
            <span>ID Atlet: {athlete.id}</span>
          </div>
        </div>
      </footer>

      {/* Modal Form Tambah/Ubah Lari (Hanya Pemilik) */}
      {isOwner && (
        <RunFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingRun(null);
          }}
          onSave={handleSaveRun}
          initialData={editingRun}
        />
      )}

      {/* Modal Detail / Inspeksi Tangkapan Layar (Bisa Dibuka Siapa Saja saat Klik Screenshot) */}
      <RunDetailModal
        run={selectedRunForDetail}
        athlete={athlete}
        onClose={() => setSelectedRunForDetail(null)}
      />

      {/* Modal Login Akses Pemilik (Jika Anda Membuka dari Perangkat Baru atau Setelah Logout) */}
      <OwnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsOwner(true)}
      />
    </div>
  );
}

export default App;
