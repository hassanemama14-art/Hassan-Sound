import { AppSettings, Book, UserStats } from '../types';
import { DEFAULT_BOOKS } from '../data/defaultBooks';

const STORAGE_KEYS = {
  BOOKS: 'hassan_sound_books_v1',
  SETTINGS: 'hassan_sound_settings_v1',
  STATS: 'hassan_sound_stats_v1',
  ACTIVE_BOOK_ID: 'hassan_sound_active_book_id_v1'
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar', // Default to Arabic as requested for Hassan Sound identity, easily switchable to en
  theme: 'dark',
  readingTheme: 'dark',
  readerFontSize: 18,
  readerLineHeight: 1.8,
  defaultSpeed: 1.0,
  defaultPitch: 1.0,
  preferredVoiceLang: 'ar',
  autoAdvancePages: true,
  highlightSpokenText: true
};

const DEFAULT_STATS: UserStats = {
  minutesListenedTotal: 84,
  pagesReadTotal: 38,
  booksCompleted: 2,
  currentStreakDays: 5,
  lastSessionDate: new Date().toISOString().split('T')[0]
};

export const storageService = {
  getBooks(): Book[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(DEFAULT_BOOKS));
        return DEFAULT_BOOKS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BOOKS;
    }
  },

  saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (err) {
      console.error('Failed to save books:', err);
    }
  },

  addBook(newBook: Book): Book[] {
    const current = this.getBooks();
    const updated = [newBook, ...current.filter((b) => b.id !== newBook.id)];
    this.saveBooks(updated);
    return updated;
  },

  deleteBook(bookId: string): Book[] {
    const current = this.getBooks();
    const updated = current.filter((b) => b.id !== bookId);
    this.saveBooks(updated);
    return updated;
  },

  updateBookProgress(
    bookId: string,
    page: number,
    paragraphIndex: number,
    progressPercent: number
  ): Book[] {
    const current = this.getBooks();
    const updated = current.map((b) => {
      if (b.id === bookId) {
        return {
          ...b,
          currentPage: page,
          currentParagraphIndex: paragraphIndex,
          progressPercent: Math.min(100, Math.max(0, Math.round(progressPercent))),
          lastOpenedTimestamp: Date.now()
        };
      }
      return b;
    });
    this.saveBooks(updated);
    return updated;
  },

  getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  getStats(): UserStats {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!raw) return DEFAULT_STATS;
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_STATS;
    }
  },

  incrementListeningMinutes(minutes: number): UserStats {
    const current = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = current.lastSessionDate !== today;

    const updated: UserStats = {
      ...current,
      minutesListenedTotal: current.minutesListenedTotal + minutes,
      currentStreakDays: isNewDay ? current.currentStreakDays + 1 : current.currentStreakDays,
      lastSessionDate: today
    };

    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save stats:', err);
    }
    return updated;
  },

  getActiveBookId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_BOOK_ID);
  },

  setActiveBookId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BOOK_ID, id);
  }
};
