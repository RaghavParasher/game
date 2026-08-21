/* ==========================================================================
   Input Handler - 60 FPS Key-Repeat Protection & Simplified Arcade Controls
   ========================================================================== */

export class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this.jump = false;
        this.slide = false;

        this.initKeyboard();
        this.initTouch();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            // Block auto-repeat keydown events to guarantee 60 FPS smoothness
            if (e.repeat) return;

            const key = e.key.toLowerCase();

            // Prevent default page scroll on Space
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                return;
            }

            if (key === 'a' || e.key === 'ArrowLeft') {
                this.left = true;
            } else if (key === 'd' || e.key === 'ArrowRight') {
                this.right = true;
            } else if (key === 'w' || e.key === 'ArrowUp') {
                this.jump = true;
            } else if (key === 's' || e.key === 'ArrowDown') {
                this.slide = true;
            }
        });
    }

    initTouch() {
        const btnL = document.getElementById('touch-left');
        const btnR = document.getElementById('touch-right');
        const btnJ = document.getElementById('touch-jump');
        const btnS = document.getElementById('touch-slide');

        if (btnL) btnL.addEventListener('touchstart', (e) => { e.preventDefault(); this.left = true; });
        if (btnR) btnR.addEventListener('touchstart', (e) => { e.preventDefault(); this.right = true; });
        if (btnJ) btnJ.addEventListener('touchstart', (e) => { e.preventDefault(); this.jump = true; });
        if (btnS) btnS.addEventListener('touchstart', (e) => { e.preventDefault(); this.slide = true; });
    }
}
