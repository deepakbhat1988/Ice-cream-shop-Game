import * as THREE from 'three';
import { FlavorId, ToppingId } from '../types/game';

export type HatType = 'pink_bow' | 'straw_hat' | 'flower_crown' | 'chef_hat' | 'party_hat' | 'none';

// Helper to create polka-dot canvas texture
export function createPolkaDotTexture(bgColor: string, dotColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = dotColor;
  const spacing = 48;
  for (let y = 0; y < 256; y += spacing) {
    for (let x = 0; x < 256; x += spacing) {
      const offsetX = (y / spacing) % 2 === 0 ? 0 : spacing / 2;
      ctx.beginPath();
      ctx.arc((x + offsetX) % 256, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Helper for candy cane stripes
export function createCandyCaneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 128, 256);

  ctx.fillStyle = '#FF3B69';
  ctx.lineWidth = 28;
  for (let i = -256; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i + 128);
    ctx.strokeStyle = '#FF2E63';
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3);
  return texture;
}

// Helper for waffle cone texture
export function createWaffleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 4;
  for (let i = -128; i < 256; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 128, 128);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 128, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// Strawberry Customer 3D Model
export function createStrawberryCustomer(berryColor: string, hatType: HatType): THREE.Group {
  const group = new THREE.Group();

  // Strawberry Body (Tapered sphere)
  const berryGeom = new THREE.SphereGeometry(0.85, 32, 28);
  const posAttr = berryGeom.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    // Taper bottom and slightly flatten top
    if (y < 0) {
      const taper = 1.0 + y * 0.45;
      posAttr.setX(i, posAttr.getX(i) * taper);
      posAttr.setZ(i, posAttr.getZ(i) * taper);
    }
  }
  berryGeom.computeVertexNormals();

  const berryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(berryColor),
    roughness: 0.25,
    metalness: 0.05,
  });
  const berryMesh = new THREE.Mesh(berryGeom, berryMat);
  berryMesh.castShadow = true;
  berryMesh.position.y = 0.95;
  group.add(berryMesh);

  // Golden Strawberry Seeds
  const seedGeom = new THREE.ConeGeometry(0.024, 0.06, 6);
  const seedMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.3 });
  for (let s = 0; s < 28; s++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() * 0.65 + 0.15) * Math.PI; // Avoid extreme top/bottom
    const r = 0.84;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    const seed = new THREE.Mesh(seedGeom, seedMat);
    seed.position.set(x, y + 0.95, z);
    seed.lookAt(x * 2, (y + 0.95), z * 2);
    group.add(seed);
  }

  // Anime Eyes with shiny highlights (kawaii reflection)
  const eyeGroup = new THREE.Group();
  const eyeGeom = new THREE.SphereGeometry(0.14, 24, 24);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1E1B4B });

  // Big Shiny Specular Highlights
  const shineGeom = new THREE.SphereGeometry(0.045, 12, 12);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  const miniShineGeom = new THREE.SphereGeometry(0.022, 10, 10);

  // Left Eye
  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.scale.set(1, 1.25, 0.4);
  leftEye.position.set(-0.28, 1.05, 0.72);
  eyeGroup.add(leftEye);

  const leftShine = new THREE.Mesh(shineGeom, shineMat);
  leftShine.position.set(-0.25, 1.12, 0.77);
  eyeGroup.add(leftShine);

  const leftMiniShine = new THREE.Mesh(miniShineGeom, shineMat);
  leftMiniShine.position.set(-0.31, 0.99, 0.76);
  eyeGroup.add(leftMiniShine);

  // Right Eye
  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.scale.set(1, 1.25, 0.4);
  rightEye.position.set(0.28, 1.05, 0.72);
  eyeGroup.add(rightEye);

  const rightShine = new THREE.Mesh(shineGeom, shineMat);
  rightShine.position.set(0.31, 1.12, 0.77);
  eyeGroup.add(rightShine);

  const rightMiniShine = new THREE.Mesh(miniShineGeom, shineMat);
  rightMiniShine.position.set(0.25, 0.99, 0.76);
  eyeGroup.add(rightMiniShine);

  // Blush Cheeks (Cute soft glowing pink ovals)
  const blushGeom = new THREE.SphereGeometry(0.11, 16, 16);
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xFB7185 });
  const leftBlush = new THREE.Mesh(blushGeom, blushMat);
  leftBlush.scale.set(1.4, 0.8, 0.2);
  leftBlush.position.set(-0.42, 0.92, 0.67);
  leftBlush.rotation.z = -0.15;
  eyeGroup.add(leftBlush);

  const rightBlush = new THREE.Mesh(blushGeom, blushMat);
  rightBlush.scale.set(1.4, 0.8, 0.2);
  rightBlush.position.set(0.42, 0.92, 0.67);
  rightBlush.rotation.z = 0.15;
  eyeGroup.add(rightBlush);

  // Happy Smile (Torus curve)
  const smileGeom = new THREE.TorusGeometry(0.1, 0.024, 8, 18, Math.PI);
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x4C0519 });
  const smile = new THREE.Mesh(smileGeom, smileMat);
  smile.rotation.x = Math.PI * 0.9;
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.88, 0.75);
  eyeGroup.add(smile);

  group.add(eyeGroup);

  // Strawberry Green Calyx Leaf Crown on Head
  const leafGroup = new THREE.Group();
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.35 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leafGeom = new THREE.ConeGeometry(0.18, 0.55, 5);
    leafGeom.rotateX(Math.PI / 2.3);
    const leaf = new THREE.Mesh(leafGeom, leafMat);
    leaf.position.set(Math.cos(angle) * 0.16, 1.76, Math.sin(angle) * 0.16);
    leaf.rotation.y = -angle;
    leafGroup.add(leaf);
  }
  // Berry Top Stem
  const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.25, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.4 });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  stem.position.set(0, 1.88, 0);
  stem.rotation.z = 0.15;
  leafGroup.add(stem);
  group.add(leafGroup);

  // Hats
  if (hatType === 'pink_bow') {
    const bowGroup = new THREE.Group();
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.3 });
    const knotGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const knot = new THREE.Mesh(knotGeom, bowMat);

    const wingGeom = new THREE.ConeGeometry(0.16, 0.35, 12);
    const leftWing = new THREE.Mesh(wingGeom, bowMat);
    leftWing.rotation.z = Math.PI / 2;
    leftWing.position.x = -0.2;

    const rightWing = new THREE.Mesh(wingGeom, bowMat);
    rightWing.rotation.z = -Math.PI / 2;
    rightWing.position.x = 0.2;

    bowGroup.add(knot, leftWing, rightWing);
    bowGroup.position.set(0.35, 1.82, 0.25);
    bowGroup.rotation.y = -0.3;
    bowGroup.rotation.z = -0.2;
    group.add(bowGroup);
  } else if (hatType === 'straw_hat') {
    const hatGroup = new THREE.Group();
    const brimGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.04, 24);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xFDE68A, roughness: 0.6 });
    const brim = new THREE.Mesh(brimGeom, strawMat);

    const crownGeom = new THREE.CylinderGeometry(0.42, 0.45, 0.32, 24);
    const crown = new THREE.Mesh(crownGeom, strawMat);
    crown.position.y = 0.16;

    const ribbonGeom = new THREE.CylinderGeometry(0.46, 0.46, 0.08, 24);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xEF4444 });
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
    ribbon.position.y = 0.08;

    hatGroup.add(brim, crown, ribbon);
    hatGroup.position.set(0, 1.86, 0);
    hatGroup.rotation.z = 0.12;
    group.add(hatGroup);
  } else if (hatType === 'flower_crown') {
    const crownGroup = new THREE.Group();
    for (let f = 0; f < 8; f++) {
      const angle = (f / 8) * Math.PI * 2;
      const flower = new THREE.Group();
      // Center
      const centerGeom = new THREE.SphereGeometry(0.04, 8, 8);
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xFACC15 });
      flower.add(new THREE.Mesh(centerGeom, centerMat));
      // Petals
      const petalMat = new THREE.MeshStandardMaterial({
        color: f % 2 === 0 ? 0xFFFFFF : 0xF472B6,
      });
      for (let p = 0; p < 5; p++) {
        const pAngle = (p / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), petalMat);
        petal.position.set(Math.cos(pAngle) * 0.06, 0, Math.sin(pAngle) * 0.06);
        flower.add(petal);
      }
      flower.position.set(Math.cos(angle) * 0.58, 1.76, Math.sin(angle) * 0.58);
      crownGroup.add(flower);
    }
    group.add(crownGroup);
  } else if (hatType === 'chef_hat') {
    const chefGroup = new THREE.Group();
    const bandGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.18, 24);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
    const band = new THREE.Mesh(bandGeom, whiteMat);

    const puffGeom = new THREE.SphereGeometry(0.58, 24, 24);
    puffGeom.scale(1, 0.8, 1);
    const puff = new THREE.Mesh(puffGeom, whiteMat);
    puff.position.y = 0.35;

    chefGroup.add(band, puff);
    chefGroup.position.set(0, 1.9, 0);
    chefGroup.rotation.z = -0.1;
    group.add(chefGroup);
  } else if (hatType === 'party_hat') {
    const partyHat = new THREE.Group();
    const coneGeom = new THREE.ConeGeometry(0.3, 0.7, 16);
    const partyMat = new THREE.MeshStandardMaterial({ color: 0xA855F7, roughness: 0.3 });
    const cone = new THREE.Mesh(coneGeom, partyMat);

    const pomGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const pomMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.8 });
    const pom = new THREE.Mesh(pomGeom, pomMat);
    pom.position.y = 0.38;

    partyHat.add(cone, pom);
    partyHat.position.set(0, 2.1, 0);
    partyHat.rotation.z = 0.15;
    group.add(partyHat);
  }

  // Little Feet (cute rounded shoes)
  const shoeGeom = new THREE.SphereGeometry(0.18, 16, 16);
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.4 });
  const leftFoot = new THREE.Mesh(shoeGeom, shoeMat);
  leftFoot.scale.set(0.9, 0.6, 1.3);
  leftFoot.position.set(-0.35, 0.1, 0.15);
  group.add(leftFoot);

  const rightFoot = new THREE.Mesh(shoeGeom, shoeMat);
  rightFoot.scale.set(0.9, 0.6, 1.3);
  rightFoot.position.set(0.35, 0.1, 0.15);
  group.add(rightFoot);

  return group;
}

// Single Ice Cream Scoop with realistic ruffled skirt
export function createIceCreamScoop(color: string): THREE.Group {
  const group = new THREE.Group();

  // Main Scoop dome
  const domeGeom = new THREE.SphereGeometry(0.48, 24, 20);
  // Add organic surface variation
  const pos = domeGeom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const bump = Math.sin(x * 12) * Math.cos(z * 12) * 0.025;
    pos.setXYZ(i, x + bump, y + bump * 0.5, z + bump);
  }
  domeGeom.computeVertexNormals();

  const scoopMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.55,
    metalness: 0.02,
  });
  const dome = new THREE.Mesh(domeGeom, scoopMat);
  dome.castShadow = true;
  group.add(dome);

  // Ruffled Skirt around the base
  const skirtGroup = new THREE.Group();
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const flakeGeom = new THREE.SphereGeometry(0.12, 10, 10);
    flakeGeom.scale(1.4, 0.6, 1.1);
    const flake = new THREE.Mesh(flakeGeom, scoopMat);
    flake.position.set(Math.cos(angle) * 0.44, -0.22, Math.sin(angle) * 0.44);
    flake.rotation.y = angle;
    skirtGroup.add(flake);
  }
  group.add(skirtGroup);

  return group;
}

// 3D Cherry with curved stem
export function createCherryMesh(): THREE.Group {
  const group = new THREE.Group();
  const cherryGeom = new THREE.SphereGeometry(0.18, 20, 20);
  const cherryMat = new THREE.MeshStandardMaterial({
    color: 0xDC2626,
    roughness: 0.15,
    metalness: 0.1,
  });
  const berry = new THREE.Mesh(cherryGeom, cherryMat);
  berry.scale.set(1.05, 0.95, 1);
  group.add(berry);

  // Curved Stem
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0.14, 0),
    new THREE.Vector3(0.08, 0.35, 0.04),
    new THREE.Vector3(0.14, 0.5, -0.05),
    new THREE.Vector3(0.06, 0.62, -0.08)
  );
  const stemGeom = new THREE.TubeGeometry(curve, 16, 0.018, 8, false);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4ADE80, roughness: 0.4 });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  group.add(stem);

  return group;
}

// Whipped Cream Swirl
export function createWhippedCreamMesh(): THREE.Group {
  const group = new THREE.Group();
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.35,
    metalness: 0.05,
  });

  const levels = [
    { r: 0.45, h: 0.18, y: 0.0 },
    { r: 0.36, h: 0.18, y: 0.14 },
    { r: 0.25, h: 0.16, y: 0.28 },
    { r: 0.14, h: 0.15, y: 0.4 },
    { r: 0.04, h: 0.12, y: 0.52 },
  ];

  levels.forEach(lvl => {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(lvl.r, lvl.h * 0.7, 10, 20), creamMat);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = lvl.y;
    group.add(torus);
  });

  // Star tip
  const tipGeom = new THREE.ConeGeometry(0.06, 0.2, 8);
  const tip = new THREE.Mesh(tipGeom, creamMat);
  tip.position.y = 0.65;
  group.add(tip);

  return group;
}

// Banana Milkshake Machine 3D Object
export function createBananaMilkshakeMachine(): THREE.Group {
  const machine = new THREE.Group();

  // Banana Base and Body
  const baseGeom = new THREE.CylinderGeometry(0.7, 0.85, 0.3, 24);
  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xFDE047, // Bright vibrant banana yellow
    roughness: 0.25,
    metalness: 0.1,
  });
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    roughness: 0.2,
    metalness: 0.85,
  });

  const base = new THREE.Mesh(baseGeom, yellowMat);
  machine.add(base);

  // Curved banana upright column
  const columnGeom = new THREE.CylinderGeometry(0.35, 0.45, 1.8, 20);
  const column = new THREE.Mesh(columnGeom, yellowMat);
  column.position.set(-0.25, 1.05, 0);
  column.rotation.z = -0.15;
  machine.add(column);

  // Banana top snout with green tip
  const headGeom = new THREE.SphereGeometry(0.48, 20, 20);
  headGeom.scale(1.3, 0.8, 1);
  const head = new THREE.Mesh(headGeom, yellowMat);
  head.position.set(0.05, 2.05, 0);
  machine.add(head);

  const bananaTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.25, 12),
    new THREE.MeshStandardMaterial({ color: 0x84CC16 })
  );
  bananaTip.rotation.z = Math.PI / 2.5;
  bananaTip.position.set(-0.45, 2.12, 0);
  machine.add(bananaTip);

  // Metallic Motor Spout & Mixing Blade
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 16), silverMat);
  spout.position.set(0.18, 1.6, 0);
  machine.add(spout);

  const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 12), silverMat);
  blade.position.set(0.18, 1.22, 0);
  machine.add(blade);

  // Clear Blender Glass Pitcher
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
  });
  const pitcherGeom = new THREE.CylinderGeometry(0.32, 0.24, 0.95, 20, 1, true);
  const pitcher = new THREE.Mesh(pitcherGeom, glassMat);
  pitcher.position.set(0.18, 0.72, 0);
  machine.add(pitcher);

  // Blender Base ring
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.12, 20), silverMat);
  ring.position.set(0.18, 0.26, 0);
  machine.add(ring);

  // Kawaii Cute Face on the banana machine
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1E1B4B });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), eyeMat);
  eyeL.position.set(0.12, 1.95, 0.45);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), eyeMat);
  eyeR.position.set(0.32, 1.95, 0.42);
  machine.add(eyeL, eyeR);

  const blushMat = new THREE.MeshBasicMaterial({ color: 0xFB7185 });
  const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), blushMat);
  blushL.position.set(0.08, 1.88, 0.45);
  const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), blushMat);
  blushR.position.set(0.36, 1.88, 0.42);
  machine.add(blushL, blushR);

  return machine;
}
