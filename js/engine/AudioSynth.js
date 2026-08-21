/* ==========================================================================
   Procedural Web Audio API Synthesizer (Bulletproof 60 FPS Audio Engine)
   ========================================================================== */

export class AudioSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.lastSoundTimes = {};
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
        return this.enabled;
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
