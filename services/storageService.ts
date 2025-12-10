
import { NoteData } from '../types';

// NOTE: In a production environment, this would be replaced by Firebase Firestore and Firebase Storage.
// For this standalone demo, we use localStorage to persist data so the app is functional without API keys.

const STORAGE_KEY = 'instanotes_data';
const USAGE_PREFIX = 'instanotes_usage_';

// --- Usage Limit Logic ---

export const getUsageCount = (userId: string): number => {
  if (!userId) return 0;
  const count = localStorage.getItem(USAGE_PREFIX + userId);
  return count ? parseInt(count, 10) : 0;
};

export const incrementUsageCount = (userId: string): number => {
  if (!userId) return 0;
  const current = getUsageCount(userId);
  const newCount = current + 1;
  localStorage.setItem(USAGE_PREFIX + userId, newCount.toString());
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

export const updateNote = async (updatedNote: NoteData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingData = localStorage.getItem(STORAGE_KEY);
      if (existingData) {
        let notes: NoteData[] = JSON.parse(existingData);
        notes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      }
      resolve();
    }, 200); 
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

export const deleteNote = async (id: string): Promise<NoteData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingData = localStorage.getItem(STORAGE_KEY);
      let updatedNotes: NoteData[] = [];
      if (existingData) {
        const notes: NoteData[] = JSON.parse(existingData);
        updatedNotes = notes.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      } else {
        updatedNotes = [];
      }
      resolve(updatedNotes);
    }, 300);
  });
};
