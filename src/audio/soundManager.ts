class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize on first user interaction
    const savedMute = localStorage.getItem('kawaii_icecream_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('kawaii_icecream_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playPop(frequency = 520, duration = 0.08) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, now + duration);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext error safeguard
    }
  }

  public playScoop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startFreq = 260 + Math.random() * 80;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.linearRampToValueAtTime(startFreq + 140, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // AudioContext safeguard
    }
  }

  public playTopping() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // High bright marimba / wooden shaker sound
      const notes = [784, 880, 1046, 1174];
      const freq = notes[Math.floor(Math.random() * notes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // AudioContext safeguard
    }
  }

  public playSyrup() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.18);
      osc.frequency.linearRampToValueAtTime(340, now + 0.28);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // AudioContext safeguard
    }
  }

  public playBlender(duration = 1.35) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const totalDur = duration;

      // Master output compressor/limiter to keep sound rich, punchy, and non-clipping
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.42, now);
      masterGain.connect(this.ctx.destination);

      // 1. Tactile Mechanical Rocker Switch Click (Instant power engagement snap at t = 0)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      clickOsc.connect(clickGain);
      clickGain.connect(masterGain);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // 2. High-Torque Universal Motor Rev-Up & High-RPM Whine
      const runEnd = now + totalDur - 0.28;
      const stopTime = now + totalDur;

      // Motor Primary Rotor
      const motorOsc1 = this.ctx.createOscillator();
      motorOsc1.type = 'sawtooth';
      motorOsc1.frequency.setValueAtTime(110, now);
      motorOsc1.frequency.exponentialRampToValueAtTime(460, now + 0.32);
      motorOsc1.frequency.setValueAtTime(460, runEnd);
      motorOsc1.frequency.exponentialRampToValueAtTime(80, stopTime);

      // Motor Secondary Harmonic (detuned for authentic mechanical phase beating)
      const motorOsc2 = this.ctx.createOscillator();
      motorOsc2.type = 'sawtooth';
      motorOsc2.frequency.setValueAtTime(225, now);
      motorOsc2.frequency.exponentialRampToValueAtTime(924, now + 0.32);
      motorOsc2.frequency.setValueAtTime(924, runEnd);
      motorOsc2.frequency.exponentialRampToValueAtTime(160, stopTime);

      const motorGain = this.ctx.createGain();
      motorGain.gain.setValueAtTime(0.01, now);
      motorGain.gain.linearRampToValueAtTime(0.24, now + 0.15);
      motorGain.gain.setValueAtTime(0.26, runEnd);
      motorGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      // Waveshaper distortion for motor magnetic coil saturation
      const waveShaper = this.ctx.createWaveShaper();
      const curveLength = 256;
      const curve = new Float32Array(curveLength);
      for (let i = 0; i < curveLength; ++i) {
        const x = (i * 2) / curveLength - 1;
        curve[i] = (Math.PI + 4) * x / (Math.PI + 4 * Math.abs(x));
      }
      waveShaper.curve = curve;

      motorOsc1.connect(waveShaper);
      motorOsc2.connect(waveShaper);
      waveShaper.connect(motorGain);
      motorGain.connect(masterGain);

      motorOsc1.start(now);
      motorOsc2.start(now);
      motorOsc1.stop(stopTime);
      motorOsc2.stop(stopTime);

      // 3. Fluid Vortex & Crushed Ice / Thick Liquid Churn Noise
      const sampleRate = this.ctx.sampleRate;
      const bufferLength = Math.floor(sampleRate * totalDur);
      const noiseBuffer = this.ctx.createBuffer(1, bufferLength, sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        // Brown/Pink weighted noise for rich turbulent liquid slosh
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + (0.02 * white)) / 1.02;
        noiseData[i] = lastVal * 3.5;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Resonant Band-pass filter simulating blade vortex through thick shake
      const liquidFilter = this.ctx.createBiquadFilter();
      liquidFilter.type = 'bandpass';
      liquidFilter.Q.setValueAtTime(2.4, now);
      liquidFilter.frequency.setValueAtTime(550, now);
      liquidFilter.frequency.exponentialRampToValueAtTime(1750, now + 0.38);
      liquidFilter.frequency.setValueAtTime(1750, runEnd);
      liquidFilter.frequency.exponentialRampToValueAtTime(420, stopTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02, now);
      noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.22);
      noiseGain.gain.setValueAtTime(0.28, runEnd);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      noiseSource.connect(liquidFilter);
      liquidFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      noiseSource.start(now);
      noiseSource.stop(stopTime);

      // 4. Low-Frequency Motor Housing & Countertop Rumble
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      rumbleOsc.type = 'sine';
      rumbleOsc.frequency.setValueAtTime(75, now);
      rumbleOsc.frequency.linearRampToValueAtTime(115, now + 0.3);
      rumbleOsc.frequency.setValueAtTime(115, runEnd);
      rumbleOsc.frequency.linearRampToValueAtTime(40, stopTime);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.25, now + 0.18);
      rumbleGain.gain.setValueAtTime(0.25, runEnd);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(masterGain);

      rumbleOsc.start(now);
      rumbleOsc.stop(stopTime);
    } catch {
      // AudioContext safeguard
    }
  }

  public playServeBell() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // High resonant bell sound
      const primary = this.ctx.createOscillator();
      const harmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      primary.type = 'sine';
      primary.frequency.setValueAtTime(1567.98, now); // G6

      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(3135.96, now); // G7

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      primary.connect(gain);
      harmonic.connect(gain);
      gain.connect(this.ctx.destination);

      primary.start(now);
      harmonic.start(now);
      primary.stop(now + 0.9);
      harmonic.stop(now + 0.9);
    } catch {
      // AudioContext safeguard
    }
  }

  public playSuccessChime(isHighCombo = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = isHighCombo ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.08;
        const duration = 0.35;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });
    } catch {
      // AudioContext safeguard
    }
  }

  public playAngrySigh() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.4);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // AudioContext safeguard
    }
  }

  public playTrash() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // AudioContext safeguard
    }
  }
}

export const sounds = new SoundManager();
