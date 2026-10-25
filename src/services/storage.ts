import { RunActivity, AthleteProfile } from '../types/run';

const DB_NAME = 'dailyrun_db';
const DB_VERSION = 2;
const STORE_NAME = 'activities';
const PROFILE_STORE_NAME = 'athlete_profile';

export const DEFAULT_ATHLETE: AthleteProfile = {
  id: '1505671234',
  firstName: 'Jepri',
  lastName: 'Muhammad',
  fullName: 'Jepri Muhammad',
  profileImageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJYK75s9UGg4rTGHcJAqt2yfMhmrbqloDAe15orTxRMW4uA5Omo=s96-c',
  country: 'Indonesia',
  stravaUrl: 'https://www.strava.com/athletes/1505671234',
  bio: 'Atlet lari harian yang berdedikasi membangun konsistensi streak setiap hari dengan bukti autentik Strava.',
};

const OWNER_STORAGE_KEY = 'dailyrun_owner_auth';
const OWNER_PIN_KEY = 'dailyrun_owner_pin';
const DEFAULT_PIN = '211121';

export function isOwnerLoggedIn(): boolean {
  return localStorage.getItem(OWNER_STORAGE_KEY) === 'true';
}

export function setOwnerLoggedIn(status: boolean): void {
  if (status) {
    localStorage.setItem(OWNER_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(OWNER_STORAGE_KEY);
  }
}

export function verifyOwnerPin(inputPin: string): boolean {
  const savedPin = localStorage.getItem(OWNER_PIN_KEY) || DEFAULT_PIN;
  return inputPin.trim() === savedPin;
}

export function updateOwnerPin(newPin: string): void {
  localStorage.setItem(OWNER_PIN_KEY, newPin.trim());
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(PROFILE_STORE_NAME)) {
        db.createObjectStore(PROFILE_STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAthleteProfile(): Promise<AthleteProfile> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(PROFILE_STORE_NAME, 'readonly');
      const store = tx.objectStore(PROFILE_STORE_NAME);
      const request = store.get('current_athlete');

      request.onsuccess = () => {
        if (request.result && request.result.data) {
          resolve(request.result.data as AthleteProfile);
        } else {
          resolve(DEFAULT_ATHLETE);
        }
      };
      request.onerror = () => resolve(DEFAULT_ATHLETE);
    });
  } catch {
    return DEFAULT_ATHLETE;
  }
}

export async function saveAthleteProfile(profile: AthleteProfile): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PROFILE_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PROFILE_STORE_NAME);
    const request = store.put({ key: 'current_athlete', data: profile });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearDemoRuns(): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();

      req.onsuccess = () => {
        const keys = req.result;
        for (const key of keys) {
          if (typeof key === 'string' && key.startsWith('demo-')) {
            store.delete(key);
          }
        }
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore error
  }
}

export async function getAllRuns(): Promise<RunActivity[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      let runs = (request.result as RunActivity[]) || [];
      runs = runs.filter((r) => !r.id.startsWith('demo-'));

      runs.sort((a, b) => {
        if (b.date !== a.date) {
          return b.date.localeCompare(a.date);
        }
        return b.createdAt - a.createdAt;
      });
      resolve(runs);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function saveRun(run: RunActivity): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(run);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteRun(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllRuns(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
