import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, generateAndroidProjectZip } from '../services/androidCodebase';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  ExternalLink,
  Smartphone,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useApp();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HassanSound-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#101321] border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-[#181c2e]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7657F6] to-[#9b82ff] flex items-center justify-center text-white shadow-md shadow-[#7657F6]/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Hassan Sound – Android Studio Project
                </h2>
                <span className="hidden sm:inline-block text-[11px] text-[#9b82ff] font-semibold bg-[#7657F6]/15 px-2 py-0.5 rounded-md">
                  Kotlin & Compose
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Package: <code className="text-slate-300 font-mono">com.hassansound.app</code> · SDK 26 to 36
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download Zip Action */}
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-[#7657F6] hover:bg-[#6846f4] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-[#7657F6]/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Packaging...' : 'Download Project (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left File Tree, Right Code Preview */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-72 bg-[#141829] border-b md:border-b-0 md:border-r border-slate-800/80 p-3 overflow-y-auto shrink-0 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Project Files ({ANDROID_PROJECT_FILES.length})</span>
            </div>

            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                    isSelected
                      ? 'bg-[#7657F6]/20 text-[#9b82ff] font-semibold border border-[#7657F6]/40'
                      : 'text-slate-300 hover:bg-[#181c2e] hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{file.path.split('/').pop()}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d101c]">
            {/* File Path & Copy Toolbar */}
            <div className="px-4 py-2.5 bg-[#141829]/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-slate-200">{currentFile.path}</span>
                <span className="text-slate-500 hidden sm:inline">· {currentFile.description}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed select-text">
              <pre className="whitespace-pre">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-[#181c2e] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#9b82ff]" />
              <span>Room DB + Foreground Service</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Jetpack Compose MVVM</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Compatible with Android Studio Ladybug / Koala / Iguana
          </div>
        </div>
      </div>
    </div>
  );
};
