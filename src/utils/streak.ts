import { RunActivity, StreakStats } from '../types/run';
import { getTodayDateString } from './formatters';

function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateStreak(runs: RunActivity[]): StreakStats {
  const todayStr = getTodayDateString();
  const activeDates = new Set<string>();
  let totalDistance = 0;

  for (const run of runs) {
    if (run.date) {
      activeDates.add(run.date);
    }
    totalDistance += Number(run.distanceKm) || 0;
  }

  const sortedDates = Array.from(activeDates).sort();
  const ranToday = activeDates.has(todayStr);

  // Perhitungan Longest Streak
  let longestStreak = 0;
  let runningCount = 0;
  let previousDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = parseDateOnly(dateStr);
    if (!previousDate) {
      runningCount = 1;
    } else {
      const diffMs = currentDate.getTime() - previousDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningCount += 1;
      } else if (diffDays > 1) {
        runningCount = 1;
      }
    }
    if (runningCount > longestStreak) {
      longestStreak = runningCount;
    }
    previousDate = currentDate;
  }

  // Perhitungan Current Streak
  let currentStreak = 0;
  const today = parseDateOnly(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatDateString(yesterday);

  let checkDate: Date | null = null;

  if (ranToday) {
    checkDate = today;
  } else if (activeDates.has(yesterdayStr)) {
    // Pelari belum lari hari ini, tapi lari kemarin (streak masih berlanjut sampai hari ini berakhir)
    checkDate = yesterday;
  }

  if (checkDate) {
    let curr = new Date(checkDate);
    while (true) {
      const currStr = formatDateString(curr);
      if (activeDates.has(currStr)) {
        currentStreak += 1;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Status 7 hari terakhir untuk visual bar
  const recentDatesStatus: { date: string; label: string; ran: boolean }[] = [];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dStr = formatDateString(d);
    const dayName = dayNames[d.getDay()];
    recentDatesStatus.push({
      date: dStr,
      label: i === 0 ? 'Hari ini' : dayName,
      ran: activeDates.has(dStr),
    });
  }

  return {
    currentStreak,
    longestStreak,
    totalDistanceKm: Number(totalDistance.toFixed(2)),
    totalRuns: runs.length,
    ranToday,
    lastRunDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
    activeDates,
    recentDatesStatus,
  };
}
