/* ==========================================================================
   Three.js Engine - Photorealistic Lighting, Dynamic FOV & Camera Shake
   ========================================================================== */

export class Renderer {
    constructor(containerEl) {
        this.container = containerEl;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        
        // Camera (Dynamic FOV with speed)
        this.baseFov = 60;
        this.targetFov = 60;
        this.camera = new THREE.PerspectiveCamera(this.baseFov, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 7.5, 13.5);
        this.camera.lookAt(0, 1.8, -20);

        // WebGL Renderer with ACESFilmic Tone Mapping
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        this.container.appendChild(this.renderer.domElement);

        this.isRaining = false;
        this.shakeIntensity = 0;
        this.shakeDecay = 0.9;

        this.initLights();
        this.buildHighwayLandscape();
        this.initRainSystem();

        window.addEventListener('resize', () => this.resize());
    }

    initLights() {
        // High-Efficiency Photorealistic Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xfff5ea, 1.3);
        this.sunLight.position.set(30, 50, 20);
        this.scene.add(this.sunLight);

        const fillLight = new THREE.DirectionalLight(0x70aaff, 0.5);
        fillLight.position.set(-30, 20, -20);
        this.scene.add(fillLight);
    }

    initRainSystem() {
        const rainCount = 400;
        const rainGeo = new THREE.BufferGeometry();
        const rainPos = new Float32Array(rainCount * 3);

        for (let r = 0; r < rainCount; r++) {
            rainPos[r * 3] = (Math.random() - 0.5) * 32;
            rainPos[r * 3 + 1] = Math.random() * 25 + 5;
            rainPos[r * 3 + 2] = -Math.random() * 180 + 20;
        }

        rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
        const rainMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.25, transparent: true, opacity: 0.75 });
        this.rainPoints = new THREE.Points(rainGeo, rainMat);
        this.rainPoints.visible = false;
        this.rainPoints.frustumCulled = false;
        this.scene.add(this.rainPoints);
    }

    toggleRain() {
        this.isRaining = !this.isRaining;
        this.rainPoints.visible = this.isRaining;
        return this.isRaining;
    }

    triggerShake(amount = 0.4) {
        this.shakeIntensity = Math.min(1.2, this.shakeIntensity + amount);
    }

    setSpeedFov(speedFactor) {
        // Speed Factor 1.0 (120 KM/H) -> FOV 60 | Speed Factor 2.0 (240 KM/H) -> FOV 72
        this.targetFov = Math.min(74, this.baseFov + (speedFactor - 0.8) * 12);
        this.camera.fov += (this.targetFov - this.camera.fov) * 0.05;
        this.camera.updateProjectionMatrix();
    }

    buildHighwayLandscape() {
        this.landscapeGroup = new THREE.Group();

        // 1. Distant Mountain Peaks
        const mountainMat1 = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
        const mountainMat2 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
        const pineMat = new THREE.MeshStandardMaterial({ color: 0x0f3822, roughness: 0.7 });
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.8 });

        for (let m = 0; m < 24; m++) {
            const side = m % 2 === 0 ? -1 : 1;
            const dist = Math.random() * 20 + 35;
            const posX = dist * side;
            const posZ = -m * 18;

            const peakHeight = Math.random() * 25 + 30;
            const peakRadius = Math.random() * 15 + 20;
            const peak = new THREE.Mesh(new THREE.ConeGeometry(peakRadius, peakHeight, 7), m % 2 === 0 ? mountainMat1 : mountainMat2);
            peak.position.set(posX, peakHeight / 2 - 5, posZ);
            peak.frustumCulled = false;
            this.landscapeGroup.add(peak);
        }

        // 2. Highway Steel Guardrails & Street Lamp Posts
        const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
        const lampMat = new THREE.MeshStandardMaterial({ color: 0xffb703, emissive: 0xffb703, emissiveIntensity: 0.6 });

        for (let r = 0; r < 20; r++) {
            const posZ = -r * 20;

            const railL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 20), railMat);
            railL.position.set(-6.8, 0.4, posZ); railL.frustumCulled = false;
            const railR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 20), railMat);
            railR.position.set(6.8, 0.4, posZ); railR.frustumCulled = false;

            this.landscapeGroup.add(railL); this.landscapeGroup.add(railR);

            if (r % 2 === 0) {
                const lampPost = new THREE.Group();
                const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 8, 8), railMat);
                pole.position.set(-7.5, 4, posZ);
                const arm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.12), railMat);
                arm.position.set(-6.6, 7.8, posZ);
                const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), lampMat);
                bulb.position.set(-5.7, 7.6, posZ);

                lampPost.add(pole); lampPost.add(arm); lampPost.add(bulb);
                lampPost.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
                this.landscapeGroup.add(lampPost);
            }

            // Pine Trees along Canyon
            const treeL = new THREE.Group();
            const trunkL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4, 8), trunkMat); trunkL.position.y = 2;
            const foliageL = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 7), pineMat); foliageL.position.y = 6;
            treeL.add(trunkL); treeL.add(foliageL);
            treeL.position.set(-12 - Math.random() * 5, 0, posZ + 5);
            treeL.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
            this.landscapeGroup.add(treeL);

            const treeR = new THREE.Group();
            const trunkR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4, 8), trunkMat); trunkR.position.y = 2;
            const foliageR = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 7), pineMat); foliageR.position.y = 6;
            treeR.add(trunkR); treeR.add(foliageR);
            treeR.position.set(12 + Math.random() * 5, 0, posZ + 5);
            treeR.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
            this.landscapeGroup.add(treeR);
        }

        // 3. Drifting Clouds
        this.cloudsGroup = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        for (let c = 0; c < 10; c++) {
            const cloud = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 4 + 5, 8, 8), cloudMat);
            cloud.position.set((Math.random() - 0.5) * 100, Math.random() * 12 + 30, -Math.random() * 220);
            cloud.frustumCulled = false;
            this.cloudsGroup.add(cloud);
        }
        this.landscapeGroup.add(this.cloudsGroup);

        this.scene.add(this.landscapeGroup);
        this.updateSkyCycle(0);
    }

    updateSkyCycle(distanceMeters) {
        const cycle = (distanceMeters % 3000) / 3000;
        let skyColor, fogColor, lightIntensity;

        if (cycle < 0.4) {
            skyColor = new THREE.Color(0x38bdf8);
            fogColor = new THREE.Color(0xbae6fd);
            lightIntensity = 1.25;
        } else if (cycle < 0.7) {
            skyColor = new THREE.Color(0xf97316);
            fogColor = new THREE.Color(0xfdba74);
            lightIntensity = 0.95;
        } else {
            skyColor = new THREE.Color(0x0f172a);
            fogColor = new THREE.Color(0x1e293b);
            lightIntensity = 0.5;
        }

        this.scene.background = skyColor;
        this.scene.fog = new THREE.FogExp2(fogColor, 0.003);
        this.sunLight.intensity = lightIntensity;
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    render() {
        if (this.isRaining && this.rainPoints) {
            const pos = this.rainPoints.geometry.attributes.position.array;
            for (let r = 0; r < pos.length / 3; r++) {
                pos[r * 3 + 1] -= 0.8;
                if (pos[r * 3 + 1] < 0) pos[r * 3 + 1] = 25;
            }
            this.rainPoints.geometry.attributes.position.needsUpdate = true;
        }

        // Apply Screen Shake if active
        if (this.shakeIntensity > 0.01) {
            this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
            this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= this.shakeDecay;
        }

        this.renderer.render(this.scene, this.camera);
    }
}
