import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  BookOpen,
  Clock,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  FileUp,
  Headphones,
  CheckCircle2
} from 'lucide-react';

interface HomeScreenProps {
  onOpenImport: () => void;
  onOpenCodeModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenImport, onOpenCodeModal }) => {
  const {
    books,
    activeBook,
    playback,
    stats,
    language,
    t,
    playBook,
    togglePlayPause,
    openPlayer,
    openReader,
    setRoute
  } = useApp();

  // Greeting by current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t('welcomeMorning')
      : currentHour < 18
      ? t('welcomeAfternoon')
      : t('welcomeEvening');

  const featuredBook = activeBook || books[0];
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8 pb-24 md:pb-12 max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome & Brand Section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9b82ff] tracking-wide mb-1">
            <span>{greeting}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'ar' ? 'جلسة القراءة اليومية' : 'Daily Reading Session'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {language === 'ar' ? 'مرحباً بك في حسن ساوند' : 'Welcome to Hassan Sound'}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {language === 'ar'
              ? 'حوّل كتبك ومستندات PDF إلى قراءة صوتية طبيعية باللغتين العربية والإنجليزية.'
              : 'Transform books and PDF documents into natural spoken audio in Arabic and English.'}
          </p>
        </div>

        {/* Quick SAF Import Trigger Card */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-3 px-4 py-3 bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 hover:border-[#7657F6]/60 rounded-2xl shadow-lg transition-all text-left group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#7657F6]/15 group-hover:bg-[#7657F6]/25 text-[#9b82ff] flex items-center justify-center transition-colors">
            <FileUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-[#9b82ff] transition-colors">
              {t('quickImport')}
            </div>
            <div className="text-xs text-slate-400">{t('importDescription')}</div>
          </div>
        </button>
      </section>

      {/* Reading Statistics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#181c2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t('statsMinutes')}</span>
            <Clock className="w-4 h-4 text-[#9b82ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {stats.minutesListenedTotal}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {language === 'ar' ? '+18 دقيقة هذا الأسبوع' : '+18m this week'}
          </div>
        </div>

        <div className="bg-[#181c2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t('statsPages')}</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {stats.pagesReadTotal}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {language === 'ar' ? 'عبر المستندات والكتب' : 'Across documents'}
          </div>
        </div>

        <div className="bg-[#181c2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t('statsBooks')}</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {stats.booksCompleted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {language === 'ar' ? 'في مكتبتك الشخصية' : 'In your library'}
          </div>
        </div>

        <div className="bg-[#181c2e] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">{t('statsStreak')}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {stats.currentStreakDays}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {language === 'ar' ? 'استمرارية ممتازة' : 'Active consistency'}
          </div>
        </div>
      </section>

      {/* Continue Reading Large Hero Card */}
      {featuredBook && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181c2e] via-[#1d2238] to-[#251f47] border border-slate-700/60 shadow-2xl p-6 sm:p-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#7657F6]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Book Cover Artwork with 3:4 aspect ratio */}
            <div className="relative w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shrink-0 group border border-slate-700/50">
              <img
                src={featuredBook.coverUrl}
                alt={featuredBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button
                onClick={() => {
                  if (playback.isPlaying && playback.currentBookId === featuredBook.id) {
                    togglePlayPause();
                  } else {
                    playBook(featuredBook.id);
                  }
                }}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#7657F6] hover:bg-[#6846f4] text-white flex items-center justify-center shadow-xl shadow-black/50 active:scale-95 transition-transform"
                title={playback.isPlaying && playback.currentBookId === featuredBook.id ? 'Pause' : 'Play'}
              >
                {playback.isPlaying && playback.currentBookId === featuredBook.id ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Book Info & Playback Controls */}
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9b82ff] mb-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{t('continueListening')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase text-[11px] text-slate-400">{featuredBook.fileType}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {featuredBook.language === 'ar' && featuredBook.titleAr ? featuredBook.titleAr : featuredBook.title}
                </h2>
                <div className="text-sm text-slate-300 mt-1">
                  {featuredBook.language === 'ar' && featuredBook.authorAr ? featuredBook.authorAr : featuredBook.author}
                </div>

                {/* Scanned PDF warning notice if applicable */}
                {featuredBook.isScannedPdf && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{t('scannedPdfNotice')}</span>
                  </div>
                )}

                {/* Progress bar and metadata */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {t('pageOf')
                        .replace('{current}', String(featuredBook.currentPage))
                        .replace('{total}', String(featuredBook.totalPages))}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {featuredBook.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7657F6] to-[#9b82ff] rounded-full transition-all duration-300"
                      style={{ width: `${featuredBook.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Resume Audiobook vs Read Text */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    if (playback.isPlaying && playback.currentBookId === featuredBook.id) {
                      openPlayer(featuredBook.id);
                    } else {
                      playBook(featuredBook.id);
                      openPlayer(featuredBook.id);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7657F6] hover:bg-[#6846f4] text-white font-semibold text-sm shadow-lg shadow-[#7657F6]/30 active:scale-95 transition-all"
                >
                  <Headphones className="w-4 h-4" />
                  <span>{playback.isPlaying ? t('player') : t('play')}</span>
                </button>

                <button
                  onClick={() => openReader(featuredBook.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/70 text-slate-200 hover:text-white font-medium text-sm transition-all"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{t('reader')}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recently Added Books Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{t('recentlyAdded')}</h3>
            <div className="text-xs text-slate-400 mt-0.5">
              {books.length} {language === 'ar' ? 'كتب ومستندات في مكتبتك' : 'documents in library'}
            </div>
          </div>

          <button
            onClick={() => setRoute('library')}
            className="flex items-center gap-1 text-xs font-semibold text-[#9b82ff] hover:text-[#b4a1ff] transition-colors"
          >
            <span>{t('myLibrary')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {books.map((book) => {
            const isCurrentPlaying = playback.isPlaying && playback.currentBookId === book.id;
            return (
              <div
                key={book.id}
                className="bg-[#181c2e] border border-slate-800/80 hover:border-[#7657F6]/60 rounded-2xl p-3 flex flex-col justify-between group transition-all shadow-md hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-slate-800">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-slate-200 uppercase">
                    {book.fileType}
                  </div>
                  <button
                    onClick={() => {
                      if (isCurrentPlaying) {
                        togglePlayPause();
                      } else {
                        playBook(book.id);
                        openPlayer(book.id);
                      }
                    }}
                    className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-[#7657F6] hover:bg-[#6846f4] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all opacity-90 group-hover:opacity-100"
                    title="Play"
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#9b82ff] transition-colors">
                    {book.language === 'ar' && book.titleAr ? book.titleAr : book.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                    <span>{book.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.totalPages} p</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{book.progressPercent}%</span>
                  <button
                    onClick={() => openReader(book.id)}
                    className="hover:text-white transition-colors"
                  >
                    {t('reader')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Android Native Architecture Spotlight Card */}
      <section className="rounded-2xl bg-gradient-to-r from-[#181c2e] to-[#201d3b] border border-slate-700/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7657F6]/20 border border-[#7657F6]/40 flex items-center justify-center text-[#9b82ff] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              {language === 'ar' ? 'بنية تطبيق أندرويد متكاملة (Kotlin & Compose)' : 'Production Android Project (Kotlin & Compose)'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              {language === 'ar'
                ? 'مشروع أندرويد كامل مبني بـ Jetpack Compose و Room Database و Foreground Service لتشغيل الصوت في الخلفية وقراءة ملفات PDF.'
                : 'Complete Android Studio project with Jetpack Compose, Room DB, Foreground Media Service, and PDFBox extraction.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCodeModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7657F6] hover:bg-[#6846f4] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#7657F6]/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
        >
          <span>{t('viewSourceCode')}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
