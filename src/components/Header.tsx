import React from 'react';
import { useApp } from '../context/AppContext';
import { Headphones, Globe, Code2, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenCodeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenImport, onOpenCodeModal }) => {
  const { language, setLanguage, t, setRoute, currentRoute } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#101321]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with Soundwave Motif */}
        <button
          onClick={() => setRoute('home')}
          className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7657F6] rounded-lg p-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7657F6] to-[#9b82ff] flex items-center justify-center shadow-lg shadow-[#7657F6]/20 shrink-0 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              {language === 'ar' ? 'حسن ساوند' : 'Hassan Sound'}
            </span>
            <span className="text-[11px] text-slate-400 font-normal hidden sm:inline whitespace-nowrap">
              {language === 'ar' ? 'قارئ الكتب الصوتية و PDF' : 'Audiobook & PDF Reader'}
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line desktop navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setRoute('home')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentRoute === 'home' ? 'text-[#9b82ff] font-semibold' : ''
            }`}
          >
            {t('home')}
          </button>
          <button
            onClick={() => setRoute('library')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentRoute === 'library' ? 'text-[#9b82ff] font-semibold' : ''
            }`}
          >
            {t('library')}
          </button>
          <button
            onClick={() => setRoute('player')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentRoute === 'player' ? 'text-[#9b82ff] font-semibold' : ''
            }`}
          >
            {t('player')}
          </button>
          <button
            onClick={() => setRoute('reader')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentRoute === 'reader' ? 'text-[#9b82ff] font-semibold' : ''
            }`}
          >
            {t('reader')}
          </button>
        </nav>

        {/* Zone 3: Actions & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Android Studio Project / Code Inspector trigger */}
          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 rounded-xl transition-all hover:border-[#7657F6]/50 shadow-sm"
            title="Inspect Android Studio (Kotlin & Jetpack Compose) Project"
          >
            <Code2 className="w-3.5 h-3.5 text-[#9b82ff]" />
            <span className="hidden sm:inline">Android Studio</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 rounded-xl transition-all"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Primary Action: Import Document */}
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#7657F6] hover:bg-[#6846f4] active:scale-[0.98] rounded-xl shadow-md shadow-[#7657F6]/25 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t('quickImport')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
