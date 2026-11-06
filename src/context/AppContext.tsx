import React, { createContext, useContext, useEffect, useRef, useState, useTransition } from 'react';
import { AppSettings, Book, Language, PlaybackState, TtsVoiceOption, UserStats } from '../types';
import { storageService } from '../services/storage';
import { ttsEngine } from '../services/ttsEngine';
import { parseDocumentFile } from '../services/pdfParser';

interface AppContextType {
  books: Book[];
  activeBook: Book | null;
  activeBookId: string | null;
  currentRoute: 'home' | 'library' | 'player' | 'reader' | 'settings' | 'code';
  playback: PlaybackState;
  voices: TtsVoiceOption[];
  settings: AppSettings;
  stats: UserStats;
  language: Language;
  t: (key: string) => string;
  isImporting: boolean;
  importError: string | null;
  playBook: (bookId: string, page?: number, paragraph?: number) => void;
  togglePlayPause: () => void;
  stopPlayback: () => void;
  nextParagraph: () => void;
  previousParagraph: () => void;
  seekToPage: (page: number) => void;
  setSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setVoice: (voiceURI: string | null) => void;
  setSleepTimer: (minutes: number | null) => void;
  importFile: (file: File) => Promise<boolean>;
  deleteBook: (bookId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setLanguage: (lang: Language) => void;
  setRoute: (route: 'home' | 'library' | 'player' | 'reader' | 'settings' | 'code') => void;
  openReader: (bookId: string) => void;
  openPlayer: (bookId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    appName: 'حسن ساوند',
    tagline: 'قارئ الكتب الصوتية وملفات PDF الاحترافي',
    home: 'الرئيسية',
    library: 'المكتبة',
    player: 'المشغل الصوتي',
    reader: 'قارئ النصوص',
    settings: 'الإعدادات',
    androidCode: 'مشروع أندرويد ستوديو',
    continueListening: 'متابعة الاستماع',
    recentlyAdded: 'أضيف حديثاً',
    quickImport: 'استيراد مستند',
    importDescription: 'يدعم ملفات PDF والكتب النصية TXT',
    statsMinutes: 'دقيقة استماع',
    statsPages: 'صفحة مقروءة',
    statsBooks: 'كتب مكتملة',
    statsStreak: 'أيام متتالية',
    searchLibrary: 'البحث في مكتبتي...',
    allBooks: 'الكل',
    pdfOnly: 'مستندات PDF',
    txtOnly: 'نصوص TXT',
    sortByRecent: 'الأحدث أولاً',
    sortByProgress: 'حسب التقدم',
    sortByTitle: 'حسب العنوان',
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    stop: 'إيقاف',
    previous: 'السابق',
    next: 'التالي',
    readingSpeed: 'سرعة القراءة',
    readingPitch: 'طبقة الصوت',
    voiceSelection: 'اختيار المعلق الصوتي',
    sleepTimer: 'مؤقت النوم',
    sleepTimerOff: 'إيقاف المؤقت',
    minutesRemaining: 'دقيقة متبقية',
    darkReader: 'الوضع الليلي',
    lightReader: 'الوضع النهاري',
    fontSize: 'حجم الخط',
    lineSpacing: 'تباعد الأسطر',
    exportAndroidProject: 'تنزيل مشروع أندرويد ستوديو (ZIP)',
    viewSourceCode: 'استعراض كود Kotlin & Compose',
    scannedPdfNotice: 'تنبيه: ملف PDF مصور. يرجى تفعيل التعرف الضوئي (OCR) لتحويل الصور لنصوص صوتية.',
    noVoicesDetected: 'لم يتم العثور على أصوات عربية مثبتة في المتصفح. يمكنك اختيار أصوات إضافية من إعدادات النظام.',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الكتاب من مكتبتك؟',
    emptyLibrary: 'المكتبة فارغة حالياً. قم باستيراد كتابك الأول!',
    welcomeMorning: 'صباح الخير',
    welcomeAfternoon: 'مساء الخير',
    welcomeEvening: 'أهلاً بك في حسن ساوند',
    pageOf: 'صفحة {current} من {total}',
    aboutText: 'تطبيق Hassan Sound هو تطبيق أندرويد متكامل لقراءة الكتب وملفات PDF صوتياً بأعلى جودة باستخدام محرك Text-to-Speech المتقدم، مع دعم كامل للغتين العربية والإنجليزية وتشغيل الصوت في الخلفية.'
  },
  en: {
    appName: 'Hassan Sound',
    tagline: 'Professional Audiobook & PDF Reader',
    home: 'Home',
    library: 'Library',
    player: 'Audio Player',
    reader: 'Document Reader',
    settings: 'Settings',
    androidCode: 'Android Project',
    continueListening: 'Continue Listening',
    recentlyAdded: 'Recently Added',
    quickImport: 'Import Document',
    importDescription: 'Supports PDF & TXT text files',
    statsMinutes: 'Minutes Listened',
    statsPages: 'Pages Read',
    statsBooks: 'Completed',
    statsStreak: 'Day Streak',
    searchLibrary: 'Search library...',
    allBooks: 'All Documents',
    pdfOnly: 'PDF Only',
    txtOnly: 'TXT Documents',
    sortByRecent: 'Most Recent',
    sortByProgress: 'By Progress',
    sortByTitle: 'Alphabetical',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    previous: 'Previous',
    next: 'Next',
    readingSpeed: 'Reading Speed',
    readingPitch: 'Speech Pitch',
    voiceSelection: 'Voice Selection',
    sleepTimer: 'Sleep Timer',
    sleepTimerOff: 'Timer Off',
    minutesRemaining: 'min left',
    darkReader: 'Dark Mode',
    lightReader: 'Light Mode',
    fontSize: 'Font Size',
    lineSpacing: 'Line Spacing',
    exportAndroidProject: 'Download Android Studio (.ZIP)',
    viewSourceCode: 'Inspect Kotlin & Compose Code',
    scannedPdfNotice: 'Notice: Scanned PDF without text layer. Optical Character Recognition (OCR) is required.',
    noVoicesDetected: 'No native Arabic TTS voice detected. Using system fallback or English voice.',
    deleteConfirm: 'Are you sure you want to remove this book from your library?',
    emptyLibrary: 'Your library is empty. Import your first book!',
    welcomeMorning: 'Good morning',
    welcomeAfternoon: 'Good afternoon',
    welcomeEvening: 'Welcome to Hassan Sound',
    pageOf: 'Page {current} of {total}',
    aboutText: 'Hassan Sound is a professional Android and cross-platform reading application designed to turn PDF documents and books into spoken audio using real Text-to-Speech engines, with background audio and Jetpack Compose architecture.'
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => storageService.getBooks());
  const [activeBookId, setActiveBookId] = useState<string | null>(() => {
    const saved = storageService.getActiveBookId();
    if (saved && books.some((b) => b.id === saved)) return saved;
    return books[0]?.id || null;
  });
  const [currentRoute, setCurrentRoute] = useState<'home' | 'library' | 'player' | 'reader' | 'settings' | 'code'>('home');
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [stats, setStats] = useState<UserStats>(() => storageService.getStats());
  const [voices, setVoices] = useState<TtsVoiceOption[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentBookId: activeBookId,
    currentPage: 1,
    currentParagraphIndex: 0,
    currentSentence: '',
    charIndex: 0,
    speed: settings.defaultSpeed,
    pitch: settings.defaultPitch,
    selectedVoiceUri: null,
    sleepTimerMinutes: null,
    sleepTimerSecondsLeft: null
  });

  const sleepTimerRef = useRef<number | null>(null);
  const listeningTrackerRef = useRef<number | null>(null);

  const activeBook = books.find((b) => b.id === activeBookId) || null;
  const language = settings.language;

  // Sync document RTL / LTR direction with language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Load voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const available = ttsEngine.getAvailableVoices();
      setVoices(available);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Configure TTS callbacks
  useEffect(() => {
    ttsEngine.setCallbacks({
      onBoundary: (charIndex) => {
        setPlayback((prev) => ({ ...prev, charIndex }));
      },
      onEnd: () => {
        handleParagraphFinished();
      },
      onStateChange: (isPlaying, isPaused) => {
        setPlayback((prev) => ({ ...prev, isPlaying, isPaused }));
      },
      onError: (err) => {
        console.warn('TTS Engine notice:', err);
      }
    });
  }, [activeBook, playback.currentPage, playback.currentParagraphIndex]);

  // Sleep timer interval
  useEffect(() => {
    if (playback.sleepTimerSecondsLeft !== null && playback.sleepTimerSecondsLeft > 0) {
      const timer = window.setInterval(() => {
        setPlayback((prev) => {
          if (prev.sleepTimerSecondsLeft === null) return prev;
          if (prev.sleepTimerSecondsLeft <= 1) {
            ttsEngine.stop();
            return {
              ...prev,
              isPlaying: false,
              isPaused: false,
              sleepTimerMinutes: null,
              sleepTimerSecondsLeft: null
            };
          }
          return {
            ...prev,
            sleepTimerSecondsLeft: prev.sleepTimerSecondsLeft - 1
          };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playback.sleepTimerSecondsLeft]);

  // Track listening stats every 60s of active playback
  useEffect(() => {
    if (playback.isPlaying) {
      const interval = window.setInterval(() => {
        const updated = storageService.incrementListeningMinutes(1);
        setStats(updated);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [playback.isPlaying]);

  const speakCurrentParagraph = (book: Book, pageNum: number, paraIdx: number) => {
    const page = book.content.find((p) => p.pageNumber === pageNum) || book.content[0];
    if (!page) return;

    const paragraph = page.paragraphs[paraIdx] || page.paragraphs[0] || page.text;
    if (!paragraph) return;

    setPlayback((prev) => ({
      ...prev,
      currentBookId: book.id,
      currentPage: pageNum,
      currentParagraphIndex: paraIdx,
      currentSentence: paragraph,
      charIndex: 0
    }));

    ttsEngine.speak({
      text: paragraph,
      lang: book.language,
      voiceURI: playback.selectedVoiceUri,
      rate: playback.speed,
      pitch: playback.pitch
    });

    // Update book progress in storage
    const totalParasInBook = book.content.reduce((sum, p) => sum + p.paragraphs.length, 0) || 1;
    const parasCompletedBefore = book.content
      .filter((p) => p.pageNumber < pageNum)
      .reduce((sum, p) => sum + p.paragraphs.length, 0);
    const overallProgress = Math.round(((parasCompletedBefore + paraIdx + 1) / totalParasInBook) * 100);

    const updatedBooks = storageService.updateBookProgress(
      book.id,
      pageNum,
      paraIdx,
      overallProgress
    );
    setBooks(updatedBooks);
  };

  const handleParagraphFinished = () => {
    if (!activeBook) return;

    const currentPageObj = activeBook.content.find((p) => p.pageNumber === playback.currentPage);
    if (!currentPageObj) return;

    const nextParaIdx = playback.currentParagraphIndex + 1;

    if (nextParaIdx < currentPageObj.paragraphs.length) {
      // Continue next paragraph on the same page
      speakCurrentParagraph(activeBook, playback.currentPage, nextParaIdx);
    } else {
      // Advance to next page if enabled
      const nextPageNum = playback.currentPage + 1;
      const nextPageObj = activeBook.content.find((p) => p.pageNumber === nextPageNum);

      if (nextPageObj && settings.autoAdvancePages) {
        speakCurrentParagraph(activeBook, nextPageNum, 0);
      } else {
        // Book finished or stopped at page end
        ttsEngine.stop();
        setPlayback((prev) => ({ ...prev, isPlaying: false, isPaused: false }));
      }
    }
  };

  const playBook = (bookId: string, page?: number, paragraph?: number) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    setActiveBookId(bookId);
    storageService.setActiveBookId(bookId);

    const targetPage = page ?? targetBook.currentPage ?? 1;
    const targetPara = paragraph ?? targetBook.currentParagraphIndex ?? 0;

    speakCurrentParagraph(targetBook, targetPage, targetPara);
  };

  const togglePlayPause = () => {
    if (playback.isPlaying) {
      ttsEngine.pause();
      setPlayback((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    } else if (playback.isPaused) {
      ttsEngine.resume();
      setPlayback((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      if (activeBook) {
        speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex);
      }
    }
  };

  const stopPlayback = () => {
    ttsEngine.stop();
    setPlayback((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentSentence: '',
      charIndex: 0
    }));
  };

  const nextParagraph = () => {
    if (!activeBook) return;
    const currentPageObj = activeBook.content.find((p) => p.pageNumber === playback.currentPage);
    if (!currentPageObj) return;

    if (playback.currentParagraphIndex + 1 < currentPageObj.paragraphs.length) {
      speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex + 1);
    } else if (playback.currentPage < activeBook.totalPages) {
      speakCurrentParagraph(activeBook, playback.currentPage + 1, 0);
    }
  };

  const previousParagraph = () => {
    if (!activeBook) return;
    if (playback.currentParagraphIndex > 0) {
      speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex - 1);
    } else if (playback.currentPage > 1) {
      const prevPageObj = activeBook.content.find((p) => p.pageNumber === playback.currentPage - 1);
      const lastParaIdx = prevPageObj ? Math.max(0, prevPageObj.paragraphs.length - 1) : 0;
      speakCurrentParagraph(activeBook, playback.currentPage - 1, lastParaIdx);
    }
  };

  const seekToPage = (page: number) => {
    if (!activeBook) return;
    const validPage = Math.max(1, Math.min(activeBook.totalPages, page));
    if (playback.isPlaying) {
      speakCurrentParagraph(activeBook, validPage, 0);
    } else {
      setPlayback((prev) => ({
        ...prev,
        currentPage: validPage,
        currentParagraphIndex: 0
      }));
    }
  };

  const setSpeed = (speed: number) => {
    setPlayback((prev) => ({ ...prev, speed }));
    if (playback.isPlaying && activeBook) {
      // Re-trigger current sentence with updated rate
      speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex);
    }
  };

  const setPitch = (pitch: number) => {
    setPlayback((prev) => ({ ...prev, pitch }));
    if (playback.isPlaying && activeBook) {
      speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex);
    }
  };

  const setVoice = (voiceURI: string | null) => {
    setPlayback((prev) => ({ ...prev, selectedVoiceUri: voiceURI }));
    if (playback.isPlaying && activeBook) {
      speakCurrentParagraph(activeBook, playback.currentPage, playback.currentParagraphIndex);
    }
  };

  const setSleepTimer = (minutes: number | null) => {
    if (minutes === null) {
      setPlayback((prev) => ({
        ...prev,
        sleepTimerMinutes: null,
        sleepTimerSecondsLeft: null
      }));
    } else {
      setPlayback((prev) => ({
        ...prev,
        sleepTimerMinutes: minutes,
        sleepTimerSecondsLeft: minutes * 60
      }));
    }
  };

  const importFile = async (file: File): Promise<boolean> => {
    setIsImporting(true);
    setImportError(null);
    try {
      const parsed = await parseDocumentFile(file);
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title: parsed.title,
        author: parsed.author,
        fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
        coverUrl: parsed.language === 'ar' ? '/src/assets/images/book_arabian_nights_1793928001056.jpg' : '/src/assets/images/book_the_prophet_1793928000970.jpg',
        importedDate: new Date().toISOString().split('T')[0],
        totalPages: parsed.pages.length,
        currentPage: 1,
        currentSectionIndex: 0,
        currentParagraphIndex: 0,
        progressPercent: 0,
        lastOpenedTimestamp: Date.now(),
        language: parsed.language,
        content: parsed.pages,
        isScannedPdf: parsed.isScanned
      };

      const updated = storageService.addBook(newBook);
      setBooks(updated);
      setActiveBookId(newBook.id);
      setIsImporting(false);
      return true;
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse document');
      setIsImporting(false);
      return false;
    }
  };

  const deleteBook = (bookId: string) => {
    if (playback.currentBookId === bookId && playback.isPlaying) {
      stopPlayback();
    }
    const updated = storageService.deleteBook(bookId);
    setBooks(updated);
    if (activeBookId === bookId) {
      setActiveBookId(updated[0]?.id || null);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const setLanguage = (lang: Language) => {
    updateSettings({ language: lang, preferredVoiceLang: lang });
  };

  const openReader = (bookId: string) => {
    setActiveBookId(bookId);
    storageService.setActiveBookId(bookId);
    setCurrentRoute('reader');
  };

  const openPlayer = (bookId: string) => {
    setActiveBookId(bookId);
    storageService.setActiveBookId(bookId);
    setCurrentRoute('player');
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        books,
        activeBook,
        activeBookId,
        currentRoute,
        playback,
        voices,
        settings,
        stats,
        language,
        t,
        isImporting,
        importError,
        playBook,
        togglePlayPause,
        stopPlayback,
        nextParagraph,
        previousParagraph,
        seekToPage,
        setSpeed,
        setPitch,
        setVoice,
        setSleepTimer,
        importFile,
        deleteBook,
        updateSettings,
        setLanguage,
        setRoute: setCurrentRoute,
        openReader,
        openPlayer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
