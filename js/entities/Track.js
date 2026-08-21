/* ==========================================================================
   Track - Photorealistic Highway, 24K Gold Bars, Police SUVs & Armored Vans
   ========================================================================== */

export class Track {
    constructor(scene) {
        this.scene = scene;
        this.tracks = [];
        this.items = [];
        this.spawnTimer = 0;

        this.initSharedResources();
        this.buildPermanentAsphaltGround();
        this.initHighwayTrack();
    }

    createFastAsphaltTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Dark Asphalt Base
        ctx.fillStyle = '#151922';
        ctx.fillRect(0, 0, 256, 256);

        // Center Yellow Double Divider Lines
        ctx.fillStyle = '#ffb703';
        ctx.fillRect(124, 0, 3, 256);
        ctx.fillRect(129, 0, 3, 256);

        // White Shoulder Lines
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(10, 0, 6, 256);
        ctx.fillRect(240, 0, 6, 256);

        // Dashed Lane Guides
        ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
        for (let y = 0; y < 256; y += 40) {
            ctx.fillRect(70, y, 2, 20);
            ctx.fillRect(184, y, 2, 20);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 4);
        return texture;
    }

    initSharedResources() {
        this.asphaltTexture = this.createFastAsphaltTexture();

        // Flat Asphalt Road Material
        this.roadGeo = new THREE.BoxGeometry(14, 0.4, 25);
        this.asphaltMat = new THREE.MeshStandardMaterial({ map: this.asphaltTexture, roughness: 0.7, metalness: 0.2 });

        // Tire Skid Mark Material
        this.skidMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });

        // Police SUV Interceptor Materials
        this.policeBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.85 });
        this.policeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
        this.glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.05, transparent: true, opacity: 0.85 });
        this.wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
        this.chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.05 });
        this.redLED = new THREE.MeshBasicMaterial({ color: 0xff0033 });
        this.blueLED = new THREE.MeshBasicMaterial({ color: 0x00f3ff });

        // Armored Security Bank Van Materials
        this.armoredBodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.7, roughness: 0.2 });
        this.armoredSilverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
        this.goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

        // Dollar Cash Stack & 24K GOLD BULLION BAR Materials
        this.cashGeo = new THREE.BoxGeometry(0.75, 0.18, 0.45);
        this.cashMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.4 });
        this.cashBandGeo = new THREE.BoxGeometry(0.77, 0.2, 0.14);
        this.cashBandMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        this.goldBarGeo = new THREE.BoxGeometry(0.85, 0.22, 0.45);
        this.goldBarMat = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.35,
            metalness: 0.6,
            roughness: 0.2
        });

        // Barricade & Toll Gate Materials
        this.barricadeMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3 });
        this.blackStripeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        this.rubberFootMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

        this.tollGateGeo = new THREE.BoxGeometry(3.2, 1.6, 0.4);
        this.tollGateMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3, metalness: 0.3 });
    }

    buildPermanentAsphaltGround() {
        const groundGeo = new THREE.BoxGeometry(16, 0.35, 1200);
        this.permanentGround = new THREE.Mesh(groundGeo, this.asphaltMat);
        this.permanentGround.position.set(0, -0.22, -450);
        this.permanentGround.frustumCulled = false;
        this.scene.add(this.permanentGround);
    }

    initHighwayTrack() {
        for (let i = -2; i < 22; i++) {
            this.spawnTrackSection(-i * 20);
        }
    }

    spawnTrackSection(posZ) {
        const group = new THREE.Group();
        const road = new THREE.Mesh(this.roadGeo, this.asphaltMat);
        road.position.set(0, -0.2, posZ);
        group.add(road);

        // Realistic Tire Skid Marks on Road
        if (Math.random() < 0.35) {
            const skidL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 6.0), this.skidMat);
            skidL.position.set(-2.0, 0.01, posZ);
            const skidR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 6.0), this.skidMat);
            skidR.position.set(2.0, 0.01, posZ);
            group.add(skidL); group.add(skidR);
        }

        group.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        this.scene.add(group);
        this.tracks.push(group);
    }

    createDollarCashStack(pos) {
        const cashGroup = new THREE.Group();
        const stack = new THREE.Mesh(this.cashGeo, this.cashMat); cashGroup.add(stack);
        const band = new THREE.Mesh(this.cashBandGeo, this.cashBandMat); cashGroup.add(band);

        cashGroup.position.set(pos.x, 0.15, pos.z);
        cashGroup.userData = { type: 'CASH' };
        cashGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return cashGroup;
    }

    createGoldBullionBar(pos) {
        const goldGroup = new THREE.Group();
        const bar = new THREE.Mesh(this.goldBarGeo, this.goldBarMat); goldGroup.add(bar);

        goldGroup.position.set(pos.x, 0.15, pos.z);
        goldGroup.userData = { type: 'GOLDBAR' };
        goldGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return goldGroup;
    }

    createRealisticPoliceSUV(pos) {
        const suvGroup = new THREE.Group();

        // Main SUV Body
        const mainBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 5.8), this.policeBodyMat);
        mainBody.position.y = 0.9;
        suvGroup.add(mainBody);

        // White Police Door Panels
        const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 2.4), this.policeWhiteMat);
        doorL.position.set(-1.51, 0.9, 0);
        const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 2.4), this.policeWhiteMat);
        doorR.position.set(1.51, 0.9, 0);
        suvGroup.add(doorL); suvGroup.add(doorR);

        // Cabin & Windows
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.0, 3.2), this.policeBodyMat);
        cabin.position.set(0, 1.9, -0.2);
        suvGroup.add(cabin);

        const glassF = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.1), this.glassMat);
        glassF.position.set(0, 1.9, 1.35);
        suvGroup.add(glassF);

        // Front Chrome Bumper Guard
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.6, 0.3), this.chromeMat);
        bumper.position.set(0, 0.6, 2.95);
        suvGroup.add(bumper);

        // 4 Wheels with Rims
        const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 12);
        const wheelFL = new THREE.Mesh(wheelGeo, this.wheelMat); wheelFL.rotation.z = Math.PI / 2; wheelFL.position.set(-1.45, 0.5, 1.8);
        const wheelFR = new THREE.Mesh(wheelGeo, this.wheelMat); wheelFR.rotation.z = Math.PI / 2; wheelFR.position.set(1.45, 0.5, 1.8);
        const wheelRL = new THREE.Mesh(wheelGeo, this.wheelMat); wheelRL.rotation.z = Math.PI / 2; wheelRL.position.set(-1.45, 0.5, -1.8);
        const wheelRR = new THREE.Mesh(wheelGeo, this.wheelMat); wheelRR.rotation.z = Math.PI / 2; wheelRR.position.set(1.45, 0.5, -1.8);
        suvGroup.add(wheelFL); suvGroup.add(wheelFR); suvGroup.add(wheelRL); suvGroup.add(wheelRR);

        // Flashing Emergency Lightbars
        const redL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.4), this.redLED); redL.position.set(-0.7, 2.45, -0.2);
        const blueR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.4), this.blueLED); blueR.position.set(0.7, 2.45, -0.2);
        suvGroup.add(redL); suvGroup.add(blueR);

        suvGroup.position.set(pos.x, 0, pos.z);
        suvGroup.userData = { type: 'POLICE' };
        suvGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return suvGroup;
    }

    createArmoredBankVan(pos) {
        const vanGroup = new THREE.Group();

        const body = new THREE.Mesh(new THREE.BoxGeometry(3.1, 2.2, 7.0), this.armoredBodyMat); body.position.y = 1.1;
        vanGroup.add(body);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.2, 7.1), this.armoredSilverMat); roof.position.y = 2.25;
        vanGroup.add(roof);
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 0.4), this.chromeMat); bumper.position.set(0, 0.5, 3.55);
        vanGroup.add(bumper);
        const goldStripe = new THREE.Mesh(new THREE.BoxGeometry(3.12, 0.25, 6.8), this.goldTrimMat); goldStripe.position.y = 1.2;
        vanGroup.add(goldStripe);

        const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.4, 16);
        const wheelFL = new THREE.Mesh(wheelGeo, this.wheelMat); wheelFL.rotation.z = Math.PI / 2; wheelFL.position.set(-1.5, 0.55, 2.2);
        const wheelFR = new THREE.Mesh(wheelGeo, this.wheelMat); wheelFR.rotation.z = Math.PI / 2; wheelFR.position.set(1.5, 0.55, 2.2);
        const wheelRL = new THREE.Mesh(wheelGeo, this.wheelMat); wheelRL.rotation.z = Math.PI / 2; wheelRL.position.set(-1.5, 0.55, -2.2);
        const wheelRR = new THREE.Mesh(wheelGeo, this.wheelMat); wheelRR.rotation.z = Math.PI / 2; wheelRR.position.set(1.5, 0.55, -2.2);
        vanGroup.add(wheelFL); vanGroup.add(wheelFR); vanGroup.add(wheelRL); vanGroup.add(wheelRR);

        vanGroup.position.set(pos.x, 0, pos.z);
        vanGroup.userData = { type: 'ARMORED' };
        vanGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return vanGroup;
    }

    createRealisticBarricade(pos) {
        const hurdleGroup = new THREE.Group();
        const bar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.65, 0.25), this.barricadeMat); bar.position.y = 0.55;
        hurdleGroup.add(bar);

        for (let s = -1.0; s <= 1.0; s += 0.6) {
            const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.67, 0.27), this.blackStripeMat); stripe.position.set(s, 0.55, 0);
            hurdleGroup.add(stripe);
        }

        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 12), this.rubberFootMat); postL.position.set(-1.3, 0.55, 0);
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 12), this.rubberFootMat); postR.position.set(1.3, 0.55, 0);
        hurdleGroup.add(postL); hurdleGroup.add(postR);

        hurdleGroup.position.set(pos.x, 0, pos.z);
        hurdleGroup.userData = { type: 'HURDLE' };
        hurdleGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return hurdleGroup;
    }

    createTollGate(pos) {
        const tollGroup = new THREE.Group();
        const bar = new THREE.Mesh(this.tollGateGeo, this.tollGateMat);
        tollGroup.add(bar);

        tollGroup.position.set(pos.x, 0, pos.z);
        tollGroup.userData = { type: 'BARRIER' };
        tollGroup.traverse(child => { if (child.isMesh) child.frustumCulled = false; });
        return tollGroup;
    }

    spawnGuaranteedSolvablePattern(posZ) {
        const lanes = [-3.5, 0, 3.5];
        const patternType = Math.floor(Math.random() * 4);

        if (patternType === 0) {
            // 2 Barricades + 1 On-Road Cash Stream
            const safeLaneIdx = Math.floor(Math.random() * 3);
            for (let i = 0; i < 3; i++) {
                if (i === safeLaneIdx) {
                    for (let c = 0; c < 5; c++) {
                        const cash = this.createDollarCashStack({ x: lanes[i], y: 0.15, z: posZ - c * 2.2 });
                        this.scene.add(cash); this.items.push(cash);
                    }
                } else {
                    const hurdle = this.createRealisticBarricade({ x: lanes[i], y: 0, z: posZ });
                    this.scene.add(hurdle); this.items.push(hurdle);
                }
            }
        } else if (patternType === 1) {
            // 1 Police SUV + 1 Barricade + 1 On-Road Gold Bullion Bar Stream
            const policeLaneIdx = Math.floor(Math.random() * 3);
            let safeLaneIdx = (policeLaneIdx + 1) % 3;

            for (let i = 0; i < 3; i++) {
                if (i === policeLaneIdx) {
                    const police = this.createRealisticPoliceSUV({ x: lanes[i], y: 0, z: posZ });
                    this.scene.add(police); this.items.push(police);
                } else if (i === safeLaneIdx) {
                    for (let d = 0; d < 3; d++) {
                        const gold = this.createGoldBullionBar({ x: lanes[i], y: 0.15, z: posZ - d * 3.0 });
                        this.scene.add(gold); this.items.push(gold);
                    }
                } else {
                    const hurdle = this.createRealisticBarricade({ x: lanes[i], y: 0, z: posZ });
                    this.scene.add(hurdle); this.items.push(hurdle);
                }
            }
        } else if (patternType === 2) {
            // 1 Armored Bank Van + 1 Barricade + 1 On-Road Cash Stream
            const vanLaneIdx = Math.floor(Math.random() * 3);
            let safeLaneIdx = (vanLaneIdx + 1) % 3;

            for (let i = 0; i < 3; i++) {
                if (i === vanLaneIdx) {
                    const van = this.createArmoredBankVan({ x: lanes[i], y: 0, z: posZ });
                    this.scene.add(van); this.items.push(van);
                } else if (i === safeLaneIdx) {
                    for (let c = 0; c < 5; c++) {
                        const cash = this.createDollarCashStack({ x: lanes[i], y: 0.15, z: posZ - c * 2.2 });
                        this.scene.add(cash); this.items.push(cash);
                    }
                } else {
                    const hurdle = this.createRealisticBarricade({ x: lanes[i], y: 0, z: posZ });
                    this.scene.add(hurdle); this.items.push(hurdle);
                }
            }
        } else {
            // 1 Toll Clearance Gate + 2 On-Road Cash Streams
            const tollLaneIdx = Math.floor(Math.random() * 3);
            for (let i = 0; i < 3; i++) {
                if (i === tollLaneIdx) {
                    const toll = this.createTollGate({ x: lanes[i], y: 2.2, z: posZ });
                    this.scene.add(toll); this.items.push(toll);
                } else {
                    for (let c = 0; c < 4; c++) {
                        const cash = this.createDollarCashStack({ x: lanes[i], y: 0.15, z: posZ - c * 2.2 });
                        this.scene.add(cash); this.items.push(cash);
                    }
                }
            }
        }
    }

    update(speed = 1.0) {
        for (const t of this.tracks) {
            t.position.z += speed;
            if (t.position.z > 40) {
                t.position.z -= 440;
            }
        }

        this.spawnTimer++;
        if (this.spawnTimer >= 28) {
            this.spawnTimer = 0;
            this.spawnGuaranteedSolvablePattern(-180);
        }

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.position.z += speed;

            if (item.userData.type === 'CASH' || item.userData.type === 'GOLDBAR') {
                item.rotation.y += 0.05;
            }

            if (item.position.z > 25) {
                this.scene.remove(item);
                this.items.splice(i, 1);
            }
        }
    }

    reset() {
        for (const item of this.items) {
            this.scene.remove(item);
        }
        this.items = [];
        this.spawnTimer = 0;

        for (let z = -30; z >= -180; z -= 35) {
            this.spawnGuaranteedSolvablePattern(z);
        }
    }
}
