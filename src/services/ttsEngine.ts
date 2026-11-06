import { TtsVoiceOption } from '../types';

export type TtsBoundaryCallback = (charIndex: number, length?: number) => void;
export type TtsParagraphEndCallback = () => void;
export type TtsStateChangeCallback = (isPlaying: boolean, isPaused: boolean) => void;
export type TtsErrorCallback = (errorMsg: string) => void;

class HassanTtsEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private activeText = '';

  // Callbacks
  private onBoundary: TtsBoundaryCallback | null = null;
  private onEnd: TtsParagraphEndCallback | null = null;
  private onStateChange: TtsStateChangeCallback | null = null;
  private onError: TtsErrorCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getAvailableVoices(): TtsVoiceOption[] {
    if (!this.synth) return [];
    const list = this.synth.getVoices();
    return list.map((v) => {
      const lower = v.name.toLowerCase();
      let gender: 'male' | 'female' | 'neutral' = 'neutral';
      if (lower.includes('female') || lower.includes('woman') || lower.includes('zira') || lower.includes('samantha') || lower.includes('victoria') || lower.includes('salma') || lower.includes('layla') || lower.includes('laila') || lower.includes('mariam') || lower.includes('zeina')) {
        gender = 'female';
      } else if (lower.includes('male') || lower.includes('man') || lower.includes('david') || lower.includes('george') || lower.includes('tariq') || lower.includes('maged') || lower.includes('naif') || lower.includes('ali')) {
        gender = 'male';
      }

      return {
        name: v.name,
        lang: v.lang,
        gender,
        voiceURI: v.voiceURI,
        isDefault: v.default
      };
    });
  }

  public getVoicesForLanguage(lang: 'ar' | 'en'): TtsVoiceOption[] {
    const all = this.getAvailableVoices();
    const prefix = lang === 'ar' ? 'ar' : 'en';
    const filtered = all.filter((v) => v.lang.toLowerCase().startsWith(prefix));
    return filtered;
  }

  public hasVoiceForLanguage(lang: 'ar' | 'en'): boolean {
    const list = this.getVoicesForLanguage(lang);
    return list.length > 0;
  }

  public setCallbacks(handlers: {
    onBoundary?: TtsBoundaryCallback;
    onEnd?: TtsParagraphEndCallback;
    onStateChange?: TtsStateChangeCallback;
    onError?: TtsErrorCallback;
  }) {
    if (handlers.onBoundary) this.onBoundary = handlers.onBoundary;
    if (handlers.onEnd) this.onEnd = handlers.onEnd;
    if (handlers.onStateChange) this.onStateChange = handlers.onStateChange;
    if (handlers.onError) this.onError = handlers.onError;
  }

  public speak(options: {
    text: string;
    lang: 'ar' | 'en';
    voiceURI?: string | null;
    rate?: number;
    pitch?: number;
  }) {
    if (!this.synth) {
      if (this.onError) this.onError('SpeechSynthesis is not supported on this device/browser.');
      return;
    }

    const cleanText = options.text.trim();
    if (!cleanText) {
      if (this.onEnd) this.onEnd();
      return;
    }

    // Cancel any ongoing speech first
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.activeText = cleanText;

    // Language setting
    utterance.lang = options.lang === 'ar' ? 'ar-SA' : 'en-US';

    // Speed & Pitch
    utterance.rate = Math.max(0.5, Math.min(3.0, options.rate ?? 1.0));
    utterance.pitch = Math.max(0.5, Math.min(2.0, options.pitch ?? 1.0));

    // Match voice if requested
    const allVoices = this.synth.getVoices();
    if (options.voiceURI) {
      const found = allVoices.find((v) => v.voiceURI === options.voiceURI);
      if (found) {
        utterance.voice = found;
        utterance.lang = found.lang;
      }
    } else {
      // Find best default voice for the language
      const prefix = options.lang === 'ar' ? 'ar' : 'en';
      const candidate = allVoices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      if (candidate) {
        utterance.voice = candidate;
        utterance.lang = candidate.lang;
      }
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(true, false);
    };

    utterance.onpause = () => {
      this.isPlaying = false;
      this.isPaused = true;
      if (this.onStateChange) this.onStateChange(false, true);
    };

    utterance.onresume = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(true, false);
    };

    utterance.onboundary = (event) => {
      if (this.onBoundary) {
        this.onBoundary(event.charIndex, (event as any).charLength || 0);
      }
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(false, false);
      if (this.onEnd) this.onEnd();
    };

    utterance.onerror = (event) => {
      if (event.error === 'interrupted' || event.error === 'canceled') {
        // Normal interruption during pause/stop
        return;
      }
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(false, false);
      if (this.onError) {
        this.onError(`TTS Error: ${event.error || 'Failed to synthesize speech'}`);
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (!this.synth) return;
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPlaying = false;
      this.isPaused = true;
      if (this.onStateChange) this.onStateChange(false, true);
    }
  }

  public resume() {
    if (!this.synth) return;
    if (this.synth.paused) {
      this.synth.resume();
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(true, false);
    }
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    if (this.onStateChange) this.onStateChange(false, false);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused
    };
  }
}

export const ttsEngine = new HassanTtsEngine();
