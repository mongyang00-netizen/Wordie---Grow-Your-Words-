class SoundController {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-load voices for SpeechSynthesis
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          this.voices = window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Unlock AudioContext and Audio elements on first user gesture
      const unlockAudio = () => {
        this.unlock();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  private unlock() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.initCtx();
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch {}
      this.currentAudio = null;
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

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Silent error
    }
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
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // Audio context fallback
    }
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

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Silent error
    }
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

        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {
      // Silent error
    }
  }

  /**
   * High-reliability English pronunciation playback
   * Plays native audio via Google TTS CDN first, falling back to Web Speech API.
   */
  public speak(text: string) {
    if (!this.soundEnabled) return;
    if (typeof window === 'undefined') return;

    this.unlock();

    // Clean up underscores, markdown, or Korean translations
    const cleanText = text
      .replace(/______/g, ' ')
      .replace(/[_#*~]/g, '')
      .replace(/\(.*?\)/g, '') // remove parenthesized text if any
      .trim();

    if (!cleanText) return;

    // Check if text is English (contains at least one latin letter)
    const hasLatin = /[a-zA-Z]/.test(cleanText);
    if (!hasLatin) return;

    // Stop any existing audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    try {
      const encoded = encodeURIComponent(cleanText);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;
      const audio = new Audio(ttsUrl);
      audio.playbackRate = 0.95;
      this.currentAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If Audio.play() was blocked or failed, fallback to SpeechSynthesis
          this.speakViaSpeechSynthesis(cleanText);
        });
      }
    } catch {
      this.speakViaSpeechSynthesis(cleanText);
    }
  }

  private speakViaSpeechSynthesis(cleanText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 1.05;

      if (this.voices.length === 0) {
        this.voices = window.speechSynthesis.getVoices();
      }
      const enVoice = this.voices.find(
        (v) => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.localService)
      ) || this.voices.find((v) => v.lang.startsWith('en'));

      if (enVoice) {
        utterance.voice = enVoice;
      }

      this.activeUtterance = utterance;
      utterance.onend = () => {
        this.activeUtterance = null;
      };
      utterance.onerror = () => {
        this.activeUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignored
    }
  }
}

export const sound = new SoundController();
