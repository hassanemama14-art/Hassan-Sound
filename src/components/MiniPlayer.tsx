import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    activeBook,
    playback,
    togglePlayPause,
    stopPlayback,
    nextParagraph,
    previousParagraph,
    openPlayer,
    currentRoute
  } = useApp();

  // Don't show mini player if already on the full Player screen or if no book is loaded
  if (currentRoute === 'player' || !activeBook) {
    return null;
  }

  // Only show if playing, paused, or loaded
  if (!playback.isPlaying && !playback.isPaused && playback.currentSentence === '') {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-8 md:w-96 z-40">
      <div className="bg-[#181c2e]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden transition-all hover:border-[#7657F6]/50">
        {/* Progress line indicator */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#7657F6] to-[#9b82ff] transition-all duration-300"
            style={{ width: `${activeBook.progressPercent}%` }}
          />
        </div>

        <div className="p-3 flex items-center justify-between gap-3">
          {/* Book thumbnail & metadata - Click to open full player */}
          <button
            onClick={() => openPlayer(activeBook.id)}
            className="flex items-center gap-3 min-w-0 text-left flex-1 group"
          >
            <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 shadow-md">
              <img
                src={activeBook.coverUrl}
                alt={activeBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              {playback.isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-white animate-pulse" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#9b82ff] transition-colors">
                {activeBook.language === 'ar' && activeBook.titleAr ? activeBook.titleAr : activeBook.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                <span>{activeBook.author}</span>
                <span aria-hidden="true">·</span>
                <span>P.{playback.currentPage}</span>
              </div>
            </div>
          </button>

          {/* Quick Audio Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={previousParagraph}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Previous paragraph"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-[#7657F6] hover:bg-[#6846f4] text-white flex items-center justify-center shadow-md shadow-[#7657F6]/30 active:scale-95 transition-transform"
              title={playback.isPlaying ? 'Pause' : 'Play'}
            >
              {playback.isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={nextParagraph}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Next paragraph"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={stopPlayback}
              className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ml-0.5"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
