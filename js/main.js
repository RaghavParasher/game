/* ==========================================================================
   HIGHWAY HEIST CANYON SURFER 3D - MAIN 60 FPS CONTROLLER & NEAR-MISS SYSTEM
   ========================================================================== */

import { Renderer } from './engine/Renderer.js';
import { AudioSynth } from './engine/AudioSynth.js';
import { InputHandler } from './game/InputHandler.js';
import { Player } from './entities/Player.js';
import { Chaser } from './entities/Chaser.js';
import { Track } from './entities/Track.js';

class CanyonSurferGame {
    constructor() {
        this.container = document.getElementById('webgl-container');
        this.renderer = new Renderer(this.container);
        this.audio = new AudioSynth();
        this.input = new InputHandler();

        this.player = new Player(this.renderer.scene);
        this.chaser = new Chaser(this.renderer.scene);
        this.track = new Track(this.renderer.scene);

        this.distanceMeters = 0;
        this.cashAmount = 0;
        this.goldBars = 0;
        this.baseSpeed = 0.8;
        this.currentSpeed = 0.8;
        this.stumbleTimer = 0;
        this.wantedLevel = 1;
        this.comboStreak = 1;
        this.comboTimer = 0;
        this.highScore = parseInt(localStorage.getItem('heist_highscore') || '0', 10);

        this.gameState = 'MENU';

        // Pre-instantiated Collision Boxes
        this.playerBox = new THREE.Box3();
        this.itemBox = new THREE.Box3();
        this.minVec = new THREE.Vector3();
        this.maxVec = new THREE.Vector3();

        this.initUI();
        this.loop();
    }

    resetGame() {
        this.distanceMeters = 0;
        this.cashAmount = 0;
        this.goldBars = 0;
        this.currentSpeed = this.baseSpeed;
        this.stumbleTimer = 0;
        this.wantedLevel = 1;
        this.comboStreak = 1;
        this.comboTimer = 0;

        this.player.reset();
        this.chaser.reset();
        this.track.reset();
        this.updateWantedGauge(1);

        document.getElementById('distance-display').innerText = '0 m';
        document.getElementById('speed-display').innerText = '120 KM/H';
        document.getElementById('coins-display').innerText = '💵 $0 | 🧈 0';
        document.getElementById('multiplier-display').innerText = '1x';
    }

    triggerNearMiss() {
        const bonus = 500 * this.comboStreak;
        this.cashAmount += bonus;
        this.comboStreak = Math.min(4, this.comboStreak + 1);
        this.comboTimer = 180; // 3 seconds streak window

        this.audio.playNearMiss();
        this.renderer.triggerShake(0.35);

        document.getElementById('coins-display').innerText = `💵 $${this.cashAmount} | 🧈 ${this.goldBars}`;
        document.getElementById('multiplier-display').innerText = `${this.comboStreak}x`;

        const alertEl = document.getElementById('combo-alert');
        const bonusEl = document.getElementById('combo-bonus');
        if (alertEl && bonusEl) {
            bonusEl.innerText = `+ $${bonus} (${this.comboStreak}x)`;
            alertEl.classList.add('active');
            setTimeout(() => alertEl.classList.remove('active'), 750);
        }
    }

    updateWantedLevel() {
        let stars = 1;
        if (this.distanceMeters >= 2000) stars = 5;
        else if (this.distanceMeters >= 1500) stars = 4;
        else if (this.distanceMeters >= 1000) stars = 3;
        else if (this.distanceMeters >= 500) stars = 2;

        if (stars !== this.wantedLevel) {
            this.wantedLevel = stars;
            this.updateWantedGauge(stars);
            this.audio.playSiren();
            this.renderer.triggerShake(0.5);
        }
    }

    updateWantedGauge(stars) {
        for (let i = 1; i <= 5; i++) {
            const el = document.getElementById(`star-${i}`);
            if (el) {
                if (i <= stars) el.classList.add('active');
                else el.classList.remove('active');
            }
        }
    }

    update() {
        if (this.gameState !== 'PLAYING') return;

        try {
            // Speed acceleration
            this.currentSpeed += 0.00015;

            // Escape Distance Ticker & Speedometer
            this.distanceMeters += Math.floor(this.currentSpeed * 4);
            const kmh = Math.floor(this.currentSpeed * 150);

            document.getElementById('distance-display').innerText = `${this.distanceMeters} m`;
            document.getElementById('speed-display').innerText = `${kmh} KM/H`;

            // Update Dynamic FOV with speed
            this.renderer.setSpeedFov(this.currentSpeed);

            // Handle Combo Streak Decay
            if (this.comboTimer > 0) {
                this.comboTimer--;
                if (this.comboTimer <= 0) {
                    this.comboStreak = 1;
                    document.getElementById('multiplier-display').innerText = '1x';
                }
            }

            // Update GTA Wanted Level Escalation
            this.updateWantedLevel();

            // Update Dynamic Skybox Cycle based on distance
            this.renderer.updateSkyCycle(this.distanceMeters);

            // --- INPUT ACTIONS (CONSUMED IMMEDIATELY) ---
            if (this.input.left) {
                this.input.left = false;
                this.player.shiftLane(-1);
            }
            if (this.input.right) {
                this.input.right = false;
                this.player.shiftLane(1);
            }
            if (this.input.jump) {
                this.input.jump = false;
                this.audio.playJump();
                this.player.jump();
            }
            if (this.input.slide) {
                this.input.slide = false;
                this.audio.playSlide();
                this.player.slide();
            }

            // Update Entities
            this.player.update();
            this.chaser.update(this.player.mesh.position.x, this.stumbleTimer > 0);
            this.track.update(this.currentSpeed);

            if (this.stumbleTimer > 0) {
                this.stumbleTimer--;
            }

            // Zero-Allocation Player Collision Box Update
            const playerY = this.player.mesh.position.y;
            const playerH = this.player.isSliding ? 0.7 : 1.7;
            this.minVec.set(this.player.currentX - 0.45, playerY + 0.1, -0.45);
            this.maxVec.set(this.player.currentX + 0.45, playerY + playerH, 0.45);
            this.playerBox.set(this.minVec, this.maxVec);

            for (let i = this.track.items.length - 1; i >= 0; i--) {
                const item = this.track.items[i];
                if (!item) continue;
                this.itemBox.setFromObject(item);

                // Near-Miss Detection (Pass within 1.2 units of an obstacle without hitting!)
                if (!item.userData.nearMissChecked && (item.userData.type === 'POLICE' || item.userData.type === 'ARMORED' || item.userData.type === 'HURDLE')) {
                    const distZ = Math.abs(item.position.z - 0);
                    const distX = Math.abs(item.position.x - this.player.currentX);
                    if (distZ < 1.4 && distX > 0.6 && distX < 2.0) {
                        item.userData.nearMissChecked = true;
                        this.triggerNearMiss();
                    }
                }

                if (this.playerBox.intersectsBox(this.itemBox)) {
                    if (item.userData.type === 'CASH') {
                        this.audio.playCash();
                        const gain = 100 * this.comboStreak;
                        this.cashAmount += gain;
                        this.player.expandDuffelBag(this.cashAmount / 100 + this.goldBars);
                        document.getElementById('coins-display').innerText = `💵 $${this.cashAmount} | 🧈 ${this.goldBars}`;
                        this.renderer.scene.remove(item);
                        this.track.items.splice(i, 1);
                    } else if (item.userData.type === 'GOLDBAR') {
                        this.audio.playGoldBar();
                        this.goldBars += 1;
                        const gain = 500 * this.comboStreak;
                        this.cashAmount += gain;
                        this.player.expandDuffelBag(this.cashAmount / 100 + this.goldBars);
                        document.getElementById('coins-display').innerText = `💵 $${this.cashAmount} | 🧈 ${this.goldBars}`;
                        this.renderer.scene.remove(item);
                        this.track.items.splice(i, 1);
                    } else if (item.userData.type === 'HURDLE' || item.userData.type === 'BARRIER' || item.userData.type === 'POLICE' || item.userData.type === 'ARMORED') {
                        // OBSTACLES ARE NEVER DELETED FROM SCENE ON HIT!
                        if (!item.userData.hit) {
                            item.userData.hit = true;
                            this.renderer.triggerShake(0.6);
                            this.comboStreak = 1;
                            document.getElementById('multiplier-display').innerText = '1x';

                            if (this.stumbleTimer <= 0) {
                                this.audio.playCrash();
                                this.stumbleTimer = 120;
                                this.currentSpeed *= 0.6;
                            } else {
                                this.audio.playCrash();
                                this.gameState = 'GAMEOVER';
                                
                                if (this.cashAmount > this.highScore) {
                                    this.highScore = this.cashAmount;
                                    localStorage.setItem('heist_highscore', this.highScore.toString());
                                }

                                document.getElementById('final-distance').innerText = `${this.distanceMeters} m`;
                                document.getElementById('final-coins').innerText = `💵 $${this.cashAmount} | 🧈 ${this.goldBars}`;
                                document.getElementById('final-speed').innerText = `${kmh} KM/H`;
                                document.getElementById('high-score-display').innerText = `💵 $${this.highScore}`;
                                document.getElementById('modal-gameover').classList.add('active');
                            }
                        }
                    }
                }
            }
        } catch (err) {}
    }

    render() {
        try {
            const targetCamX = this.player.mesh.position.x * 0.3;
            this.renderer.camera.position.x += (targetCamX - this.renderer.camera.position.x) * 0.1;
            this.renderer.camera.position.y = 7.5;
            this.renderer.camera.position.z = 13.5;
            this.renderer.camera.lookAt(0, 1.8, -20);

            this.renderer.render();
        } catch (err) {}
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    initUI() {
        document.getElementById('btn-start-game').addEventListener('click', () => {
            this.audio.init();
            document.getElementById('modal-start').classList.remove('active');
            this.resetGame();
            this.gameState = 'PLAYING';
        });

        document.getElementById('btn-replay-game').addEventListener('click', () => {
            document.getElementById('modal-gameover').classList.remove('active');
            this.resetGame();
            this.gameState = 'PLAYING';
        });

        document.getElementById('btn-restart').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('btn-rain').addEventListener('click', () => {
            const isRaining = this.renderer.toggleRain();
            document.getElementById('btn-rain').innerText = isRaining ? '🌧️' : '☀️';
        });

        document.getElementById('btn-audio').addEventListener('click', () => {
            const state = this.audio.toggle();
            document.getElementById('btn-audio').innerText = state ? '🔊' : '🔇';
        });
    }
}

// Launch Game on Ready
window.addEventListener('DOMContentLoaded', () => {
    new CanyonSurferGame();
});
