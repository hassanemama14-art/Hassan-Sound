import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Sliders,
  ShieldCheck,
  Info,
  Check,
  Moon,
  Sun,
  Headphones,
  FileCheck2,
  Lock
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, language, setLanguage, t } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {t('settings')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'ar'
            ? 'تخصيص تجربة القراءة والاستماع ومحرك تحويل النص إلى كلام'
            : 'Customize reading preferences and Text-to-Speech narration'}
        </p>
      </div>

      {/* Language Section */}
      <section className="bg-[#181c2e] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7657F6]/15 text-[#9b82ff] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {language === 'ar' ? 'لغة الواجهة (Interface Language)' : 'Interface Language'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'تخصيص لغة التطبيق وتوجيه الخط' : 'Choose Arabic or English'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setLanguage('ar')}
            className={`p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all ${
              language === 'ar'
                ? 'border-[#7657F6] bg-[#7657F6]/15 text-white shadow-sm'
                : 'border-slate-800 bg-[#101321] text-slate-400 hover:text-white'
            }`}
          >
            <span>العربية (Arabic - RTL)</span>
            {language === 'ar' && <Check className="w-4 h-4 text-[#9b82ff]" />}
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all ${
              language === 'en'
                ? 'border-[#7657F6] bg-[#7657F6]/15 text-white shadow-sm'
                : 'border-slate-800 bg-[#101321] text-slate-400 hover:text-white'
            }`}
          >
            <span>English (LTR)</span>
            {language === 'en' && <Check className="w-4 h-4 text-[#9b82ff]" />}
          </button>
        </div>
      </section>

      {/* Reading & Audio Preferences */}
      <section className="bg-[#181c2e] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7657F6]/15 text-[#9b82ff] flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {language === 'ar' ? 'تفضيلات القراءة والاستماع' : 'Playback Preferences'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'التحكم في سرعة القراءة وسلوك الصفحات' : 'Speed & page automation'}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Default Speed */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-medium text-white">{t('readingSpeed')}</div>
              <div className="text-xs text-slate-400">
                {language === 'ar' ? 'السرعة الافتراضية عند بدء أي كتاب' : 'Default initial rate'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => updateSettings({ defaultSpeed: spd })}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                    settings.defaultSpeed === spd
                      ? 'bg-[#7657F6] border-[#7657F6] text-white'
                      : 'bg-[#101321] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Auto Advance Pages */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div>
              <div className="text-xs sm:text-sm font-medium text-white">
                {language === 'ar' ? 'الانتقال التلقائي للصفحة التالية' : 'Auto-advance to next page'}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'ar' ? 'متابعة القراءة بسلاسة دون توقف' : 'Seamless audiobook narration'}
              </div>
            </div>
            <button
              onClick={() => updateSettings({ autoAdvancePages: !settings.autoAdvancePages })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.autoAdvancePages ? 'bg-[#7657F6]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoAdvancePages ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Highlight Spoken Text */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div>
              <div className="text-xs sm:text-sm font-medium text-white">
                {language === 'ar' ? 'تمييز النص المقروء في شاشة القارئ' : 'Highlight spoken paragraph'}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'ar' ? 'تحديد الفقرة وتمرير الشاشة تلقائياً' : 'Auto-scrolls and marks current text'}
              </div>
            </div>
            <button
              onClick={() => updateSettings({ highlightSpokenText: !settings.highlightSpokenText })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.highlightSpokenText ? 'bg-[#7657F6]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.highlightSpokenText ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Offline Processing */}
      <section className="bg-[#181c2e] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {language === 'ar' ? 'الخصوصية والأمان المحلي (Local Privacy)' : 'Privacy & Local-First'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'معالجة محلية بالكامل على جهازك' : 'Zero remote document uploads'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {language === 'ar'
            ? 'تطبيق حسن ساوند يعالج جميع المستندات وملفات PDF ونصوصها محلياً على جهازك دون إرسالها إلى أي خوادم خارجية، ولا يتضمن أي أدوات تتبع أو إعلانات.'
            : 'Hassan Sound parses all imported PDF documents, ebooks, and speech synthesis entirely on-device. No personal data or document content is uploaded to external servers.'}
        </p>
      </section>

      {/* About Application */}
      <section className="bg-[#181c2e] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7657F6]/15 text-[#9b82ff] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Hassan Sound v1.0.0</h2>
            <p className="text-xs text-slate-400">Package: com.hassansound.app</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {t('aboutText')}
        </p>
      </section>
    </div>
  );
};
