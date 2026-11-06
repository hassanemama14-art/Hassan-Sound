import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  Clock,
  Gauge,
  Sliders,
  ChevronDown,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

export const PlayerScreen: React.FC = () => {
  const {
    activeBook,
    playback,
    voices,
    togglePlayPause,
    nextParagraph,
    previousParagraph,
    seekToPage,
    setSpeed,
    setPitch,
    setVoice,
    setSleepTimer,
    openReader,
    setRoute,
    language,
    t
  } = useApp();

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);

  if (!activeBook) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">{t('emptyLibrary')}</h3>
        <button
          onClick={() => setRoute('library')}
          className="px-5 py-2.5 bg-[#7657F6] text-white rounded-xl text-sm font-semibold"
        >
          {t('library')}
        </button>
      </div>
    );
  }

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const timerOptions = [
    { label: t('sleepTimerOff'), value: null },
    { label: '5 min', value: 5 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 }
  ];

  // Voices available for current book's language
  const languagePrefix = activeBook.language === 'ar' ? 'ar' : 'en';
  const relevantVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(languagePrefix)
  );
  const hasVoice = relevantVoices.length > 0;

  // Selected voice name
  const currentVoiceObj = voices.find((v) => v.voiceURI === playback.selectedVoiceUri);
  const currentVoiceName = currentVoiceObj
    ? currentVoiceObj.name
    : hasVoice
    ? relevantVoices[0].name
    : language === 'ar'
    ? 'محرك الصوت الافتراضي'
    : 'System Default Voice';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 flex flex-col items-center justify-between min-h-[calc(100vh-5rem)]">
      {/* Top Bar inside Player: Back to Reader / Library */}
      <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <button
          onClick={() => setRoute('home')}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('home')}</span>
        </button>

        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {activeBook.fileType} Audiobook
        </span>

        <button
          onClick={() => openReader(activeBook.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#9b82ff]" />
          <span>{t('reader')}</span>
        </button>
      </div>

      {/* Main Center Area: Large Book Cover & Pulse Effect */}
      <div className="my-6 flex flex-col items-center w-full max-w-sm">
        <div className="relative w-56 sm:w-64 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[#7657F6]/15 border border-slate-700/60 group">
          <img
            src={activeBook.coverUrl}
            alt={activeBook.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              playback.isPlaying ? 'scale-105' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
          {playback.isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-white">
                <Volume2 className="w-3.5 h-3.5 text-[#9b82ff] animate-pulse" />
                <span>{language === 'ar' ? 'جارٍ الاستماع الآن' : 'Playing Now'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Title, Author & Metadata */}
        <div className="text-center mt-6 w-full space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight line-clamp-1">
            {activeBook.language === 'ar' && activeBook.titleAr ? activeBook.titleAr : activeBook.title}
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            {activeBook.language === 'ar' && activeBook.authorAr ? activeBook.authorAr : activeBook.author}
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <span>
              {t('pageOf')
                .replace('{current}', String(playback.currentPage))
                .replace('{total}', String(activeBook.totalPages))}
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeBook.language.toUpperCase()}</span>
          </div>
        </div>

        {/* Currently Spoken Paragraph Preview (distraction-free) */}
        {playback.currentSentence && (
          <div className="mt-4 w-full p-3.5 rounded-2xl bg-[#181c2e] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed text-center italic shadow-inner line-clamp-2">
            "{playback.currentSentence}"
          </div>
        )}

        {/* Missing Voice Warning Banner if applicable */}
        {!hasVoice && (
          <div className="mt-3 w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('noVoicesDetected')}</span>
          </div>
        )}
      </div>

      {/* Progress Scrubber */}
      <div className="w-full space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 tabular-nums">
          <span>
            {language === 'ar' ? `صفحة ${playback.currentPage}` : `Page ${playback.currentPage}`}
          </span>
          <span className="font-semibold text-white">{activeBook.progressPercent}%</span>
          <span>
            {language === 'ar' ? `من ${activeBook.totalPages}` : `of ${activeBook.totalPages}`}
          </span>
        </div>

        {/* Interactive page scrubber bar */}
        <div className="relative w-full h-3 flex items-center cursor-pointer group">
          <input
            type="range"
            min={1}
            max={activeBook.totalPages}
            value={playback.currentPage}
            onChange={(e) => seekToPage(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#7657F6]"
          />
        </div>
      </div>

      {/* Primary Playback Controls */}
      <div className="w-full flex items-center justify-center gap-6 sm:gap-8 mb-6">
        {/* Previous Paragraph */}
        <button
          onClick={previousParagraph}
          className="p-3 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-2xl transition-colors active:scale-95 min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="Previous section"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        {/* Main Play / Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#7657F6] to-[#9b82ff] text-white flex items-center justify-center shadow-xl shadow-[#7657F6]/30 hover:scale-105 active:scale-95 transition-all"
          title={playback.isPlaying ? t('pause') : t('play')}
        >
          {playback.isPlaying ? (
            <Pause className="w-8 h-8 fill-white" />
          ) : (
            <Play className="w-8 h-8 fill-white ml-1" />
          )}
        </button>

        {/* Next Paragraph */}
        <button
          onClick={nextParagraph}
          className="p-3 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-2xl transition-colors active:scale-95 min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="Next section"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Auxiliary Controls: Speed, Sleep Timer, Voice Selector */}
      <div className="w-full grid grid-cols-3 gap-3">
        {/* Speed Selector Button */}
        <button
          onClick={() => setShowSpeedModal(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-800/80 text-center transition-colors group"
        >
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#9b82ff] transition-colors mb-1">
            <Gauge className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{t('readingSpeed')}</span>
          </div>
          <span className="text-sm font-bold text-white tabular-nums">{playback.speed}x</span>
        </button>

        {/* Sleep Timer Button */}
        <button
          onClick={() => setShowTimerModal(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-800/80 text-center transition-colors group"
        >
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#9b82ff] transition-colors mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{t('sleepTimer')}</span>
          </div>
          <span className="text-sm font-bold text-white tabular-nums">
            {playback.sleepTimerSecondsLeft !== null
              ? `${Math.ceil(playback.sleepTimerSecondsLeft / 60)} ${t('minutesRemaining')}`
              : t('sleepTimerOff')}
          </span>
        </button>

        {/* Voice Selector Button */}
        <button
          onClick={() => setShowVoiceModal(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181c2e] hover:bg-[#20263c] border border-slate-800/80 text-center transition-colors group"
        >
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-[#9b82ff] transition-colors mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{t('voice')}</span>
          </div>
          <span className="text-xs font-bold text-white truncate max-w-[90px]">
            {currentVoiceName.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Voice Selection Sheet / Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#181c2e] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('voiceSelection')}</h3>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              <button
                onClick={() => {
                  setVoice(null);
                  setShowVoiceModal(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                  playback.selectedVoiceUri === null
                    ? 'border-[#7657F6] bg-[#7657F6]/10 text-white'
                    : 'border-slate-800 bg-[#101321] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">
                    {language === 'ar' ? 'الصوت التلقائي الأنسب' : 'Best Automatic Voice'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {language === 'ar' ? 'محرك النظام الافتراضي' : 'System Default Engine'}
                  </div>
                </div>
                {playback.selectedVoiceUri === null && <Check className="w-4 h-4 text-[#9b82ff]" />}
              </button>

              {voices.map((v) => {
                const isSelected = playback.selectedVoiceUri === v.voiceURI;
                return (
                  <button
                    key={v.voiceURI}
                    onClick={() => {
                      setVoice(v.voiceURI);
                      setShowVoiceModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'border-[#7657F6] bg-[#7657F6]/10 text-white'
                        : 'border-slate-800 bg-[#101321] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold truncate max-w-[240px]">{v.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{v.lang}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{v.gender}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#9b82ff]" />}
                  </button>
                );
              })}
            </div>

            {/* Pitch slider */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t('readingPitch')}</span>
                <span className="text-white tabular-nums">{playback.pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={playback.pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[#7657F6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Speed Modal */}
      {showSpeedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#181c2e] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('readingSpeed')}</h3>
              <button
                onClick={() => setShowSpeedModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {speedOptions.map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setSpeed(spd);
                    setShowSpeedModal(false);
                  }}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    playback.speed === spd
                      ? 'border-[#7657F6] bg-[#7657F6] text-white shadow-md'
                      : 'border-slate-800 bg-[#101321] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#181c2e] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('sleepTimer')}</h3>
              <button
                onClick={() => setShowTimerModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
            <div className="space-y-2">
              {timerOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSleepTimer(opt.value);
                    setShowTimerModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-colors ${
                    playback.sleepTimerMinutes === opt.value
                      ? 'border-[#7657F6] bg-[#7657F6]/10 text-white'
                      : 'border-slate-800 bg-[#101321] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {playback.sleepTimerMinutes === opt.value && (
                    <Check className="w-4 h-4 text-[#9b82ff]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
