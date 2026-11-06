export type Language = 'en' | 'ar';

export interface Book {
  id: string;
  title: string;
  titleAr?: string;
  author: string;
  authorAr?: string;
  fileType: 'pdf' | 'epub' | 'txt' | 'audiobook';
  coverUrl: string;
  importedDate: string;
  totalDurationSeconds?: number;
  totalPages: number;
  currentPage: number;
  currentSectionIndex: number;
  currentParagraphIndex: number;
  progressPercent: number;
  lastOpenedTimestamp: number;
  language: Language;
  content: BookPage[];
  isScannedPdf?: boolean;
}

export interface BookPage {
  pageNumber: number;
  text: string;
  paragraphs: string[];
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentBookId: string | null;
  currentPage: number;
  currentParagraphIndex: number;
  currentSentence: string;
  charIndex: number;
  speed: number;
  pitch: number;
  selectedVoiceUri: string | null;
  sleepTimerMinutes: number | null;
  sleepTimerSecondsLeft: number | null;
}

export interface TtsVoiceOption {
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'neutral';
  voiceURI: string;
  isDefault: boolean;
}

export interface AppSettings {
  language: Language;
  theme: 'dark' | 'light';
  readingTheme: 'dark' | 'sepia' | 'light';
  readerFontSize: number;
  readerLineHeight: number;
  defaultSpeed: number;
  defaultPitch: number;
  preferredVoiceLang: Language;
  autoAdvancePages: boolean;
  highlightSpokenText: boolean;
}

export interface UserStats {
  minutesListenedTotal: number;
  pagesReadTotal: number;
  booksCompleted: number;
  currentStreakDays: number;
  lastSessionDate: string;
}
