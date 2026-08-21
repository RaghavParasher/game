/* ==========================================================================
   Player - 3D Escaped Inmate Fugitive (Orange Jumpsuit, Handcuffs & Cash Bag)
   ========================================================================== */

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.laneWidth = 3.5;
        this.targetLane = 0;
        this.currentX = 0;

        this.group = new THREE.Group();

        // --- Materials for Escaped Inmate ---
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.4 });
        const orangeJumpsuitMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.5 }); // Bright Orange Prison Uniform
        const stripeBlackMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 }); // Black Stripes
        const beanieMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 }); // Dark Beanie
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.1 }); // Handcuffs
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });

        // --- Contact Ground Shadow (Grounds the runner on the road!) ---
        this.groundShadow = new THREE.Mesh(new THREE.CircleGeometry(0.65, 16), shadowMat);
        this.groundShadow.rotation.x = -Math.PI / 2;
        this.groundShadow.position.y = 0.02;
        this.group.add(this.groundShadow);

        // --- Head & Dark Beanie ---
        const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 1.85;
        this.group.add(head);

        const beanie = new THREE.Mesh(new THREE.SphereGeometry(0.53, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8), beanieMat);
        beanie.position.y = 1.9;
        this.group.add(beanie);

        // Aviator Sunglasses
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
        const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.15), glassMat);
        glasses.position.set(0, 1.88, 0.44);
        this.group.add(glasses);

        // --- Torso / Orange Prison Jumpsuit with Stripes ---
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.55), orangeJumpsuitMat);
        torso.position.y = 1.1;
        this.group.add(torso);

        // Black Prison Stripes across Torso
        for (let stripeY = 0.7; stripeY <= 1.5; stripeY += 0.3) {
            const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.57), stripeBlackMat);
            stripe.position.y = stripeY;
            this.group.add(stripe);
        }

        // Stamped Inmate ID Badge Plate ("INMATE 9920")
        const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.04), stripeBlackMat);
        idBadge.position.set(0, 1.3, 0.3);
        this.group.add(idBadge);

        // --- Dangling Wrist Handcuffs ---
        const cuffL = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), chromeMat);
        cuffL.position.set(-0.55, 0.95, 0.2);
        this.group.add(cuffL);

        // --- Stolen Cash Duffel Bag (Expands on Back!) ---
        const duffelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        this.duffelBag = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.45), duffelMat);
        this.duffelBag.position.set(0, 1.25, -0.45);
        this.group.add(this.duffelBag);

        // --- Arms (Orange Jumpsuit Sleeves) ---
        const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.8, 8);
        this.armLeftGroup = new THREE.Group();
        this.armLeftGroup.position.set(-0.55, 1.5, 0);
        const armL = new THREE.Mesh(armGeo, orangeJumpsuitMat); armL.position.y = -0.35;
        this.armLeftGroup.add(armL);
        this.group.add(this.armLeftGroup);

        this.armRightGroup = new THREE.Group();
        this.armRightGroup.position.set(0.55, 1.5, 0);
        const armR = new THREE.Mesh(armGeo, orangeJumpsuitMat); armR.position.y = -0.35;
        this.armRightGroup.add(armR);
        this.group.add(this.armRightGroup);

        // --- Legs & Sneakers ---
        const legGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.9, 8);
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.2 });

        this.legLeftGroup = new THREE.Group();
        this.legLeftGroup.position.set(-0.25, 0.7, 0);
        const legL = new THREE.Mesh(legGeo, orangeJumpsuitMat); legL.position.y = -0.35;
        this.legLeftGroup.add(legL);
        const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), shoeMat);
        shoeL.position.set(0, -0.75, 0.1);
        this.legLeftGroup.add(shoeL);
        this.group.add(this.legLeftGroup);

        this.legRightGroup = new THREE.Group();
        this.legRightGroup.position.set(0.25, 0.7, 0);
        const legR = new THREE.Mesh(legGeo, orangeJumpsuitMat); legR.position.y = -0.35;
        this.legRightGroup.add(legR);
        const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), shoeMat);
        shoeR.position.set(0, -0.75, 0.1);
        this.legRightGroup.add(shoeR);
        this.group.add(this.legRightGroup);

        this.group.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        this.mesh = this.group;
        this.mesh.position.set(0, 0, 0);
        scene.add(this.mesh);

        // Rock-Solid Physics State
        this.vy = 0;
        this.gravity = 0.022;
        this.jumpForce = 0.40;
        this.grounded = true;
        this.isSliding = false;
        this.slideTimer = 0;
        this.animTimer = 0;
    }

    expandDuffelBag(lootCount) {
        const scale = Math.min(2.2, 1.0 + lootCount * 0.04);
        this.duffelBag.scale.set(scale, scale, scale);
    }

    reset() {
        this.targetLane = 0;
        this.currentX = 0;
        this.mesh.position.set(0, 0, 0);
        this.mesh.scale.set(1, 1, 1);
        this.duffelBag.scale.set(1, 1, 1);
        this.vy = 0;
        this.grounded = true;
        this.isSliding = false;
        this.slideTimer = 0;
        this.animTimer = 0;
    }

    shiftLane(dir) {
        this.targetLane = Math.max(-1, Math.min(1, this.targetLane + dir));
    }

    jump() {
        if (this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }
    }

    slide() {
        if (this.grounded && !this.isSliding) {
            this.isSliding = true;
            this.slideTimer = 25;
            this.mesh.scale.y = 0.5;
        }
    }

    update() {
        // Smooth Lane Shift
        const targetX = this.targetLane * this.laneWidth;
        this.currentX += (targetX - this.currentX) * 0.25;
        this.mesh.position.x = this.currentX;

        // Rock-Solid Jump & Gravity Physics
        if (!this.grounded) {
            this.mesh.position.y += this.vy;
            this.vy -= this.gravity;

            if (this.mesh.position.y <= 0) {
                this.mesh.position.y = 0;
                this.vy = 0;
                this.grounded = true;
            }
        }

        // Running Animation
        if (this.grounded && !this.isSliding) {
            this.animTimer += 0.22;
            const swing = Math.sin(this.animTimer) * 0.6;
            this.legLeftGroup.rotation.x = swing;
            this.legRightGroup.rotation.x = -swing;
            this.armLeftGroup.rotation.x = -swing;
            this.armRightGroup.rotation.x = swing;
        } else {
            this.legLeftGroup.rotation.x = 0;
            this.legRightGroup.rotation.x = 0;
            this.armLeftGroup.rotation.x = 0;
            this.armRightGroup.rotation.x = 0;
        }

        // Handle Slide Duration
        if (this.isSliding) {
            this.slideTimer--;
            if (this.slideTimer <= 0) {
                this.isSliding = false;
                this.mesh.scale.y = 1.0;
            }
        }
    }
}
