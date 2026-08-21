/* ==========================================================================
   Procedural Web Audio API Synthesizer & Dynamic Synthwave Chase Soundtrack
   ========================================================================== */

export class AudioSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.lastSoundTimes = {};
        
        // BGM Music Sequencer State
        this.bgmPlaying = false;
        this.bgmStep = 0;
        this.bgmTimer = null;
        this.baseTempoMs = 130; // ~115 BPM
        this.currentTempoMs = 130;
        
        // Synthwave Bassline Notes (Hz frequencies)
        this.bassNotes = [
            110, 110, 130.81, 110, // A2, A2, C3, A2
            98,  98,  110,    98,  // G2, G2, A2, G2
            87.31, 87.31, 98, 87.31,// F2, F2, G2, F2
            98,  98,  110,    123.47// G2, G2, A2, B2
        ];
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (err) {}
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.enabled;
    }

    startBGM() {
        if (!this.enabled || this.bgmPlaying) return;
        this.init();
        if (!this.ctx) return;
        this.bgmPlaying = true;
        this.bgmStep = 0;
        this.scheduleNextBGMStep();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    setSpeedTempo(speedFactor) {
        // As speed scales from 0.8 to 2.0, tempo accelerates from 130ms down to 85ms per 16th note!
        this.currentTempoMs = Math.max(80, Math.floor(this.baseTempoMs - (speedFactor - 0.8) * 45));
    }

    scheduleNextBGMStep() {
        if (!this.bgmPlaying || !this.enabled || !this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const freq = this.bassNotes[this.bgmStep % this.bassNotes.length];

            // 1. Driving Synthwave Bass Note (Sawtooth + Lowpass)
            const osc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.exponentialRampToValueAtTime(120, now + 0.1);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.11);
            osc.onended = () => { try { osc.disconnect(); filter.disconnect(); gain.disconnect(); } catch (e) {} };

            // 2. Electronic Kick & Snare Drum Pulse (Every 4th & 8th step)
            if (this.bgmStep % 4 === 0) {
                // Electronic Kick
                const kickOsc = this.ctx.createOscillator();
                const kickGain = this.ctx.createGain();
                kickOsc.type = 'sine';
                kickOsc.frequency.setValueAtTime(140, now);
                kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
                kickGain.gain.setValueAtTime(0.22, now);
                kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

                kickOsc.connect(kickGain);
                kickGain.connect(this.ctx.destination);
                kickOsc.start(now);
                kickOsc.stop(now + 0.09);
                kickOsc.onended = () => { try { kickOsc.disconnect(); kickGain.disconnect(); } catch (e) {} };
            } else if (this.bgmStep % 4 === 2) {
                // Electronic Hi-Hat
                const hiOsc = this.ctx.createOscillator();
                const hiGain = this.ctx.createGain();
                hiOsc.type = 'triangle';
                hiOsc.frequency.setValueAtTime(1800, now);
                hiGain.gain.setValueAtTime(0.06, now);
                hiGain.gain.exponentialRampToValueAtTime(0.005, now + 0.04);

                hiOsc.connect(hiGain);
                hiGain.connect(this.ctx.destination);
                hiOsc.start(now);
                hiOsc.stop(now + 0.05);
                hiOsc.onended = () => { try { hiOsc.disconnect(); hiGain.disconnect(); } catch (e) {} };
            }

            this.bgmStep++;
        } catch (e) {}

        this.bgmTimer = setTimeout(() => this.scheduleNextBGMStep(), this.currentTempoMs);
    }

    canPlay(soundKey, cooldown = 180) {
        if (!this.enabled) return false;
        const now = Date.now();
        if (this.lastSoundTimes[soundKey] && now - this.lastSoundTimes[soundKey] < cooldown) {
            return false;
        }
        this.lastSoundTimes[soundKey] = now;
        this.init();
        return !!this.ctx;
    }

    playNearMiss() {
        try {
            if (!this.canPlay('nearMiss', 300)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playJump() {
        try {
            if (!this.canPlay('jump', 220)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playSlide() {
        try {
            if (!this.canPlay('slide', 220)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playCash() {
        try {
            if (!this.canPlay('cash', 100)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1050, this.ctx.currentTime);
            osc.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.1);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playGoldBar() {
        try {
            if (!this.canPlay('gold', 100)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1300, this.ctx.currentTime);
            osc.frequency.setValueAtTime(1800, this.ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.16);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playMilestone() {
        try {
            if (!this.canPlay('milestone', 500)) return;
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now + idx * 0.08);
                gain.gain.setValueAtTime(0.18, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.22);
            });
        } catch (e) {}
    }

    playSiren() {
        try {
            if (!this.canPlay('siren', 400)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.25);
            osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.5);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }

    playCrash() {
        try {
            if (!this.canPlay('crash', 300)) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
            osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch (e) {} };
        } catch (e) {}
    }
}
