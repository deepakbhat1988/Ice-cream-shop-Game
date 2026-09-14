import * as THREE from 'three';

export interface PanoramicHillController {
  group: THREE.Group;
  update: (delta: number, elapsedTime: number) => void;
}

/**
 * Procedural Realistic Hillside Grass & Meadow Texture
 * Features grass blades, earth tones, winding dirt trail, and scattered wildflowers
 */
function createRealisticHillsideTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Natural sunlight gradient across the meadow
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#52B788');   // Sunlit lush spring green
  grad.addColorStop(0.35, '#38A169'); // Rich meadow green
  grad.addColorStop(0.7, '#2F855A');  // Deep hill crest green
  grad.addColorStop(1, '#276749');   // Forest shade green
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Fine grass blade & earthen noise specks
  for (let i = 0; i < 2800; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const isHighlight = Math.random() > 0.5;
    ctx.fillStyle = isHighlight ? 'rgba(255, 255, 255, 0.09)' : 'rgba(20, 60, 20, 0.12)';
    ctx.fillRect(x, y, 2, 5 + Math.random() * 4);
  }

  // 3. Organic Winding Hillside Dirt Footpath (meanders through the meadow)
  ctx.strokeStyle = '#D4A373';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(350, 1024);
  ctx.bezierCurveTo(420, 750, 260, 500, 480, 280);
  ctx.bezierCurveTo(620, 150, 700, 180, 820, 80);
  ctx.stroke();

  // Subtle path dirt texture overlay
  ctx.strokeStyle = '#C5905C';
  ctx.lineWidth = 14;
  ctx.stroke();

  // 4. Wildflower clusters (Poppies, Dandelions, Chamomile, Lavender)
  const flowers = [
    { color: '#EF4444', size: 3.5 }, // Red poppy
    { color: '#FBBF24', size: 3.0 }, // Golden dandelion
    { color: '#FFFFFF', size: 3.2 }, // White daisy
    { color: '#C084FC', size: 3.8 }, // Purple lavender
    { color: '#F472B6', size: 3.0 }, // Wild rose
  ];

  for (let f = 0; f < 900; f++) {
    const flower = flowers[f % flowers.length];
    ctx.fillStyle = flower.color;
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.beginPath();
    ctx.arc(x, y, flower.size + (Math.random() - 0.5) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

/**
 * Procedural Sky Dome Texture with realistic atmospheric gradient and warm sun halo
 */
function createRealisticSkyDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Smooth atmospheric sky gradient: Azure zenith fading to warm golden horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  skyGrad.addColorStop(0.0, '#1E40AF'); // Deep zenith blue
  skyGrad.addColorStop(0.3, '#3B82F6'); // Vibrant cerulean
  skyGrad.addColorStop(0.65, '#93C5FD'); // Atmospheric mist blue
  skyGrad.addColorStop(0.88, '#E0F2FE'); // Soft horizon haze
  skyGrad.addColorStop(1.0, '#FEF08A');  // Golden morning sunlight near horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Radiant Warm Sun with Soft Lens Glow
  const sunGrad = ctx.createRadialGradient(720, 260, 10, 720, 260, 240);
  sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  sunGrad.addColorStop(0.15, 'rgba(254, 240, 138, 0.95)');
  sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.4)');
  sunGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.12)');
  sunGrad.addColorStop(1.0, 'rgba(251, 191, 36, 0.0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(720, 260, 240, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds the Highly Realistic Panoramic Outdoor Hill Landscape
 */
export function createPanoramicHillLandscape(): PanoramicHillController {
  const root = new THREE.Group();
  root.name = 'panoramic_hill_landscape';

  // 1. Panoramic Skydome Sphere (Surrounds the entire outdoor vista)
  const skyGeom = new THREE.SphereGeometry(65, 32, 24);
  const skyTex = createRealisticSkyDomeTexture();
  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    side: THREE.BackSide,
    fog: false, // Sky stays vibrant through atmospheric fog
  });
  const skyDome = new THREE.Mesh(skyGeom, skyMat);
  skyDome.position.set(0, 5, -15);
  root.add(skyDome);

  // 2. Rolling Hillside 3D Terrain with Detailed Vertex Sculpting
  const terrainGeom = new THREE.PlaneGeometry(70, 55, 80, 60);
  terrainGeom.rotateX(-Math.PI / 2);

  const pos = terrainGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const distFromShop = Math.abs(z);

    let height = 0;
    // Base elevation gradient rising smoothly in the distance
    height += Math.max(0, (distFromShop - 4.2) * 0.32);

    // Center-right majestic hill (Where the windmill proudly stands)
    const hillCenter = Math.exp(-((x - 4.5) ** 2 + (z + 18) ** 2) / 130) * 7.5;

    // Left rolling crest (Where the cottage overlooks the valley)
    const hillLeft = Math.exp(-((x + 13) ** 2 + (z + 16) ** 2) / 150) * 9.2;

    // Far right rolling hill ridge
    const hillRight = Math.exp(-((x - 17) ** 2 + (z + 17) ** 2) / 170) * 8.0;

    // Secondary foreground slopes
    const hillFore = Math.exp(-((x + 4) ** 2 + (z + 10) ** 2) / 70) * 2.8;

    // Micro undulating terrain waves
    const waves = Math.sin(x * 0.22) * Math.cos(z * 0.18) * 0.65;

    height += hillCenter + hillLeft + hillRight + hillFore + waves;

    // Keep terrace and veranda level
    if (distFromShop < 5.5) {
      height = Math.min(height, 0);
    }

    pos.setY(i, height);
  }
  terrainGeom.computeVertexNormals();

  const grassTex = createRealisticHillsideTexture();
  const hillMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 0.8,
    metalness: 0.01,
  });

  const terrain = new THREE.Mesh(terrainGeom, hillMat);
  terrain.position.set(0, -0.05, -20);
  terrain.receiveShadow = true;
  root.add(terrain);

  // 3. Natural Hillside Boulders & Rock Outcrops (Limestone & Slate)
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x94A3B8,
    roughness: 0.85,
    metalness: 0.05,
  });
  const rockPositions = [
    { x: -6.5, y: 3.1, z: -13.5, s: 0.9 },
    { x: -7.2, y: 3.3, z: -14.2, s: 0.65 },
    { x: 3.2, y: 4.8, z: -16.2, s: 1.1 },
    { x: 8.8, y: 4.9, z: -15.8, s: 0.85 },
    { x: -11.5, y: 5.8, z: -17.5, s: 1.3 },
    { x: 14.2, y: 5.2, z: -16.8, s: 1.0 },
    { x: -1.5, y: 2.2, z: -11.8, s: 0.75 },
  ];

  rockPositions.forEach(rp => {
    const rockGeom = new THREE.DodecahedronGeometry(rp.s, 1);
    // Displace vertices slightly for organic faceted boulder look
    const rpos = rockGeom.attributes.position;
    for (let j = 0; j < rpos.count; j++) {
      const vx = rpos.getX(j);
      const vy = rpos.getY(j);
      const vz = rpos.getZ(j);
      const noise = (Math.sin(vx * 5) + Math.cos(vy * 5) + Math.sin(vz * 5)) * 0.08;
      rpos.setXYZ(j, vx * (1 + noise), vy * (0.8 + noise), vz * (1 + noise));
    }
    rockGeom.computeVertexNormals();

    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.set(rp.x, rp.y, rp.z);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  });

  // 4. Rustic Wooden Ranch Rail Fence along the Hill Crest
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.85 });
  const fencePosts = [
    { x: 0.5, y: 4.2, z: -15.5 },
    { x: 2.0, y: 5.0, z: -16.5 },
    { x: 3.5, y: 5.8, z: -17.2 },
    { x: 6.5, y: 6.1, z: -17.8 },
    { x: 8.2, y: 5.7, z: -17.4 },
    { x: 10.0, y: 5.2, z: -16.8 },
  ];

  for (let p = 0; p < fencePosts.length; p++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.1, 8), fenceMat);
    post.position.set(fencePosts[p].x, fencePosts[p].y + 0.55, fencePosts[p].z);
    post.castShadow = true;
    root.add(post);

    if (p < fencePosts.length - 1) {
      const p1 = fencePosts[p];
      const p2 = fencePosts[p + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 + 0.65;
      const midZ = (p1.z + p2.z) / 2;
      const dist = Math.hypot(p2.x - p1.x, p2.z - p1.z);
      const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);

      // Upper rail
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(dist, 0.06, 0.05), fenceMat);
      rail1.position.set(midX, midY, midZ);
      rail1.rotation.y = -angle;
      root.add(rail1);

      // Lower rail
      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(dist, 0.06, 0.05), fenceMat);
      rail2.position.set(midX, midY - 0.35, midZ);
      rail2.rotation.y = -angle;
      root.add(rail2);
    }
  }

  // 5. Realistic Dutch Windmill on the Hilltop (x = 4.8, y = 6.6, z = -18.2)
  const windmillGroup = new THREE.Group();
  windmillGroup.position.set(4.8, 6.6, -18.2);

  // Stone base foundation
  const baseGeom = new THREE.CylinderGeometry(1.0, 1.4, 1.2, 16);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.8 });
  const stoneBase = new THREE.Mesh(baseGeom, baseMat);
  stoneBase.position.y = 0.6;
  stoneBase.castShadow = true;
  windmillGroup.add(stoneBase);

  // Octagonal Timber Upper Tower
  const towerGeom = new THREE.CylinderGeometry(0.75, 1.0, 2.6, 8);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.55 });
  const tower = new THREE.Mesh(towerGeom, towerMat);
  tower.position.y = 2.5;
  tower.castShadow = true;
  windmillGroup.add(tower);

  // Terracotta Tile Thatched Windmill Cap
  const capGeom = new THREE.ConeGeometry(0.95, 1.3, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.45 });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = 4.4;
  cap.castShadow = true;
  windmillGroup.add(cap);

  // Balcony walkway around windmill middle
  const balconyGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16);
  const balconyMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.7 });
  const balcony = new THREE.Mesh(balconyGeom, balconyMat);
  balcony.position.y = 1.8;
  windmillGroup.add(balcony);

  // Rotor Hub & 4 Realistic Lattice Blades
  const rotorHub = new THREE.Group();
  rotorHub.position.set(0, 3.4, 0.9);

  const hubSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.35 })
  );
  rotorHub.add(hubSphere);

  const latticeMat = new THREE.MeshStandardMaterial({ color: 0xFEF3C7, roughness: 0.6 });
  const frameWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.7 });

  for (let b = 0; b < 4; b++) {
    const bladeArm = new THREE.Group();
    bladeArm.rotation.z = (b / 4) * Math.PI * 2;

    // Main structural wooden spar
    const spar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.6, 0.06), frameWoodMat);
    spar.position.y = 1.3;
    bladeArm.add(spar);

    // Canvas Sail Cloth
    const sail = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.1, 0.02), latticeMat);
    sail.position.set(0.28, 1.3, 0.02);
    bladeArm.add(sail);

    // Wooden cross-lattice slats on sails
    for (let sl = 0; sl < 5; sl++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.03), frameWoodMat);
      slat.position.set(0.28, 0.5 + sl * 0.4, 0.03);
      bladeArm.add(slat);
    }

    rotorHub.add(bladeArm);
  }
  windmillGroup.add(rotorHub);
  root.add(windmillGroup);

  // 6. Charming Hillside Alpine Cottage with Chimney & Windows (x = -11.5, y = 6.2, z = -17)
  const cottage = new THREE.Group();
  cottage.position.set(-11.5, 6.2, -17);

  // Plaster & Timber Wall Base
  const cottageBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.0, 2.5),
    new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.55 })
  );
  cottageBody.position.y = 1.0;
  cottageBody.castShadow = true;
  cottage.add(cottageBody);

  // Gable Pitched Terracotta Roof
  const roofGeom = new THREE.ConeGeometry(2.5, 1.6, 4);
  const cottageRoof = new THREE.Mesh(roofGeom, capMat);
  cottageRoof.rotation.y = Math.PI / 4;
  cottageRoof.position.y = 2.7;
  cottageRoof.castShadow = true;
  cottage.add(cottageRoof);

  // Realistic Windows with Warm Amber Interior Light
  const windowGlassMat = new THREE.MeshStandardMaterial({
    color: 0xFEF08A,
    emissive: 0xF59E0B,
    emissiveIntensity: 0.5,
    roughness: 0.1,
  });
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.7 });

  [-0.8, 0.8].forEach(wx => {
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.08), windowFrameMat);
    winFrame.position.set(wx, 1.2, 1.27);
    cottage.add(winFrame);

    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.65), windowGlassMat);
    winGlass.position.set(wx, 1.2, 1.32);
    cottage.add(winGlass);
  });

  // Cottage Front Door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.3, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.7 })
  );
  door.position.set(0, 0.65, 1.27);
  cottage.add(door);

  // Red Brick Chimney
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 1.5, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.75 })
  );
  chimney.position.set(0.95, 2.8, 0.5);
  chimney.castShadow = true;
  cottage.add(chimney);

  // Puffs of curling smoke from the chimney
  const smokeGroup = new THREE.Group();
  smokeGroup.position.set(0.95, 3.7, 0.5);
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    transparent: true,
    opacity: 0.45,
    roughness: 0.3,
  });
  for (let sm = 0; sm < 4; sm++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.18 + sm * 0.1, 8, 8), smokeMat);
    puff.position.set(
      Math.sin(sm) * 0.12,
      sm * 0.32,
      Math.cos(sm) * 0.1
    );
    smokeGroup.add(puff);
  }
  cottage.add(smokeGroup);
  root.add(cottage);

  // 7. Rich Realistic Tree Forest (Oak / Deciduous Trees & Alpine Pine Trees)
  const pineMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });
  const oakMat1 = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.65 });
  const oakMat2 = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.7 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.85 });

  const treesData: Array<{ x: number; y: number; z: number; type: 'pine' | 'oak'; scale: number }> = [
    { x: -5.0, y: 3.8, z: -14.2, type: 'oak', scale: 1.3 },
    { x: -2.2, y: 4.4, z: -15.5, type: 'pine', scale: 1.1 },
    { x: 1.2, y: 5.2, z: -16.5, type: 'oak', scale: 1.4 },
    { x: 7.8, y: 6.0, z: -17.5, type: 'pine', scale: 1.4 },
    { x: 12.5, y: 6.6, z: -18.2, type: 'oak', scale: 1.6 },
    { x: -16.5, y: 7.6, z: -19.5, type: 'pine', scale: 1.9 },
    { x: -19.0, y: 7.0, z: -17.5, type: 'oak', scale: 1.5 },
    { x: 19.5, y: 6.8, z: -19.2, type: 'pine', scale: 1.7 },
    { x: -8.5, y: 3.4, z: -12.5, type: 'oak', scale: 1.0 },
    { x: 6.5, y: 3.8, z: -13.2, type: 'oak', scale: 1.15 },
    { x: 10.0, y: 4.6, z: -14.8, type: 'pine', scale: 1.25 },
    { x: -14.0, y: 6.8, z: -18.0, type: 'oak', scale: 1.4 },
  ];

  treesData.forEach(td => {
    const tree = new THREE.Group();
    tree.position.set(td.x, td.y, td.z);
    tree.scale.set(td.scale, td.scale, td.scale);

    if (td.type === 'pine') {
      // Pine tree: Sturdy trunk + 3 stacked cones
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.4, 8), trunkMat);
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      tree.add(trunk);

      for (let c = 0; c < 3; c++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.95 - c * 0.2, 1.3, 10),
          pineMat
        );
        cone.position.y = 1.5 + c * 0.72;
        cone.castShadow = true;
        tree.add(cone);
      }
    } else {
      // Deciduous Oak tree: Natural branching trunk + clustered organic foliage spheres
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.6, 8), trunkMat);
      trunk.position.y = 0.8;
      trunk.castShadow = true;
      tree.add(trunk);

      // Organic canopy composed of multiple overlapping foliage masses
      const canopy = new THREE.Group();
      canopy.position.y = 1.9;

      const sphereOffsets = [
        { x: 0, y: 0.6, z: 0, r: 0.9, mat: oakMat1 },
        { x: -0.45, y: 0.2, z: 0.2, r: 0.7, mat: oakMat2 },
        { x: 0.45, y: 0.25, z: -0.15, r: 0.75, mat: oakMat1 },
        { x: 0.1, y: 0.1, z: 0.45, r: 0.65, mat: oakMat2 },
        { x: -0.2, y: 0.9, z: -0.2, r: 0.65, mat: oakMat1 },
      ];

      sphereOffsets.forEach(so => {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(so.r, 2), so.mat);
        puff.position.set(so.x, so.y, so.z);
        puff.castShadow = true;
        canopy.add(puff);
      });
      tree.add(canopy);
    }

    root.add(tree);
  });

  // 8. Distant Layered Mountain Ranges with Snowy Alpine Crests (z = -38 to -44)
  const distantMtnMat1 = new THREE.MeshStandardMaterial({
    color: 0x64748B,
    roughness: 0.9,
  });
  const snowMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.4,
  });

  const mountainPeaks = [
    { x: -28, y: 10, z: -42, r: 14, h: 16 },
    { x: -16, y: 12, z: -45, r: 16, h: 19 },
    { x: -4, y: 9, z: -40, r: 12, h: 14 },
    { x: 9, y: 13, z: -46, r: 17, h: 20 },
    { x: 23, y: 11, z: -43, r: 15, h: 17 },
    { x: 36, y: 8, z: -41, r: 13, h: 13 },
  ];

  mountainPeaks.forEach(mp => {
    const mtnGeom = new THREE.ConeGeometry(mp.r, mp.h, 6);
    const mtn = new THREE.Mesh(mtnGeom, distantMtnMat1);
    mtn.position.set(mp.x, mp.y - 1, mp.z);
    root.add(mtn);

    // Snow Cap on Top Third of Mountain
    const snowCapGeom = new THREE.ConeGeometry(mp.r * 0.35, mp.h * 0.35, 6);
    const snowCap = new THREE.Mesh(snowCapGeom, snowMat);
    snowCap.position.set(mp.x, mp.y - 1 + mp.h * 0.33, mp.z);
    root.add(snowCap);
  });

  // 9. Soft Fluffy Volumetric Cumulus Clouds Floating in the Sky
  const cloudGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.15,
    metalness: 0.0,
  });

  const cloudPuffs: Array<{ x: number; y: number; z: number; scale: number }> = [
    { x: -16, y: 16, z: -28, scale: 2.8 },
    { x: 2, y: 18, z: -32, scale: 3.4 },
    { x: 20, y: 15.5, z: -27, scale: 2.6 },
    { x: -6, y: 13.5, z: -23, scale: 2.1 },
    { x: 32, y: 17, z: -34, scale: 3.0 },
  ];

  const cloudMeshes: THREE.Group[] = [];
  cloudPuffs.forEach(cp => {
    const cloud = new THREE.Group();
    cloud.position.set(cp.x, cp.y, cp.z);
    cloud.scale.set(cp.scale, cp.scale * 0.55, cp.scale * 0.85);

    // Clustered spheres for natural cumulus puff shape
    const numSpheres = 7;
    for (let s = 0; s < numSpheres; s++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(1.0, 14, 12), cloudMat);
      puff.position.set(
        (s - 3) * 0.85 + (Math.random() - 0.5) * 0.25,
        Math.sin(s / numSpheres * Math.PI) * 0.5 + (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.4
      );
      cloud.add(puff);
    }
    cloudGroup.add(cloud);
    cloudMeshes.push(cloud);
  });
  root.add(cloudGroup);

  // 10. Colorful Hot Air Balloon Drifting Gracefully in the Far Horizon
  const balloonGroup = new THREE.Group();
  balloonGroup.position.set(-18, 14, -30);
  balloonGroup.scale.set(0.65, 0.65, 0.65);

  // Striped Balloon Envelope
  const envelopeGeom = new THREE.SphereGeometry(1.8, 16, 16);
  envelopeGeom.scale(1, 1.35, 1);
  const envelopeMat = new THREE.MeshStandardMaterial({
    color: 0xF43F5E,
    roughness: 0.35,
  });
  const envelope = new THREE.Mesh(envelopeGeom, envelopeMat);
  envelope.position.y = 2.4;
  balloonGroup.add(envelope);

  // Decorative Golden Stripe Ring around envelope
  const stripeRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.08, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.3 })
  );
  stripeRing.rotation.x = Math.PI / 2;
  stripeRing.position.y = 2.4;
  balloonGroup.add(stripeRing);

  // Wicker Basket
  const basket = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.5, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 })
  );
  basket.position.y = 0.25;
  balloonGroup.add(basket);

  root.add(balloonGroup);

  // Animation controller
  const controller: PanoramicHillController = {
    group: root,
    update: (delta: number, elapsedTime: number) => {
      // Smoothly rotate the windmill blades with realistic momentum
      rotorHub.rotation.z += delta * 1.15;

      // Cloud drift
      cloudMeshes.forEach((cloud, idx) => {
        cloud.position.x += delta * (0.35 + idx * 0.08);
        if (cloud.position.x > 38) {
          cloud.position.x = -38;
        }
      });

      // Hot air balloon gentle float & sway
      balloonGroup.position.x += delta * 0.15;
      balloonGroup.position.y = 14 + Math.sin(elapsedTime * 0.5) * 0.4;
      balloonGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.04;
      if (balloonGroup.position.x > 32) {
        balloonGroup.position.x = -32;
      }
    },
  };

  return controller;
}
