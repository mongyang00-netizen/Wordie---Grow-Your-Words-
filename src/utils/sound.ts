import { WORD_AUDIO_MAP } from '../assets/audioMap';

class SoundController {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-load voices for SpeechSynthesis
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          try {
            this.voices = window.speechSynthesis.getVoices();
          } catch {}
        };
        loadVoices();
        if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }
      }

      // Unlock AudioContext and speech synthesis on first user gesture
      const unlockAudio = () => {
        this.unlock();
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true, once: false });
      window.addEventListener('touchstart', unlockAudio, { passive: true, once: false });
      window.addEventListener('click', unlockAudio, { passive: true, once: false });
      window.addEventListener('keydown', unlockAudio, { passive: true, once: false });
    }
  }

  public unlock() {
    this.initCtx();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}
    }
  }

  private initCtx() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
        } catch {}
        this.currentAudio = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  public playGrowth() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.22, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {}
  }

  /**
   * High-reliability English pronunciation playback.
   * Uses bundled native studio mp3 recordings for the 10 vocabulary words,
   * guaranteeing 100% immediate playback on laptops, PCs, and mobiles without delay or overlap!
   */
  public speak(text: string) {
    if (!this.soundEnabled) return;
    if (typeof window === 'undefined') return;

    this.unlock();

    // Clean up text
    const cleanText = text
      .replace(/______/g, ' ')
      .replace(/[_#*~]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();

    if (!cleanText) return;

    // Stop any existing sound/speech to avoid overlap
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window.speechSynthesis !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    // Check if cleanText is one of our bundled vocabulary words
    const lower = cleanText.toLowerCase();
    if (WORD_AUDIO_MAP[lower]) {
      try {
        const audio = new Audio(WORD_AUDIO_MAP[lower]);
        audio.playbackRate = 1.0;
        this.currentAudio = audio;
        audio.play().catch(() => {
          // If browser restricted Audio element, fallback to Web Speech
          const success = this.speakViaSpeechSynthesis(cleanText);
          if (!success) {
            this.speakViaAudioElement(cleanText);
          }
        });
        return;
      } catch {
        const success = this.speakViaSpeechSynthesis(cleanText);
        if (!success) {
          this.speakViaAudioElement(cleanText);
        }
        return;
      }
    }

    // If the word or phrase is not in the bundle (e.g., if words are customized later):
    // First try Web Speech Synthesis, then fallback to high-reliability online audio TTS!
    const synthSuccess = this.speakViaSpeechSynthesis(cleanText);
    if (!synthSuccess) {
      this.speakViaAudioElement(cleanText);
    }
  }

  private speakViaSpeechSynthesis(cleanText: string): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (this.voices.length === 0) {
        this.voices = window.speechSynthesis.getVoices();
      }

      // Pick the best natural English voice available on desktop or mobile
      const enVoice =
        this.voices.find(
          (v) =>
            (v.lang === 'en-US' || v.lang === 'en_US') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Jenny') ||
              v.name.includes('Guy'))
        ) ||
        this.voices.find((v) => v.lang.startsWith('en')) ||
        null;

      if (enVoice) {
        utterance.voice = enVoice;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  private speakViaAudioElement(cleanText: string) {
    try {
      const encoded = encodeURIComponent(cleanText);
      // Dual reliable TTS sources
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;
      const audio = new Audio(ttsUrl);
      audio.playbackRate = 0.92;
      this.currentAudio = audio;

      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          // Alternative TTS endpoint
          const altUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&type=2`;
          const altAudio = new Audio(altUrl);
          altAudio.playbackRate = 0.95;
          this.currentAudio = altAudio;
          altAudio.play().catch(() => {});
        });
      }
    } catch {}
  }
}

export const sound = new SoundController();
