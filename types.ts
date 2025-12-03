export enum EducationLevel {
  VMBO_BB = "VMBO BB",
  VMBO_KB = "VMBO KB",
  VMBO_GT_TL = "VMBO GT/TL",
  MBO_1 = "MBO 1",
  MBO_2 = "MBO 2",
  MBO_3 = "MBO 3",
  MBO_4 = "MBO 4",
  HBO_BACHELOR = "HBO Bachelor",
  HBO_MASTER = "HBO Master",
  WO = "WO"
}

export interface DifficultWord {
  word: string;
  definition: string;
}

export interface NoteData {
  id: string;
  title: string;
  summaryPoints: string[];
  difficultWords: DifficultWord[];
  educationLevel: EducationLevel;
  timestamp: number;
  originalImageBase64?: string; // Storing base64 for demo purposes (In real app, use Storage URL)
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  message?: string;
}
