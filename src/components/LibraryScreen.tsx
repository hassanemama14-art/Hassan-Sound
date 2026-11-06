import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Trash2,
  BookOpen,
  Headphones,
  FileUp,
  FileText,
  Calendar,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Book } from '../types';

interface LibraryScreenProps {
  onOpenImport: () => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onOpenImport }) => {
  const { books, deleteBook, openPlayer, openReader, playBook, playback, language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'txt'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'title'>('recent');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter & Search
  const filteredBooks = books.filter((book) => {
    const titleMatch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.titleAr && book.titleAr.includes(searchQuery)) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!titleMatch) return false;

    if (filterType === 'pdf') return book.fileType === 'pdf';
    if (filterType === 'txt') return book.fileType === 'txt';
    return true;
  });

  // Sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'recent') {
      return (b.lastOpenedTimestamp || 0) - (a.lastOpenedTimestamp || 0);
    }
    if (sortBy === 'progress') {
      return b.progressPercent - a.progressPercent;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Top Bar: Title & Import Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t('myLibrary')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'ar'
              ? `إجمالي المستندات: ${books.length} كتاب ومستند مخزن محلياً`
              : `Total documents: ${books.length} stored securely offline`}
          </p>
        </div>

        <button
          onClick={onOpenImport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7657F6] hover:bg-[#6846f4] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#7657F6]/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <FileUp className="w-4 h-4" />
          <span>{t('quickImport')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#181c2e] p-3 rounded-2xl border border-slate-800/80">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchLibrary')}
            className="w-full bg-[#101321] text-sm text-white placeholder-slate-500 rounded-xl pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 border border-slate-700/60 focus:outline-none focus:border-[#7657F6] transition-colors"
          />
        </div>

        {/* Filter Segmented Buttons (Functional buttons) */}
        <div className="flex items-center gap-1 bg-[#101321] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#7657F6] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('allBooks')}
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'pdf'
                ? 'bg-[#7657F6] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('pdfOnly')}
          </button>
          <button
            onClick={() => setFilterType('txt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'txt'
                ? 'bg-[#7657F6] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('txtOnly')}
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 self-end md:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#101321] border border-slate-700/60 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#7657F6]"
          >
            <option value="recent">{t('sortByRecent')}</option>
            <option value="progress">{t('sortByProgress')}</option>
            <option value="title">{t('sortByTitle')}</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {sortedBooks.length === 0 ? (
        <div className="text-center py-16 bg-[#181c2e] border border-slate-800/80 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#7657F6]/10 text-[#9b82ff] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('emptyLibrary')}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {language === 'ar'
                ? 'استورد كتبك الإلكترونية بصيغة PDF أو مستندات TXT للاستماع إليها وقراءتها الآن.'
                : 'Import your PDF ebooks or text files to start listening and reading.'}
            </p>
          </div>
          <button
            onClick={onOpenImport}
            className="px-5 py-2.5 bg-[#7657F6] hover:bg-[#6846f4] text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            <span>{t('quickImport')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBooks.map((book) => {
            const isPlayingThis = playback.isPlaying && playback.currentBookId === book.id;
            return (
              <div
                key={book.id}
                className="bg-[#181c2e] border border-slate-800/80 hover:border-[#7657F6]/60 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-xl group"
              >
                <div className="flex gap-4">
                  {/* Book cover artwork */}
                  <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-bold text-slate-200 uppercase">
                      {book.fileType}
                    </div>
                  </div>

                  {/* Book Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-[#9b82ff] transition-colors">
                        {book.language === 'ar' && book.titleAr ? book.titleAr : book.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {book.language === 'ar' && book.authorAr ? book.authorAr : book.author}
                      </p>

                      {/* Clean unboxed metadata with · separator */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                        <span>{book.totalPages} pages</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.importedDate}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {t('pageOf')
                            .replace('{current}', String(book.currentPage))
                            .replace('{total}', String(book.totalPages))}
                        </span>
                        <span className="font-semibold text-white tabular-nums">
                          {book.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7657F6] to-[#9b82ff] rounded-full"
                          style={{ width: `${book.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scanned PDF warning notice if applicable */}
                {book.isScannedPdf && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{t('scannedPdfNotice')}</span>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {/* Play Audio Button */}
                    <button
                      onClick={() => {
                        playBook(book.id);
                        openPlayer(book.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7657F6] hover:bg-[#6846f4] text-white font-semibold text-xs transition-colors shadow-sm"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{isPlayingThis ? t('player') : t('play')}</span>
                    </button>

                    {/* Open Reader Button */}
                    <button
                      onClick={() => openReader(book.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101321] hover:bg-[#20263c] border border-slate-700/60 text-slate-200 hover:text-white font-medium text-xs transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t('reader')}</span>
                    </button>
                  </div>

                  {/* Remove confirmation / action */}
                  {confirmDeleteId === book.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteBook(book.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-1 text-[11px] bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
                      >
                        {language === 'ar' ? 'حذف' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(book.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove from library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
