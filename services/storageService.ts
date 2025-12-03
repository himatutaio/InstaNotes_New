import { NoteData } from '../types';

// NOTE: In a production environment, this would be replaced by Firebase Firestore and Firebase Storage.
// For this standalone demo, we use localStorage to persist data so the app is functional without API keys.

const STORAGE_KEY = 'instanotes_data';
const USAGE_KEY = 'instanotes_free_usage';

// --- Usage Limit Logic ---

export const getUsageCount = (): number => {
  const count = localStorage.getItem(USAGE_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementUsageCount = (): number => {
  const current = getUsageCount();
  const newCount = current + 1;
  localStorage.setItem(USAGE_KEY, newCount.toString());
  return newCount;
};

export const MAX_FREE_USAGE = 3;

// --- Note Storage Logic ---

export const saveNote = async (note: NoteData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingData = localStorage.getItem(STORAGE_KEY);
      const notes: NoteData[] = existingData ? JSON.parse(existingData) : [];
      notes.unshift(note); // Add to top
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      resolve();
    }, 500); // Simulate network latency
  });
};

export const getNotes = async (): Promise<NoteData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingData = localStorage.getItem(STORAGE_KEY);
      const notes: NoteData[] = existingData ? JSON.parse(existingData) : [];
      resolve(notes);
    }, 300);
  });
};

export const deleteNote = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingData = localStorage.getItem(STORAGE_KEY);
      if (existingData) {
        const notes: NoteData[] = JSON.parse(existingData);
        const updatedNotes = notes.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      }
      resolve();
    }, 300);
  });
};