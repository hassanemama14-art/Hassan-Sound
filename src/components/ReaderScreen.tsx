import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Headphones,
  Sparkles,
  Type,
  Sun,
  Moon,
  Bookmark,
  Volume2
} from 'lucide-react';

export const ReaderScreen: React.FC = () => {
  const {
    activeBook,
    playback,
    playBook,
    togglePlayPause,
    seekToPage,
    settings,
    updateSettings,
    openPlayer,
    language,
    t
  } = useApp();

  const activeParagraphRef = useRef<HTMLParagraphElement | null>(null);

  // Auto-scroll to currently spoken paragraph when enabled
  useEffect(() => {
    if (playback.isPlaying && settings.highlightSpokenText && activeParagraphRef.current) {
      activeParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [playback.currentParagraphIndex, playback.currentPage, playback.isPlaying, settings.highlightSpokenText]);

  if (!activeBook) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">{t('emptyLibrary')}</h3>
      </div>
    );
  }

  const currentPageData =
    activeBook.content.find((p) => p.pageNumber === playback.currentPage) ||
    activeBook.content[0];

  const readingThemeStyles = {
    dark: 'bg-[#101321] text-slate-200 border-slate-800',
    sepia: 'bg-[#211d17] text-[#e8decb] border-[#383124]',
    light: 'bg-[#f8fafc] text-slate-800 border-slate-200'
  };

  const isCurrentPlayingBook = playback.isPlaying && playback.currentBookId === activeBook.id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 space-y-6">
      {/* Reader Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#181c2e] border border-slate-800 rounded-2xl">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            disabled={playback.currentPage <= 1}
            onClick={() => seekToPage(playback.currentPage - 1)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          <span className="text-xs font-semibold text-slate-300 tabular-nums px-2">
            {t('pageOf')
              .replace('{current}', String(playback.currentPage))
              .replace('{total}', String(activeBook.totalPages))}
          </span>

          <button
            disabled={playback.currentPage >= activeBook.totalPages}
            onClick={() => seekToPage(playback.currentPage + 1)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Font size & Theme adjustments */}
        <div className="flex items-center gap-2">
          {/* Font sizing */}
          <div className="flex items-center gap-1 bg-[#101321] px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() =>
                updateSettings({ readerFontSize: Math.max(14, settings.readerFontSize - 1) })
              }
              className="px-1.5 py-0.5 text-slate-400 hover:text-white font-bold"
              title="Decrease font size"
            >
              A-
            </button>
            <span className="text-slate-500 tabular-nums">{settings.readerFontSize}px</span>
            <button
              onClick={() =>
                updateSettings({ readerFontSize: Math.min(26, settings.readerFontSize + 1) })
              }
              className="px-1.5 py-0.5 text-slate-400 hover:text-white font-bold"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Reading Theme Toggle */}
          <button
            onClick={() => {
              const next =
                settings.readingTheme === 'dark'
                  ? 'sepia'
                  : settings.readingTheme === 'sepia'
                  ? 'light'
                  : 'dark';
              updateSettings({ readingTheme: next });
            }}
            className="p-2 rounded-xl bg-[#101321] border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle reader theme"
          >
            {settings.readingTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#9b82ff]" />
            ) : settings.readingTheme === 'sepia' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Switch to Full Audio Player */}
          <button
            onClick={() => openPlayer(activeBook.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7657F6] hover:bg-[#6846f4] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('player')}</span>
          </button>
        </div>
      </div>

      {/* Scanned PDF Warning Banner */}
      {activeBook.isScannedPdf && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">{language === 'ar' ? 'تنبيه مستند مصور (Scanned Document)' : 'Scanned Document Detected'}</div>
            <p className="text-amber-300/80 leading-relaxed">
              {t('scannedPdfNotice')}
            </p>
          </div>
        </div>
      )}

      {/* Main Document Reading Canvas */}
      <article
        className={`rounded-3xl p-6 sm:p-10 border shadow-2xl transition-all duration-300 ${
          readingThemeStyles[settings.readingTheme]
        }`}
      >
        {/* Document Header Inside Canvas */}
        <header className="border-b pb-5 mb-8 flex items-center justify-between gap-4 border-inherit/40">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {activeBook.language === 'ar' && activeBook.titleAr ? activeBook.titleAr : activeBook.title}
            </h1>
            <div className="text-xs opacity-75 mt-0.5">
              {activeBook.language === 'ar' && activeBook.authorAr ? activeBook.authorAr : activeBook.author}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isCurrentPlayingBook) {
                  togglePlayPause();
                } else {
                  playBook(activeBook.id, playback.currentPage, 0);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7657F6] text-white text-xs font-bold shadow-md hover:bg-[#6846f4] transition-all"
            >
              {isCurrentPlayingBook ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>{t('pause')}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  <span>{t('play')}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Page Content with Click-to-Read & Spoken Sentence Highlighting */}
        <div
          className="space-y-6 leading-relaxed transition-all"
          style={{
            fontSize: `${settings.readerFontSize}px`,
            lineHeight: `${settings.readerLineHeight}`
          }}
        >
          {currentPageData?.paragraphs.map((para, index) => {
            const isCurrentlySpoken =
              isCurrentPlayingBook &&
              playback.currentPage === currentPageData.pageNumber &&
              playback.currentParagraphIndex === index;

            return (
              <p
                key={index}
                ref={isCurrentlySpoken ? activeParagraphRef : null}
                onClick={() => playBook(activeBook.id, playback.currentPage, index)}
                className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isCurrentlySpoken
                    ? 'bg-[#7657F6]/20 ring-2 ring-[#7657F6] font-medium shadow-md'
                    : 'hover:bg-slate-500/10'
                }`}
                title="Click to start reading aloud from this paragraph"
              >
                {/* Voice play hover pill */}
                <span className="inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#9b82ff] float-right rtl:float-left mr-2 rtl:mr-0 rtl:ml-2 mt-1">
                  <Volume2 className="w-3.5 h-3.5" />
                </span>
                <span>{para}</span>
              </p>
            );
          })}
        </div>

        {/* Page Footer */}
        <footer className="mt-12 pt-6 border-t border-inherit/40 flex items-center justify-between text-xs opacity-60">
          <span>Hassan Sound Reader</span>
          <span>
            {t('pageOf')
              .replace('{current}', String(playback.currentPage))
              .replace('{total}', String(activeBook.totalPages))}
          </span>
        </footer>
      </article>

      {/* Bottom Page Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={playback.currentPage <= 1}
          onClick={() => seekToPage(playback.currentPage - 1)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('previous')}</span>
        </button>

        <button
          disabled={playback.currentPage >= activeBook.totalPages}
          onClick={() => seekToPage(playback.currentPage + 1)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span>{t('next')}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
