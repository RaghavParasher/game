/* ==========================================================================
   Chaser - High-Realism 3D Police Officer Pursuer with Utility Belt
   ========================================================================== */

export class Chaser {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();

        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcd94, roughness: 0.4 });
        const uniformMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25 });
        const hatMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffbe0b, metalness: 0.9, roughness: 0.1 });
        const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });

        // Ground Contact Shadow
        this.groundShadow = new THREE.Mesh(new THREE.CircleGeometry(0.7, 16), shadowMat);
        this.groundShadow.rotation.x = -Math.PI / 2;
        this.groundShadow.position.y = 0.02;
        this.group.add(this.groundShadow);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), skinMat);
        head.position.y = 2.0;
        this.group.add(head);

        // Police Officer Hat & Visor
        const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.55, 0.25, 16), hatMat);
        hat.position.y = 2.45;
        this.group.add(hat);

        const hatVisor = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.4), hatMat);
        hatVisor.position.set(0, 2.38, 0.45);
        this.group.add(hatVisor);

        // Gold Police Star Badge on Hat
        const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8), goldMat);
        badge.rotation.x = Math.PI / 2;
        badge.position.set(0, 2.5, 0.55);
        this.group.add(badge);

        // Mustache & Angry Eyes
        const stache = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.15), new THREE.MeshBasicMaterial({ color: 0x331100 }));
        stache.position.set(0, 1.9, 0.5);
        this.group.add(stache);

        const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.2, 2.05, 0.48);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.2, 2.05, 0.48);
        this.group.add(eyeL); this.group.add(eyeR);

        // Torso / Navy Police Jacket
        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.65), uniformMat);
        torso.position.y = 1.25;
        this.group.add(torso);

        // Police Utility Belt (Radio Clip, Handcuffs, Holster)
        const belt = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 0.7), beltMat);
        belt.position.y = 0.65;
        this.group.add(belt);

        const radio = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.2), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        radio.position.set(-0.45, 0.65, 0.35);
        const holster = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.25), beltMat);
        holster.position.set(0.45, 0.65, 0.35);
        this.group.add(radio); this.group.add(holster);

        // --- Arms ---
        const armGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.9, 8);
        this.armLeftGroup = new THREE.Group();
        this.armLeftGroup.position.set(-0.65, 1.7, 0);
        const armL = new THREE.Mesh(armGeo, uniformMat); armL.position.y = -0.4;
        this.armLeftGroup.add(armL);
        this.group.add(this.armLeftGroup);

        this.armRightGroup = new THREE.Group();
        this.armRightGroup.position.set(0.65, 1.7, 0);
        const armR = new THREE.Mesh(armGeo, uniformMat); armR.position.y = -0.4;
        this.armRightGroup.add(armR);
        this.group.add(this.armRightGroup);

        // --- Legs & Tactical Boots ---
        const legGeo = new THREE.CylinderGeometry(0.18, 0.16, 1.0, 8);
        this.legLeftGroup = new THREE.Group();
        this.legLeftGroup.position.set(-0.3, 0.8, 0);
        const legL = new THREE.Mesh(legGeo, uniformMat); legL.position.y = -0.4;
        this.legLeftGroup.add(legL);
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.55), hatMat);
        bootL.position.set(0, -0.85, 0.1);
        this.legLeftGroup.add(bootL);
        this.group.add(this.legLeftGroup);

        this.legRightGroup = new THREE.Group();
        this.legRightGroup.position.set(0.3, 0.8, 0);
        const legR = new THREE.Mesh(legGeo, uniformMat); legR.position.y = -0.4;
        this.legRightGroup.add(legR);
        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.55), hatMat);
        bootR.position.set(0, -0.85, 0.1);
        this.legRightGroup.add(bootR);
        this.group.add(this.legRightGroup);

        this.group.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        this.mesh = this.group;
        this.mesh.position.set(0, 0, 3.8);
        scene.add(this.mesh);

        this.animTimer = 0;
    }

    update(playerX, isStumbling = false) {
        this.mesh.position.x += (playerX - this.mesh.position.x) * 0.2;
        const targetZ = isStumbling ? 2.0 : 3.8;
        this.mesh.position.z += (targetZ - this.mesh.position.z) * 0.1;

        this.animTimer += 0.22;
        const swing = Math.sin(this.animTimer) * 0.7;
        this.legLeftGroup.rotation.x = swing;
        this.legRightGroup.rotation.x = -swing;
        this.armLeftGroup.rotation.x = -swing;
        this.armRightGroup.rotation.x = swing;
        this.mesh.position.y = Math.abs(Math.sin(this.animTimer)) * 0.2;
    }

    reset() {
        this.mesh.position.set(0, 0, 3.8);
        this.animTimer = 0;
    }
}
