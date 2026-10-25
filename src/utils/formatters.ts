/**
 * Utilitas pemformatan data lari dan tanggal
 * Sesuai standar no-emoji (hanya teks dan angka)
 */

export function calculatePace(distanceKm: number, minutes: number, seconds: number): string {
  if (distanceKm <= 0) return '00:00 /km';
  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) return '00:00 /km';

  const secondsPerKm = Math.round(totalSeconds / distanceKm);
  const paceMinutes = Math.floor(secondsPerKm / 60);
  const paceSeconds = secondsPerKm % 60;

  const mm = String(paceMinutes).padStart(2, '0');
  const ss = String(paceSeconds).padStart(2, '0');
  return `${mm}:${ss} /km`;
}

export function formatDuration(minutes: number, seconds: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = seconds;

  if (hrs > 0) {
    return `${hrs}j ${mins}m ${secs}d`;
  }
  return `${mins}m ${secs}d`;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;

  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
