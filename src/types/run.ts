export interface RunActivity {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  distanceKm: number;
  durationMinutes: number;
  durationSeconds: number;
  paceFormatted: string; // e.g. "05:24 /km"
  elevationGainMeters?: number;
  avgHeartRate?: number;
  notes?: string;
  screenshotDataUrl?: string; // High-resolution screenshot data
  createdAt: number;
  updatedAt: number;
}

export interface AthleteProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl: string;
  country: string;
  stravaUrl: string;
  bio: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDistanceKm: number;
  totalRuns: number;
  ranToday: boolean;
  lastRunDate: string | null;
  activeDates: Set<string>;
  recentDatesStatus: { date: string; label: string; ran: boolean }[];
}

export type ViewMode = 'runner' | 'public_pov';
