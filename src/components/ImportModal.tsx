import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Headphones
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importFile, isImporting, importError, openReader, openPlayer, activeBookId, language, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [importedBookId, setImportedBookId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const ok = await importFile(file);
    if (ok) {
      setSuccess(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#181c2e] border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {language === 'ar' ? 'استيراد مستند (Storage Access Framework)' : 'Import Document'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'يدعم ملفات PDF والكتب النصية TXT والمذكرات'
                : 'Supports PDF books, text files (.txt, .md)'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        {!success ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? 'border-[#7657F6] bg-[#7657F6]/10 scale-[1.01]'
                : 'border-slate-700 hover:border-[#7657F6]/60 bg-[#101321]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.text,.md"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-[#7657F6]/15 text-[#9b82ff] flex items-center justify-center shadow-lg">
              <FileUp className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {language === 'ar'
                  ? 'اسحب وأفلت ملف PDF أو TXT هنا، أو انقر للاختيار'
                  : 'Drag & drop your PDF or TXT here, or browse files'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar'
                  ? 'يتم استخراج النصوص وتحليلها محلياً بالكامل على جهازك'
                  : 'Processed locally and converted to selectable speech'}
              </p>
            </div>

            {isImporting && (
              <div className="flex items-center gap-2 text-xs text-[#9b82ff] font-medium mt-2 animate-pulse">
                <span>{language === 'ar' ? 'جارٍ قراءة وفك تشفير المستند...' : 'Extracting document text...'}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#101321] border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {language === 'ar' ? 'تم استيراد المستند بنجاح!' : 'Document Imported Successfully!'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar'
                  ? 'تم استخراج الصفحات وإضافتها إلى مكتبتك وجاهزة للاستماع والقراءة.'
                  : 'Pages extracted and saved to your personal library.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  if (activeBookId) openPlayer(activeBookId);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#7657F6] text-white text-xs font-semibold rounded-xl shadow-md hover:bg-[#6846f4] transition-all"
              >
                <Headphones className="w-4 h-4" />
                <span>{t('player')}</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  if (activeBookId) openReader(activeBookId);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('reader')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message if any */}
        {importError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Info notice about SAF & Scanned PDFs */}
        <div className="text-[11px] text-slate-500 leading-relaxed bg-[#101321] p-3.5 rounded-2xl border border-slate-800">
          <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9b82ff]" />
            <span>{language === 'ar' ? 'ملاحظة المعالجة الذكية' : 'Smart Document Processing'}</span>
          </div>
          {language === 'ar'
            ? 'يقوم حسن ساوند بقراءة طبقة النصوص وتجزئة الفقرات لتوافق محرك القراءة الصوتية. بالنسبة للكتب المصورة (Scanned PDFs)، يوضح التطبيق حاجتها لمحرك OCR.'
            : 'Hassan Sound extracts embedded text layers and splits paragraphs for the speech engine. If a PDF is image-only, OCR is required.'}
        </div>
      </div>
    </div>
  );
};
