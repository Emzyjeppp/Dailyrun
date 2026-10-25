import React, { useState, useEffect } from 'react';
import { RunActivity } from '../types/run';
import { calculatePace, getTodayDateString } from '../utils/formatters';
import { X, Upload, Image, AlertCircle } from 'lucide-react';

interface RunFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (run: RunActivity) => void;
  initialData?: RunActivity | null;
}

export const RunFormModal: React.FC<RunFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState('06:00');
  const [distanceKm, setDistanceKm] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [durationSeconds, setDurationSeconds] = useState<string>('00');
  const [elevationGain, setElevationGain] = useState<string>('');
  const [avgHeartRate, setAvgHeartRate] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setTime(initialData.time || '06:00');
      setDistanceKm(String(initialData.distanceKm));
      setDurationMinutes(String(initialData.durationMinutes));
      setDurationSeconds(String(initialData.durationSeconds));
      setElevationGain(initialData.elevationGainMeters ? String(initialData.elevationGainMeters) : '');
      setAvgHeartRate(initialData.avgHeartRate ? String(initialData.avgHeartRate) : '');
      setNotes(initialData.notes || '');
      setScreenshotDataUrl(initialData.screenshotDataUrl || '');
    } else {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTitle('');
      setDate(getTodayDateString());
      setTime(`${hrs}:${mins}`);
      setDistanceKm('');
      setDurationMinutes('');
      setDurationSeconds('00');
      setElevationGain('');
      setAvgHeartRate('');
      setNotes('');
      setScreenshotDataUrl('');
    }
    setErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const currentPace = calculatePace(
    parseFloat(distanceKm) || 0,
    parseInt(durationMinutes, 10) || 0,
    parseInt(durationSeconds, 10) || 0
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setScreenshotDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distanceKm);
    const minNum = parseInt(durationMinutes, 10) || 0;
    const secNum = parseInt(durationSeconds, 10) || 0;

    if (!screenshotDataUrl) {
      setErrorMsg('Harap lampirkan screenshot Strava asli Anda sebagai bukti.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Judul aktivitas harus diisi.');
      return;
    }
    if (isNaN(distNum) || distNum <= 0) {
      setErrorMsg('Jarak lari harus berupa angka lebih besar dari 0.');
      return;
    }
    if (minNum === 0 && secNum === 0) {
      setErrorMsg('Durasi lari harus diisi.');
      return;
    }

    const runActivity: RunActivity = {
      id: initialData?.id || 'run-' + Date.now(),
      title: title.trim(),
      date,
      time,
      distanceKm: distNum,
      durationMinutes: minNum,
      durationSeconds: secNum,
      paceFormatted: currentPace,
      elevationGainMeters: elevationGain ? parseInt(elevationGain, 10) : undefined,
      avgHeartRate: avgHeartRate ? parseInt(avgHeartRate, 10) : undefined,
      notes: notes.trim() || undefined,
      screenshotDataUrl,
      createdAt: initialData?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(runActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-strava-black/75 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-strava-bg-card rounded-2xl border border-strava-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header Form */}
        <div className="px-6 py-4 bg-strava-bg-subtle border-b border-strava-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-strava-dark">
              {initialData ? 'Ubah Catatan Lari Real' : 'Catat Lari Harian & Bukti Strava Asli'}
            </h2>
            <p className="text-xs text-strava-muted mt-0.5">
              Lampirkan screenshot Strava asli dan isi metrik lari Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-strava-muted hover:text-strava-dark hover:bg-strava-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Screenshot Upload Strava Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-strava-dark uppercase tracking-wider flex items-center">
              <Image className="w-3.5 h-3.5 mr-1 text-strava-orange" />
              Upload Screenshot Strava Asli Anda (Wajib)
            </label>

            {screenshotDataUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-strava-border bg-strava-black aspect-[16/9] flex items-center justify-center">
                <img
                  src={screenshotDataUrl}
                  alt="Preview Tangkapan Layar Strava Asli"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <label className="cursor-pointer px-3 py-1 bg-strava-dark/90 hover:bg-strava-dark text-white rounded text-xs font-semibold backdrop-blur-xs transition-colors flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>Ganti File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer border-2 border-dashed border-strava-border hover:border-strava-orange/60 rounded-xl p-8 flex flex-col items-center justify-center bg-strava-bg-subtle text-center transition-colors">
                <Upload className="w-8 h-8 text-strava-orange mb-2" />
                <span className="text-xs font-bold text-strava-dark">
                  Klik untuk pilih atau seret screenshot Strava Anda
                </span>
                <span className="text-[11px] text-strava-muted mt-1">
                  Format gambar PNG, JPG, JPEG, WebP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* Judul Aktivitas */}
          <div>
            <label className="text-xs font-bold text-strava-dark block mb-1">
              Judul Sesi Lari
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Morning 5K Easy Run"
              className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
              required
            />
          </div>

          {/* Grid Tanggal & Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-strava-dark block mb-1">
                Tanggal Lari
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-strava-dark block mb-1">
                Waktu Mulai
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
              />
            </div>
          </div>

          {/* Grid Jarak, Durasi, dan Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-strava-dark block mb-1">
                Jarak Tempuh (km)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="misal: 5.20"
                className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-strava-dark block mb-1">
                Durasi (Menit : Detik)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="600"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="Menit"
                  className="px-2 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark text-center"
                  required
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  placeholder="Detik"
                  className="px-2 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-strava-muted-dark block mb-1">
                Kalkulasi Pace
              </label>
              <div className="px-3 py-2 rounded-lg bg-strava-orange-subtle border border-strava-orange/30 text-strava-orange font-bold text-sm text-center">
                {currentPace}
              </div>
            </div>
          </div>

          {/* Grid Elevasi & Heart Rate (Opsional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-strava-dark block mb-1">
                Elevasi Gain (meter) - Opsional
              </label>
              <input
                type="number"
                min="0"
                value={elevationGain}
                onChange={(e) => setElevationGain(e.target.value)}
                placeholder="misal: 15"
                className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-strava-dark block mb-1">
                Rata-rata Heart Rate (bpm) - Opsional
              </label>
              <input
                type="number"
                min="40"
                max="240"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(e.target.value)}
                placeholder="misal: 145"
                className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
              />
            </div>
          </div>

          {/* Catatan Sesi Lari */}
          <div>
            <label className="text-xs font-bold text-strava-dark block mb-1">
              Catatan Sesi Lari (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ceritakan rute lari, sepatu yang dipakai, atau kondisi fisik..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-strava-border focus:outline-none focus:ring-2 focus:ring-strava-orange/30 focus:border-strava-orange bg-strava-bg-card text-strava-dark"
            />
          </div>

          {/* Footer Tombol Simpan & Batal */}
          <div className="pt-3 border-t border-strava-border flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-strava-muted-dark hover:bg-strava-bg-subtle transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-strava-orange hover:bg-strava-orange-hover text-white text-xs font-bold shadow-xs transition-colors active:scale-95"
            >
              Simpan Aktivitas Real
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
