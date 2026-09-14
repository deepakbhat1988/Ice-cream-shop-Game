import * as THREE from 'three';
import {
  CustomerAppearance,
  HairStyle,
  Accessory,
  BodyType,
  ClothingStyle,
  HeightType,
  FacialHair,
} from '../types/game';

export interface RealisticHumanController {
  group: THREE.Group;
  headGroup: THREE.Group;
  chestGroup: THREE.Group;
  leftEyeLid: THREE.Mesh;
  rightEyeLid: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  blinkTimer: number;
  nextBlinkTime: number;
  isBlinking: boolean;
  happyTimer: number;
  update: (delta: number, elapsedTime: number) => void;
  triggerHappy: () => void;
}

// ------------------------------------------------------------------
// 1. Procedural High-Res Realistic Human Skin & Face Canvas Texture
// ------------------------------------------------------------------
function createRealisticFaceTexture(
  skinToneHex: string,
  hairColorHex: string,
  gender: 'female' | 'male',
  facialHair: FacialHair = 'none',
  cheekFullness = 1.0
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base skin tone
  ctx.fillStyle = skinToneHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subsurface scattering & warm undertones (cheeks, nose, ears, chin)
  const isFair = skinToneHex.toUpperCase().includes('FE') || skinToneHex.toUpperCase().includes('FF');

  // Soft Rosy Cheeks (Blush) scaled by cheek fullness
  const blushRadius = 80 * Math.max(0.85, cheekFullness);
  const blushGradL = ctx.createRadialGradient(160, 290, 10, 160, 290, blushRadius);
  blushGradL.addColorStop(0, isFair ? 'rgba(244, 63, 94, 0.24)' : 'rgba(225, 29, 72, 0.18)');
  blushGradL.addColorStop(0.6, isFair ? 'rgba(251, 113, 133, 0.12)' : 'rgba(190, 18, 60, 0.09)');
  blushGradL.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = blushGradL;
  ctx.fillRect(60, 200, 200, 200);

  const blushGradR = ctx.createRadialGradient(352, 290, 10, 352, 290, blushRadius);
  blushGradR.addColorStop(0, isFair ? 'rgba(244, 63, 94, 0.24)' : 'rgba(225, 29, 72, 0.18)');
  blushGradR.addColorStop(0.6, isFair ? 'rgba(251, 113, 133, 0.12)' : 'rgba(190, 18, 60, 0.09)');
  blushGradR.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = blushGradR;
  ctx.fillRect(252, 200, 200, 200);

  // Subtle warm bridge and tip of nose highlight & warmth
  const noseGrad = ctx.createRadialGradient(256, 295, 4, 256, 295, 38);
  noseGrad.addColorStop(0, 'rgba(244, 63, 94, 0.16)');
  noseGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = noseGrad;
  ctx.fillRect(215, 255, 82, 75);

  // Natural Lip Color Gradient (Cupid's bow and vermilion contour)
  const lipGrad = ctx.createLinearGradient(200, 375, 312, 415);
  lipGrad.addColorStop(0, isFair ? 'rgba(225, 29, 72, 0.38)' : 'rgba(159, 18, 57, 0.35)');
  lipGrad.addColorStop(0.5, isFair ? 'rgba(244, 63, 94, 0.44)' : 'rgba(190, 24, 93, 0.40)');
  lipGrad.addColorStop(1, isFair ? 'rgba(225, 29, 72, 0.38)' : 'rgba(159, 18, 57, 0.35)');

  // Upper lip contour
  ctx.fillStyle = lipGrad;
  ctx.beginPath();
  ctx.moveTo(215, 390);
  ctx.quadraticCurveTo(240, 383, 250, 385);
  ctx.quadraticCurveTo(256, 389, 262, 385);
  ctx.quadraticCurveTo(272, 383, 297, 390);
  ctx.quadraticCurveTo(256, 394, 215, 390);
  ctx.fill();

  // Lower lip fuller cushion
  ctx.beginPath();
  ctx.moveTo(218, 391);
  ctx.quadraticCurveTo(256, 415, 294, 391);
  ctx.quadraticCurveTo(256, 393, 218, 391);
  ctx.fill();

  // Center lip gloss moisture highlight
  const glossGrad = ctx.createRadialGradient(256, 400, 2, 256, 400, 16);
  glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.30)');
  glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glossGrad;
  ctx.fillRect(236, 392, 40, 16);

  // Soft Eyebrows (Realistic hair stroke arches)
  ctx.strokeStyle = hairColorHex;
  ctx.fillStyle = hairColorHex;
  ctx.lineWidth = gender === 'male' ? 4.8 : 3.4;
  ctx.lineCap = 'round';

  // Left eyebrow arch
  ctx.beginPath();
  ctx.moveTo(130, 182);
  ctx.quadraticCurveTo(170, 168, 205, 178);
  ctx.stroke();

  // Right eyebrow arch
  ctx.beginPath();
  ctx.moveTo(382, 182);
  ctx.quadraticCurveTo(342, 168, 307, 178);
  ctx.stroke();

  // Soft orbital crease shadow above eyes
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.arc(168, 215, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(344, 215, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // ==========================================
  // FACIAL HAIR RENDERING (Clean, Stubble, Short Beard, Mustache)
  // ==========================================
  if (facialHair === 'stubble') {
    // 5 o'clock shadow / designer stubble
    ctx.fillStyle = hairColorHex;
    ctx.globalAlpha = 0.22;
    // Jaw shadow
    ctx.beginPath();
    ctx.moveTo(140, 360);
    ctx.quadraticCurveTo(256, 465, 372, 360);
    ctx.quadraticCurveTo(256, 435, 140, 360);
    ctx.fill();

    // Upper lip shadow
    ctx.beginPath();
    ctx.ellipse(256, 365, 42, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fine stipple dots
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 280; i++) {
      const rx = 256 + (Math.random() - 0.5) * 220;
      const ry = 360 + Math.random() * 85;
      if (Math.hypot(rx - 256, ry - 370) < 115) {
        ctx.fillRect(rx, ry, 1.8, 1.8);
      }
    }
    ctx.globalAlpha = 1.0;
  } else if (facialHair === 'short_beard') {
    // Sculpted neat chinstrap / boxed beard and mustache
    ctx.fillStyle = hairColorHex;
    ctx.globalAlpha = 0.88;

    // Beard along jaw and chin
    ctx.beginPath();
    ctx.moveTo(135, 345);
    ctx.quadraticCurveTo(150, 425, 210, 455);
    ctx.quadraticCurveTo(256, 468, 302, 455);
    ctx.quadraticCurveTo(362, 425, 377, 345);
    ctx.quadraticCurveTo(355, 395, 290, 425);
    ctx.quadraticCurveTo(256, 430, 222, 425);
    ctx.quadraticCurveTo(157, 395, 135, 345);
    ctx.fill();

    // Soul patch under lower lip
    ctx.beginPath();
    ctx.moveTo(246, 415);
    ctx.lineTo(266, 415);
    ctx.lineTo(256, 432);
    ctx.closePath();
    ctx.fill();

    // Connected neat mustache
    ctx.beginPath();
    ctx.moveTo(215, 375);
    ctx.quadraticCurveTo(240, 364, 256, 370);
    ctx.quadraticCurveTo(272, 364, 297, 375);
    ctx.quadraticCurveTo(256, 384, 215, 375);
    ctx.fill();

    ctx.globalAlpha = 1.0;
  } else if (facialHair === 'mustache') {
    // Handsome styled mustache
    ctx.fillStyle = hairColorHex;
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.moveTo(205, 377);
    ctx.quadraticCurveTo(235, 358, 256, 368);
    ctx.quadraticCurveTo(277, 358, 307, 377);
    ctx.quadraticCurveTo(285, 386, 256, 380);
    ctx.quadraticCurveTo(227, 386, 205, 377);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // Fine micro-pore noise to eliminate flat CGI plastic feel
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const grain = (Math.random() - 0.5) * 5.5;
    d[i] = Math.min(255, Math.max(0, d[i] + grain));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + grain));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ------------------------------------------------------------------
// 2. High-Detail Iris Texture with Specular Catchlights & Limbal Ring
// ------------------------------------------------------------------
function createRealisticIrisTexture(eyeColorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const cx = 128;
  const cy = 128;

  // Dark limbal ring
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 128);
  grad.addColorStop(0, '#0B0F19');
  grad.addColorStop(0.35, eyeColorHex);
  grad.addColorStop(0.85, eyeColorHex);
  grad.addColorStop(0.96, '#0B0F19');
  grad.addColorStop(1, '#05070B');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.fill();

  // Radial stroma fibers and crypts
  ctx.lineWidth = 2.0;
  for (let a = 0; a < Math.PI * 2; a += 0.08) {
    ctx.strokeStyle = (Math.sin(a * 14) > 0)
      ? 'rgba(255, 255, 255, 0.35)'
      : 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42);
    ctx.lineTo(cx + Math.cos(a) * 118, cy + Math.sin(a) * 118);
    ctx.stroke();
  }

  // Inner pupillary collarette ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.stroke();

  // Deep black pupil
  ctx.fillStyle = '#020408';
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();

  // Primary Crisp Studio Catchlight (top-right specular reflection)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + 28, cy - 28, 14, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Soft Ambient Bounce Catchlight (bottom-left)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.arc(cx - 24, cy + 26, 7, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ------------------------------------------------------------------
// 3. Hair Texture with Anisotropic Specular Highlight Band
// ------------------------------------------------------------------
function createRealisticHairTexture(baseColorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 256, 256);

  // Soft anisotropic highlight band ("angel ring" shine)
  const shineGrad = ctx.createLinearGradient(0, 70, 0, 160);
  shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  shineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shineGrad;
  ctx.fillRect(0, 70, 256, 90);

  // Hair strand striations
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 256; x += 3) {
    if (Math.random() > 0.4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// ------------------------------------------------------------------
// 4. Fabric Texture with Style Customization (Stripes, Knits, Denim)
// ------------------------------------------------------------------
function createFabricTexture(
  colorHex: string,
  style: ClothingStyle = 'crewneck_tshirt',
  secondaryColorHex = '#FFFFFF'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 128, 128);

  if (style === 'striped_tee') {
    // Breton nautical horizontal stripes
    ctx.fillStyle = secondaryColorHex;
    const stripeHeight = 16;
    for (let y = 0; y < 128; y += stripeHeight * 2) {
      ctx.fillRect(0, y, 128, stripeHeight);
    }
  } else if (style === 'sweater_vest') {
    // Ribbed knit / diamond stitch texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 0; x < 128; x += 8) {
      ctx.fillRect(x, 0, 4, 128);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let y = 0; y < 128; y += 8) {
      ctx.fillRect(0, y, 128, 2);
    }
  } else if (style === 'denim_jacket') {
    // Diagonal twill weave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let d = -128; d < 256; d += 6) {
      ctx.beginPath();
      ctx.moveTo(d, 0);
      ctx.lineTo(d + 128, 128);
      ctx.stroke();
    }
  } else {
    // Subtle organic cotton weave
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    for (let x = 0; x < 128; x += 3) {
      ctx.fillRect(x, 0, 1.5, 128);
    }
    for (let y = 0; y < 128; y += 3) {
      ctx.fillRect(0, y, 128, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// ------------------------------------------------------------------
// 5. Rich, Diverse Cartoon-Realistic Hair Styles
// ------------------------------------------------------------------
function createRealisticHair(
  style: HairStyle,
  hairMat: THREE.Material,
  headGroup: THREE.Group
): void {
  const hairGroup = new THREE.Group();

  // Base anatomical scalp cap
  const capGeom = new THREE.SphereGeometry(0.23, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65);
  capGeom.scale(1.02, 1.05, 1.08);
  const hairCap = new THREE.Mesh(capGeom, hairMat);
  hairCap.position.set(0, 0.035, -0.02);
  hairCap.castShadow = true;
  hairGroup.add(hairCap);

  if (style === 'afro') {
    // Volumetric, round, beautifully textured Afro puff
    const mainAfroGeom = new THREE.SphereGeometry(0.31, 28, 24);
    mainAfroGeom.scale(1.12, 1.15, 1.1);
    const afroMesh = new THREE.Mesh(mainAfroGeom, hairMat);
    afroMesh.position.set(0, 0.09, -0.04);
    afroMesh.castShadow = true;
    hairGroup.add(afroMesh);

    // Textured surface curl bumps for cartoon-realistic tactile depth
    for (let i = 0; i < 36; i++) {
      const phi = Math.acos(-1 + (2 * i) / 36);
      const theta = Math.sqrt(36 * Math.PI) * phi;
      const x = 0.32 * Math.sin(phi) * Math.cos(theta);
      const y = 0.09 + 0.33 * Math.cos(phi);
      const z = -0.04 + 0.32 * Math.sin(phi) * Math.sin(theta);

      if (y > 0.0 && z < 0.25) {
        const bump = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), hairMat);
        bump.position.set(x, y, z);
        bump.castShadow = true;
        hairGroup.add(bump);
      }
    }
  } else if (style === 'braids') {
    // Neat box braids / cornrows sweeping down over shoulders with gold cuffs
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFBBF24,
      metalness: 0.85,
      roughness: 0.25,
    });

    const braidAngles = [
      -0.45, -0.32, -0.18, -0.06, 0.06, 0.18, 0.32, 0.45,
      -0.55, 0.55, -0.65, 0.65,
    ];

    braidAngles.forEach((ang, idx) => {
      const side = ang < 0 ? -1 : 1;
      const xStart = Math.sin(ang) * 0.22;
      const zStart = Math.cos(ang) * 0.12 - 0.08;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xStart, 0.18, zStart),
        new THREE.Vector3(xStart * 1.15, 0.02, zStart - 0.04),
        new THREE.Vector3(xStart * 1.25, -0.16, zStart + (idx % 2 === 0 ? 0.08 : -0.08)),
        new THREE.Vector3(xStart * 1.15 + side * 0.02, -0.38, zStart + (idx % 2 === 0 ? 0.12 : -0.04)),
        new THREE.Vector3(xStart * 1.05 + side * 0.03, -0.52, zStart + (idx % 2 === 0 ? 0.14 : 0.0)),
      ]);

      const braidTube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 16, 0.016, 8, false),
        hairMat
      );
      braidTube.castShadow = true;
      hairGroup.add(braidTube);

      // Gold bead / metal cuff near bottom of braid
      const cuffPos = curve.getPoint(0.88);
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.022, 10), goldMat);
      cuff.position.copy(cuffPos);
      hairGroup.add(cuff);
    });
  } else if (style === 'buzz_cut') {
    // Ultra-clean high & tight taper fade
    const scalpFadeGeom = new THREE.SphereGeometry(0.236, 32, 24);
    scalpFadeGeom.scale(0.96, 1.15, 1.06);
    const buzzMesh = new THREE.Mesh(scalpFadeGeom, hairMat);
    buzzMesh.position.set(0, 0.02, -0.01);
    buzzMesh.castShadow = true;
    hairGroup.add(buzzMesh);

    // Sharp temple lineup
    [-1, 1].forEach(side => {
      const templeGeom = new THREE.BoxGeometry(0.03, 0.06, 0.012);
      const temple = new THREE.Mesh(templeGeom, hairMat);
      temple.position.set(side * 0.16, 0.11, 0.16);
      temple.rotation.y = side * 0.25;
      hairGroup.add(temple);
    });
  } else if (style === 'wavy_long') {
    // Long cascading beach waves parting over the shoulders
    [-1, 1].forEach(side => {
      for (let w = 0; w < 4; w++) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * (0.08 + w * 0.035), 0.22, 0.12 - w * 0.04),
          new THREE.Vector3(side * (0.22 + w * 0.03), 0.08, 0.14 - w * 0.03),
          new THREE.Vector3(side * (0.27 + w * 0.02), -0.10, 0.15 - w * 0.01),
          new THREE.Vector3(side * (0.24 + w * 0.01), -0.32, 0.12),
          new THREE.Vector3(side * (0.20 + w * 0.01), -0.52, 0.09),
        ]);
        const waveGeom = new THREE.TubeGeometry(curve, 18, 0.032 - w * 0.004, 8, false);
        const wave = new THREE.Mesh(waveGeom, hairMat);
        wave.castShadow = true;
        hairGroup.add(wave);
      }
    });

    // Flowing back volume
    for (let b = -3; b <= 3; b++) {
      const backCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(b * 0.045, 0.20, -0.16),
        new THREE.Vector3(b * 0.055, 0.04, -0.24),
        new THREE.Vector3(b * 0.06, -0.20, -0.25),
        new THREE.Vector3(b * 0.05, -0.48, -0.22),
      ]);
      const backLock = new THREE.Mesh(new THREE.TubeGeometry(backCurve, 16, 0.036, 8, false), hairMat);
      backLock.castShadow = true;
      hairGroup.add(backLock);
    }
  } else if (style === 'pixie_cut') {
    // Chic layered textured pixie cut with side-swept fringe
    for (let f = -4; f <= 3; f++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(f * 0.035 - 0.02, 0.22, 0.16),
        new THREE.Vector3(f * 0.045 + 0.04, 0.15, 0.20),
        new THREE.Vector3(f * 0.05 + 0.08, 0.08, 0.18),
      ]);
      const fringe = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.022, 8, false), hairMat);
      fringe.castShadow = true;
      hairGroup.add(fringe);
    }

    // Spiky textured crown tufts
    for (let t = 0; t < 12; t++) {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.09, 8), hairMat);
      tuft.position.set(
        (Math.random() - 0.5) * 0.20,
        0.24 + Math.random() * 0.04,
        (Math.random() - 0.5) * 0.18 - 0.02
      );
      tuft.rotation.set((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6);
      hairGroup.add(tuft);
    }

    // Tapered nape and ear wisps
    [-1, 1].forEach(side => {
      const sideLock = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.005, 0.09, 8),
        hairMat
      );
      sideLock.position.set(side * 0.19, 0.02, 0.05);
      sideLock.rotation.z = side * 0.3;
      hairGroup.add(sideLock);
    });
  } else if (style === 'topknot_bun') {
    // Combed back sides with high topknot bun
    const tieMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 });
    const tieRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.015, 10, 20), tieMat);
    tieRing.position.set(0, 0.26, -0.06);
    tieRing.rotation.x = Math.PI / 2;
    hairGroup.add(tieRing);

    // High sculpted topknot bun
    const bunGeom = new THREE.SphereGeometry(0.085, 18, 16);
    bunGeom.scale(1.1, 0.85, 1.0);
    const bun = new THREE.Mesh(bunGeom, hairMat);
    bun.position.set(0, 0.32, -0.06);
    bun.castShadow = true;
    hairGroup.add(bun);

    // Combed hair strands pulled into knot
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      const strandCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(ang) * 0.18, 0.16, Math.sin(ang) * 0.16 - 0.04),
        new THREE.Vector3(Math.cos(ang) * 0.10, 0.22, Math.sin(ang) * 0.08 - 0.06),
        new THREE.Vector3(0, 0.26, -0.06),
      ]);
      hairGroup.add(new THREE.Mesh(new THREE.TubeGeometry(strandCurve, 8, 0.015, 6, false), hairMat));
    }
  } else if (style === 'curly_fade') {
    // High-fade sides with high-top voluminous curls
    for (let c = 0; c < 38; c++) {
      const phi = Math.random() * Math.PI * 0.45;
      const theta = Math.random() * Math.PI * 2;
      const x = 0.20 * Math.sin(phi) * Math.cos(theta);
      const y = 0.16 + 0.15 * Math.cos(phi);
      const z = 0.18 * Math.sin(phi) * Math.sin(theta) - 0.02;

      const curl = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.015, 8, 12), hairMat);
      curl.position.set(x, y, z);
      curl.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      curl.castShadow = true;
      hairGroup.add(curl);
    }
  } else if (style === 'bob_bangs') {
    // Chic layered bob with face-framing fringe
    for (let b = -5; b <= 5; b++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(b * 0.032, 0.20, 0.18),
        new THREE.Vector3(b * 0.034, 0.14, 0.21),
        new THREE.Vector3(b * 0.036, 0.08, 0.215 - Math.abs(b) * 0.01),
      ]);
      const strand = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.016, 8, false), hairMat);
      strand.castShadow = true;
      hairGroup.add(strand);
    }

    // Side locks
    [-1, 1].forEach(side => {
      for (let s = 0; s < 5; s++) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * (0.18 + s * 0.015), 0.16, 0.08 - s * 0.03),
          new THREE.Vector3(side * (0.23 + s * 0.012), 0.02, 0.07 - s * 0.02),
          new THREE.Vector3(side * (0.21 + s * 0.01), -0.16, 0.05),
          new THREE.Vector3(side * (0.18 + s * 0.008), -0.26, 0.03),
        ]);
        const lock = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.032 - s * 0.003, 8, false), hairMat);
        lock.castShadow = true;
        hairGroup.add(lock);
      }
    });

    // Back volume
    for (let layer = 0; layer < 4; layer++) {
      const backGeom = new THREE.CylinderGeometry(
        0.22 + layer * 0.015,
        0.24 + layer * 0.02,
        0.32,
        18,
        1,
        true,
        -Math.PI * 0.75,
        Math.PI * 1.5
      );
      const backLock = new THREE.Mesh(backGeom, hairMat);
      backLock.position.set(0, -0.06 - layer * 0.04, -0.04);
      backLock.castShadow = true;
      hairGroup.add(backLock);
    }
  } else if (style === 'ponytail') {
    // High flowing ponytail with scrunchie
    const scrunchie = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.022, 12, 20),
      new THREE.MeshStandardMaterial({ color: 0x3B82F6, roughness: 0.35 })
    );
    scrunchie.position.set(0, 0.19, -0.22);
    scrunchie.rotation.x = 0.55;
    hairGroup.add(scrunchie);

    for (let p = -2; p <= 2; p++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(p * 0.015, 0.19, -0.22),
        new THREE.Vector3(p * 0.025, 0.13, -0.32),
        new THREE.Vector3(p * 0.035, -0.06, -0.39),
        new THREE.Vector3(p * 0.025, -0.28, -0.36),
        new THREE.Vector3(p * 0.015, -0.44, -0.32),
      ]);
      const ponytail = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.04 - Math.abs(p) * 0.005, 8, false), hairMat);
      ponytail.castShadow = true;
      hairGroup.add(ponytail);
    }
  } else if (style === 'curly_short') {
    // Natural short bouncy curls
    for (let c = 0; c < 48; c++) {
      const phi = Math.acos(-1 + (2 * c) / 48);
      const theta = Math.sqrt(48 * Math.PI) * phi;
      const x = 0.23 * Math.sin(phi) * Math.cos(theta);
      const y = 0.08 + 0.18 * Math.cos(phi);
      const z = 0.23 * Math.sin(phi) * Math.sin(theta);

      if (y > -0.05 && z < 0.18) {
        const curl = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.016, 8, 12), hairMat);
        curl.position.set(x, y, z);
        curl.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        curl.castShadow = true;
        hairGroup.add(curl);
      }
    }
  } else if (style === 'side_part') {
    // Polished swept side part
    for (let s = -4; s <= 5; s++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(s * 0.04 - 0.04, 0.22, 0.14),
        new THREE.Vector3(s * 0.045, 0.20 - Math.abs(s) * 0.01, -0.02),
        new THREE.Vector3(s * 0.048 + 0.04, 0.14, -0.16),
      ]);
      const sweep = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.035, 8, false), hairMat);
      sweep.castShadow = true;
      hairGroup.add(sweep);
    }
  } else {
    // Twin tails / pigtails with ribbons
    [-1, 1].forEach(side => {
      const tie = new THREE.Mesh(
        new THREE.TorusGeometry(0.042, 0.014, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.3 })
      );
      tie.position.set(side * 0.24, 0.12, -0.10);
      tie.rotation.set(0.3, side * 0.4, 0);
      hairGroup.add(tie);

      for (let w = 0; w < 3; w++) {
        const waveCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * (0.24 + w * 0.01), 0.12, -0.10),
          new THREE.Vector3(side * (0.33 + w * 0.015), -0.02, -0.11),
          new THREE.Vector3(side * (0.35 + w * 0.01), -0.18, -0.08),
          new THREE.Vector3(side * (0.31 + w * 0.008), -0.34, -0.04),
          new THREE.Vector3(side * (0.27 + w * 0.005), -0.46, -0.02),
        ]);
        const wave = new THREE.Mesh(new THREE.TubeGeometry(waveCurve, 16, 0.034 - w * 0.005, 8, false), hairMat);
        wave.castShadow = true;
        hairGroup.add(wave);
      }
    });
  }

  headGroup.add(hairGroup);
}

// ------------------------------------------------------------------
// 6. Realistic Eyewear, Headwear & Accessories
// ------------------------------------------------------------------
function createRealisticAccessory(
  acc: Accessory,
  headGroup: THREE.Group
): void {
  if (acc === 'none') return;

  const accGroup = new THREE.Group();

  if (acc === 'round_wire_glasses') {
    // Stylish round metallic wire spectacles
    const glasses = new THREE.Group();
    glasses.position.set(0, 0.036, 0.198);

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37, // Elegant warm gold
      metalness: 0.88,
      roughness: 0.22,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.30,
      roughness: 0.05,
      transmission: 0.92,
      reflectivity: 0.95,
    });

    // Bridge wire
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.052, 8), wireMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.005, 0);
    glasses.add(bridge);

    [-1, 1].forEach(side => {
      // Circular wire rims
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.0045, 8, 28), wireMat);
      rim.position.set(side * 0.084, 0, 0);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.046, 24), lensMat);
      lens.position.set(0, 0, 0.002);
      rim.add(lens);
      glasses.add(rim);

      // Temples to ears
      const temple = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.22, 8), wireMat);
      temple.position.set(side * 0.138, 0.008, -0.105);
      temple.rotation.x = Math.PI / 2;
      temple.rotation.y = side * 0.12;
      glasses.add(temple);
    });

    accGroup.add(glasses);
  } else if (acc === 'thick_rim_glasses') {
    // Modern thick-rimmed acetate eyeglasses
    const glasses = new THREE.Group();
    glasses.position.set(0, 0.036, 0.198);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      transmission: 0.92,
    });

    // Keyhole bridge
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.016, 0.015), frameMat);
    glasses.add(bridge);

    [-1, 1].forEach(side => {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(0.092, 0.068, 0.015), frameMat);
      rim.position.set(side * 0.086, 0, 0);
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.054, 0.017), lensMat);
      rim.add(lens);
      glasses.add(rim);

      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.22), frameMat);
      temple.position.set(side * 0.136, 0.012, -0.105);
      temple.rotation.y = side * 0.12;
      glasses.add(temple);
    });

    accGroup.add(glasses);
  } else if (acc === 'beanie') {
    // Cozy knit fisherman / skater beanie
    const beanie = new THREE.Group();
    beanie.position.set(0, 0.18, -0.04);
    beanie.rotation.x = 0.22;

    const beanieMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
    });

    // Beanie cap dome
    const domeGeom = new THREE.SphereGeometry(0.24, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
    domeGeom.scale(1.02, 1.22, 1.05);
    const dome = new THREE.Mesh(domeGeom, beanieMat);
    beanie.add(dome);

    // Folded cuff rib
    const cuffGeom = new THREE.TorusGeometry(0.235, 0.038, 12, 28);
    const cuff = new THREE.Mesh(cuffGeom, beanieMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.06, 0);
    beanie.add(cuff);

    accGroup.add(beanie);
  } else if (acc === 'bucket_hat') {
    // Trendy summer canvas bucket hat
    const hat = new THREE.Group();
    hat.position.set(0, 0.17, -0.02);
    hat.rotation.x = 0.08;

    const hatMat = new THREE.MeshStandardMaterial({
      color: 0x15803D, // Forest khaki
      roughness: 0.7,
    });

    // Crown cylinder
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.23, 0.15, 24), hatMat);
    crown.castShadow = true;
    hat.add(crown);

    // Flat top lid
    const topLid = new THREE.Mesh(new THREE.CircleGeometry(0.21, 24), hatMat);
    topLid.position.y = 0.075;
    topLid.rotation.x = -Math.PI / 2;
    hat.add(topLid);

    // Downward sloping brim
    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.33, 0.07, 24, 1, true),
      hatMat
    );
    brim.position.y = -0.08;
    hat.add(brim);

    accGroup.add(hat);
  } else if (acc === 'straw_hat') {
    // Panama straw hat with ribbon
    const hat = new THREE.Group();
    hat.position.set(0, 0.18, -0.02);
    hat.rotation.x = -0.1;

    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xFDE68A,
      roughness: 0.75,
    });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.025, 24), strawMat);
    hat.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.16, 24), strawMat);
    crown.position.y = 0.085;
    hat.add(crown);

    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xBE123C, roughness: 0.4 });
    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.038, 24), ribbonMat);
    ribbon.position.y = 0.028;
    hat.add(ribbon);

    accGroup.add(hat);
  } else if (acc === 'sunglasses_head') {
    // Sunglasses pushed up on forehead
    const glasses = new THREE.Group();
    glasses.position.set(0, 0.16, 0.12);
    glasses.rotation.x = -0.65;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.3 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x09090B, roughness: 0.1, metalness: 0.7 });

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.018), frameMat);
    glasses.add(bridge);

    [-1, 1].forEach(side => {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.075, 0.018), frameMat);
      rim.position.set(side * 0.105, 0, 0);
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.06, 0.02), lensMat);
      rim.add(lens);
      glasses.add(rim);

      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.014, 0.22), frameMat);
      temple.position.set(side * 0.165, 0.01, -0.11);
      glasses.add(temple);
    });

    accGroup.add(glasses);
  } else if (acc === 'pink_bow' || acc === 'flower_clip') {
    const clipGroup = new THREE.Group();
    clipGroup.position.set(0.21, 0.14, 0.12);
    clipGroup.rotation.set(0.2, 0.4, -0.2);

    const petalMat = new THREE.MeshStandardMaterial({
      color: acc === 'pink_bow' ? 0xF43F5E : 0xFDE047,
      roughness: 0.35,
    });
    for (let p = 0; p < 5; p++) {
      const ang = (p / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 10), petalMat);
      petal.scale.set(1, 1.4, 0.4);
      petal.position.set(Math.cos(ang) * 0.038, Math.sin(ang) * 0.038, 0);
      clipGroup.add(petal);
    }
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    clipGroup.add(center);
    accGroup.add(clipGroup);
  }

  headGroup.add(accGroup);
}

// ------------------------------------------------------------------
// 7. Core Realistic Human Customer Generator
// ------------------------------------------------------------------
export function createRealisticHumanCustomer(appearance: CustomerAppearance): RealisticHumanController {
  const root = new THREE.Group();
  root.name = 'realistic_customer';

  // Body Type & Height Scaling Parameters
  const bodyType: BodyType = appearance.bodyType || 'average';
  const height: HeightType = appearance.height || 'average';
  const clothingStyle: ClothingStyle = appearance.clothingStyle || 'crewneck_tshirt';
  const facialHair: FacialHair = appearance.facialHair || 'none';

  const heightFactor = height === 'short' ? 0.93 : height === 'tall' ? 1.07 : 1.0;

  // Horizontal Body Proportions
  let torsoScaleX = 1.0;
  let torsoScaleZ = 1.0;
  let shoulderScale = 1.0;
  let waistScale = 1.0;
  let hipScale = 1.0;
  let armThick = 1.0;
  let legThick = 1.0;
  let cheekFullness = 1.0;

  if (bodyType === 'slim') {
    torsoScaleX = 0.88;
    torsoScaleZ = 0.88;
    shoulderScale = 0.88;
    waistScale = 0.86;
    hipScale = 0.88;
    armThick = 0.86;
    legThick = 0.88;
    cheekFullness = 0.92;
  } else if (bodyType === 'athletic') {
    torsoScaleX = 1.15;
    torsoScaleZ = 0.96;
    shoulderScale = 1.20;
    waistScale = 0.94; // athletic V-taper
    hipScale = 0.96;
    armThick = 1.16;
    legThick = 1.08;
    cheekFullness = 0.98;
  } else if (bodyType === 'sturdy') {
    torsoScaleX = 1.16;
    torsoScaleZ = 1.14;
    shoulderScale = 1.15;
    waistScale = 1.14;
    hipScale = 1.15;
    armThick = 1.14;
    legThick = 1.14;
    cheekFullness = 1.08;
  } else if (bodyType === 'plus') {
    torsoScaleX = 1.26;
    torsoScaleZ = 1.28;
    shoulderScale = 1.12;
    waistScale = 1.28;
    hipScale = 1.26;
    armThick = 1.18;
    legThick = 1.22;
    cheekFullness = 1.20;
  }

  // Realistic Face Texture
  const faceTexture = createRealisticFaceTexture(
    appearance.skinTone,
    appearance.hairColor,
    appearance.gender,
    facialHair,
    cheekFullness
  );

  // Realistic PBR Skin Material
  const skinColor = new THREE.Color(appearance.skinTone);
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.52,
    metalness: 0.01,
  });

  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.48,
    metalness: 0.01,
  });

  // Hair Material
  const hairTexture = createRealisticHairTexture(appearance.hairColor);
  const hairColor = new THREE.Color(appearance.hairColor);
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    map: hairTexture,
    roughness: 0.32,
    metalness: 0.08,
  });

  // Primary & Secondary Clothing Fabrics
  const primaryFabricTex = createFabricTexture(
    appearance.shirtColor,
    clothingStyle,
    appearance.secondaryClothingColor || '#FFFFFF'
  );
  const shirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.shirtColor),
    map: primaryFabricTex,
    roughness: 0.65,
  });

  const secondaryShirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.secondaryClothingColor || '#F8FAFC'),
    roughness: 0.65,
  });

  // Trousers Material
  const pantsMat = new THREE.MeshStandardMaterial({
    color: appearance.gender === 'male' ? 0x1E293B : 0x334155,
    roughness: 0.75,
  });

  // Modern Clean Sneakers
  const shoesMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.35,
  });

  // ==========================================
  // 1. LOWER BODY: Standing realistically on floor (y = 0)
  // ==========================================
  const lowerBody = new THREE.Group();

  // Pelvis / Hips
  const pelvisGeom = new THREE.CylinderGeometry(0.20, 0.18, 0.22, 16);
  pelvisGeom.scale(1.15 * hipScale, 1, 0.85 * hipScale);
  const pelvis = new THREE.Mesh(pelvisGeom, pantsMat);
  pelvis.position.y = 0.85 * heightFactor;
  pelvis.castShadow = true;
  lowerBody.add(pelvis);

  // Left & Right Legs
  [-1, 1].forEach(side => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.12 * hipScale, 0, 0);

    // Thigh
    const thighGeom = new THREE.CylinderGeometry(0.09 * legThick, 0.075 * legThick, 0.44 * heightFactor, 16);
    const thigh = new THREE.Mesh(thighGeom, pantsMat);
    thigh.position.y = 0.56 * heightFactor;
    thigh.castShadow = true;
    leg.add(thigh);

    // Calf
    const calfGeom = new THREE.CylinderGeometry(0.075 * legThick, 0.06 * legThick, 0.44 * heightFactor, 16);
    const calf = new THREE.Mesh(calfGeom, pantsMat);
    calf.position.y = 0.22 * heightFactor;
    calf.castShadow = true;
    leg.add(calf);

    // Sneaker
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, 0.045, 0.04);

    const upperGeom = new THREE.BoxGeometry(0.115 * legThick, 0.08, 0.25);
    const upper = new THREE.Mesh(upperGeom, shoesMat);
    upper.castShadow = true;
    shoeGroup.add(upper);

    const soleGeom = new THREE.BoxGeometry(0.12 * legThick, 0.022, 0.255);
    const sole = new THREE.Mesh(soleGeom, new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.4 }));
    sole.position.y = -0.035;
    shoeGroup.add(sole);

    leg.add(shoeGroup);
    lowerBody.add(leg);
  });
  root.add(lowerBody);

  // ==========================================
  // 2. UPPER BODY: Clothing & Torso Anatomy
  // ==========================================
  const chestGroup = new THREE.Group();
  chestGroup.position.y = 0.96 * heightFactor;

  // Abdomen & Waist
  const abdomenGeom = new THREE.CylinderGeometry(0.22 * waistScale, 0.19 * hipScale, 0.28, 20);
  abdomenGeom.scale(1.15 * torsoScaleX, 1, 0.85 * torsoScaleZ);
  const abdomen = new THREE.Mesh(abdomenGeom, shirtMat);
  abdomen.position.y = 0.14;
  abdomen.castShadow = true;
  chestGroup.add(abdomen);

  // Chest & Upper Torso
  const chestGeom = new THREE.CylinderGeometry(0.26 * shoulderScale, 0.22 * waistScale, 0.36, 20);
  chestGeom.scale(1.2 * torsoScaleX, 1, 0.82 * torsoScaleZ);
  const chest = new THREE.Mesh(chestGeom, shirtMat);
  chest.position.y = 0.44;
  chest.castShadow = true;
  chestGroup.add(chest);

  // Trapezius Shoulders
  [-1, 1].forEach(side => {
    const trapGeom = new THREE.CylinderGeometry(0.08, 0.14 * shoulderScale, 0.18, 12);
    trapGeom.scale(1, 1, 0.7 * torsoScaleZ);
    const trap = new THREE.Mesh(trapGeom, shirtMat);
    trap.position.set(side * 0.20 * shoulderScale, 0.54, 0);
    trap.rotation.z = -side * 0.55;
    chestGroup.add(trap);
  });

  // ==========================================
  // DIVERSE CLOTHING DETAILS (Hoodie, Button-down, Denim Jacket, Sweater Vest, etc.)
  // ==========================================
  const collarMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.shirtColor).clone().offsetHSL(0, 0, -0.08),
    roughness: 0.7,
  });

  if (clothingStyle === 'hoodie') {
    // Kangaroo pouch pocket
    const pocketGeom = new THREE.BoxGeometry(0.26 * torsoScaleX, 0.15, 0.05);
    const pocket = new THREE.Mesh(pocketGeom, shirtMat);
    pocket.position.set(0, 0.20, 0.21 * torsoScaleZ);
    pocket.rotation.x = -0.15;
    chestGroup.add(pocket);

    // Thick cozy hood draped behind neck
    const hoodGeom = new THREE.TorusGeometry(0.18 * shoulderScale, 0.06, 12, 24, Math.PI * 1.3);
    const hood = new THREE.Mesh(hoodGeom, shirtMat);
    hood.position.set(0, 0.60, -0.08);
    hood.rotation.x = 1.1;
    chestGroup.add(hood);

    // Hoodie drawstrings with metal aglets
    [-1, 1].forEach(side => {
      const stringGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.18, 8);
      const string = new THREE.Mesh(stringGeom, new THREE.MeshStandardMaterial({ color: 0xF8FAFC }));
      string.position.set(side * 0.05, 0.46, 0.21 * torsoScaleZ);
      chestGroup.add(string);

      const aglet = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.024, 8), new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8 }));
      aglet.position.set(side * 0.05, 0.36, 0.21 * torsoScaleZ);
      chestGroup.add(aglet);
    });
  } else if (clothingStyle === 'button_shirt') {
    // Smart collared button-down shirt
    // Center vertical placket
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.02), collarMat);
    placket.position.set(0, 0.38, 0.20 * torsoScaleZ);
    chestGroup.add(placket);

    // 4 pearlescent buttons
    for (let b = 0; b < 4; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.008, 10), new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.2 }));
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, 0.22 + b * 0.10, 0.215 * torsoScaleZ);
      chestGroup.add(btn);
    }

    // Folded shirt point collar wings
    [-1, 1].forEach(side => {
      const wingGeom = new THREE.BoxGeometry(0.08, 0.045, 0.015);
      const wing = new THREE.Mesh(wingGeom, collarMat);
      wing.position.set(side * 0.07, 0.62, 0.12 * torsoScaleZ);
      wing.rotation.set(0.3, side * 0.35, -side * 0.25);
      chestGroup.add(wing);
    });

    // Left chest patch pocket
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.01), collarMat);
    pocket.position.set(-0.11 * torsoScaleX, 0.46, 0.195 * torsoScaleZ);
    chestGroup.add(pocket);
  } else if (clothingStyle === 'denim_jacket') {
    // Open casual jacket over inner t-shirt
    // Inner shirt center panel
    const innerTee = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * shoulderScale, 0.20 * waistScale, 0.38, 16), secondaryShirtMat);
    innerTee.scale.set(1.15 * torsoScaleX, 1, 0.80 * torsoScaleZ);
    innerTee.position.y = 0.44;
    chestGroup.add(innerTee);

    // Left and right open jacket lapels
    [-1, 1].forEach(side => {
      const lapelGeom = new THREE.BoxGeometry(0.12 * shoulderScale, 0.42, 0.02);
      const lapel = new THREE.Mesh(lapelGeom, shirtMat);
      lapel.position.set(side * 0.15 * shoulderScale, 0.42, 0.20 * torsoScaleZ);
      lapel.rotation.y = side * 0.2;
      chestGroup.add(lapel);

      // Silver rivet button
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.9 }));
      rivet.position.set(side * 0.11 * shoulderScale, 0.40, 0.215 * torsoScaleZ);
      chestGroup.add(rivet);
    });
  } else if (clothingStyle === 'sweater_vest') {
    // V-neck sweater vest with crisp collared shirt peeking out
    // White inner shirt collar points
    [-1, 1].forEach(side => {
      const wingGeom = new THREE.BoxGeometry(0.085, 0.048, 0.016);
      const wing = new THREE.Mesh(wingGeom, secondaryShirtMat);
      wing.position.set(side * 0.065, 0.63, 0.11 * torsoScaleZ);
      wing.rotation.set(0.25, side * 0.3, -side * 0.2);
      chestGroup.add(wing);
    });

    // V-neck rib trim
    [-1, 1].forEach(side => {
      const vRib = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.015), collarMat);
      vRib.position.set(side * 0.045, 0.54, 0.19 * torsoScaleZ);
      vRib.rotation.z = side * 0.42;
      chestGroup.add(vRib);
    });
  } else if (clothingStyle === 'tank_top') {
    // Summer sleeveless scoop tank - bare shoulders
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 10, 24), collarMat);
    collar.rotation.x = Math.PI / 2 + 0.12;
    collar.position.set(0, 0.58, 0.04);
    chestGroup.add(collar);
  } else {
    // Classic crewneck ribbed collar ring
    const collarGeom = new THREE.TorusGeometry(0.105, 0.024, 12, 24);
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.rotation.x = Math.PI / 2 + 0.12;
    collar.position.set(0, 0.63, 0.025);
    chestGroup.add(collar);
  }

  // Clavicle subtle highlight
  const clavicleGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.16 * shoulderScale, 8);
  const clavicleMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.5 });
  [-1, 1].forEach(side => {
    const clav = new THREE.Mesh(clavicleGeom, clavicleMat);
    clav.position.set(side * 0.09 * shoulderScale, 0.60, 0.085 * torsoScaleZ);
    clav.rotation.z = side * 0.18;
    clav.rotation.y = side * 0.22;
    chestGroup.add(clav);
  });

  // ==========================================
  // 3. ARMS & REALISTIC HANDS (Natural relaxed resting pose)
  // ==========================================
  const armSleeveMat = clothingStyle === 'tank_top'
    ? skinMat
    : clothingStyle === 'sweater_vest'
    ? secondaryShirtMat
    : shirtMat;

  const createArm = (isLeft: boolean): THREE.Group => {
    const armGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    armGroup.position.set(side * 0.32 * shoulderScale, 0.54, 0);

    // Shoulder cap
    const shoulderGeom = new THREE.SphereGeometry(0.075 * armThick, 16, 16);
    const shoulder = new THREE.Mesh(shoulderGeom, armSleeveMat);
    armGroup.add(shoulder);

    // Upper arm
    const upperArmGeom = new THREE.CylinderGeometry(0.062 * armThick, 0.052 * armThick, 0.32 * heightFactor, 16);
    const upperArm = new THREE.Mesh(upperArmGeom, armSleeveMat);
    upperArm.position.set(side * 0.02, -0.16 * heightFactor, 0.02);
    upperArm.rotation.z = side * 0.12;
    upperArm.rotation.x = 0.14;
    upperArm.castShadow = true;
    armGroup.add(upperArm);

    // Sleeve cuff (if not sleeveless tank)
    if (clothingStyle !== 'tank_top') {
      const cuffGeom = new THREE.TorusGeometry(0.054 * armThick, 0.012, 10, 16);
      const cuff = new THREE.Mesh(cuffGeom, collarMat);
      cuff.position.set(side * 0.038, -0.30 * heightFactor, 0.05);
      cuff.rotation.x = Math.PI / 2;
      armGroup.add(cuff);
    }

    // Forearm (Natural skin reach towards counter)
    const forearmGeom = new THREE.CylinderGeometry(0.048 * armThick, 0.038 * armThick, 0.30 * heightFactor, 16);
    const forearm = new THREE.Mesh(forearmGeom, skinMat);
    forearm.position.set(side * 0.06, -0.46 * heightFactor, 0.14);
    forearm.rotation.x = 0.45;
    forearm.rotation.z = side * 0.14;
    forearm.castShadow = true;
    armGroup.add(forearm);

    // Wrist & Sculpted Hand
    const handGroup = new THREE.Group();
    handGroup.position.set(side * 0.08, -0.58 * heightFactor, 0.24);

    // Palm
    const palmGeom = new THREE.BoxGeometry(0.068 * armThick, 0.032, 0.08);
    const palm = new THREE.Mesh(palmGeom, skinMat);
    handGroup.add(palm);

    // Thumb
    const thumbGeom = new THREE.CylinderGeometry(0.012, 0.010, 0.044, 8);
    const thumb = new THREE.Mesh(thumbGeom, skinMat);
    thumb.position.set(-side * 0.038, 0.008, 0.01);
    thumb.rotation.set(0.3, -side * 0.4, side * 0.5);
    handGroup.add(thumb);

    // Fingers
    for (let f = 0; f < 4; f++) {
      const fingerGeom = new THREE.CylinderGeometry(0.010, 0.008, 0.052, 8);
      const finger = new THREE.Mesh(fingerGeom, skinMat);
      finger.position.set(-0.022 + f * 0.015, -0.004, 0.055);
      finger.rotation.x = 0.32;
      handGroup.add(finger);
    }

    armGroup.add(handGroup);
    return armGroup;
  };

  const leftArm = createArm(true);
  const rightArm = createArm(false);
  chestGroup.add(leftArm, rightArm);
  root.add(chestGroup);

  // ==========================================
  // 4. ANATOMICAL NECK
  // ==========================================
  const neckGeom = new THREE.CylinderGeometry(0.085 * cheekFullness, 0.105 * shoulderScale, 0.18, 20);
  const neck = new THREE.Mesh(neckGeom, skinMat);
  neck.position.y = 1.62 * heightFactor;
  neck.castShadow = true;
  root.add(neck);

  // ==========================================
  // 5. SCULPTED HEAD & REALISTIC FACIAL ANATOMY
  // ==========================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.84 * heightFactor, 0);

  // Cranium
  const headGeom = new THREE.SphereGeometry(0.205, 36, 32);
  headGeom.scale(0.92 * cheekFullness, 1.14, 1.04);
  const headMesh = new THREE.Mesh(headGeom, faceMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Sculpted Jawline & Soft Chin
  const chinGeom = new THREE.SphereGeometry(0.088 * cheekFullness, 20, 20);
  chinGeom.scale(0.98, 0.82, 1.08);
  const chin = new THREE.Mesh(chinGeom, skinMat);
  chin.position.set(0, -0.155, 0.105);
  headGroup.add(chin);

  // Cheekbone Contours (Zygomatic arches)
  [-1, 1].forEach(side => {
    const cheekGeom = new THREE.SphereGeometry(0.07 * cheekFullness, 16, 16);
    cheekGeom.scale(1.0, 0.78, 0.95);
    const cheek = new THREE.Mesh(cheekGeom, skinMat);
    cheek.position.set(side * 0.125 * cheekFullness, -0.02, 0.135);
    headGroup.add(cheek);
  });

  // Anatomical Ears
  [-1, 1].forEach(side => {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.195 * cheekFullness, -0.01, -0.01);
    earGroup.rotation.y = side * 0.16;

    const helixGeom = new THREE.TorusGeometry(0.048, 0.011, 10, 18, Math.PI * 1.4);
    const helix = new THREE.Mesh(helixGeom, skinMat);
    helix.rotation.z = side * 0.2;
    earGroup.add(helix);

    const lobeGeom = new THREE.SphereGeometry(0.024, 10, 10);
    lobeGeom.scale(0.8, 1.2, 0.6);
    const lobe = new THREE.Mesh(lobeGeom, skinMat);
    lobe.position.set(0, -0.048, 0);
    earGroup.add(lobe);

    headGroup.add(earGroup);
  });

  // Sculpted Nose
  const noseGroup = new THREE.Group();
  noseGroup.position.set(0, -0.02, 0.205);

  const bridgeGeom = new THREE.CylinderGeometry(0.015, 0.021, 0.088, 14);
  const noseBridge = new THREE.Mesh(bridgeGeom, skinMat);
  noseBridge.position.set(0, 0.03, -0.008);
  noseBridge.rotation.x = 0.26;
  noseGroup.add(noseBridge);

  const tipGeom = new THREE.SphereGeometry(0.022, 14, 14);
  const noseTip = new THREE.Mesh(tipGeom, skinMat);
  noseTip.position.set(0, -0.018, 0.018);
  noseGroup.add(noseTip);

  [-1, 1].forEach(side => {
    const nostrilGeom = new THREE.SphereGeometry(0.015, 12, 12);
    nostrilGeom.scale(0.8, 0.8, 1.0);
    const nostril = new THREE.Mesh(nostrilGeom, skinMat);
    nostril.position.set(side * 0.022, -0.02, 0.004);
    noseGroup.add(nostril);
  });
  headGroup.add(noseGroup);

  // Anatomical Lips
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, -0.108, 0.198);

  const lipColor = skinColor.clone().offsetHSL(0, 0.22, -0.06);
  const lipMat = new THREE.MeshStandardMaterial({
    color: lipColor,
    roughness: 0.32,
  });

  const upperLipGeom = new THREE.CylinderGeometry(0.013, 0.013, 0.072, 14);
  const upperLip = new THREE.Mesh(upperLipGeom, lipMat);
  upperLip.rotation.z = Math.PI / 2;
  upperLip.position.set(0, 0.01, 0);
  mouthGroup.add(upperLip);

  const lowerLipGeom = new THREE.SphereGeometry(0.020, 14, 14);
  lowerLipGeom.scale(1.7, 0.85, 0.7);
  const lowerLip = new THREE.Mesh(lowerLipGeom, lipMat);
  lowerLip.position.set(0, -0.011, 0.004);
  mouthGroup.add(lowerLip);

  headGroup.add(mouthGroup);

  // ==========================================
  // 6. REALISTIC HUMAN EYES (Catchlights, Limbal Ring, Cornea)
  // ==========================================
  const irisTex = createRealisticIrisTexture(appearance.eyeColor);
  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.1,
  });
  const irisMat = new THREE.MeshStandardMaterial({
    map: irisTex,
    roughness: 0.05,
    metalness: 0.05,
  });
  const corneaMat = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.35,
    roughness: 0.02,
    transmission: 0.9,
    reflectivity: 0.95,
  });

  const createRealisticEye = (isLeft: boolean): { eyeAssembly: THREE.Group; eyelid: THREE.Mesh } => {
    const eyeAssembly = new THREE.Group();
    const side = isLeft ? -1 : 1;
    eyeAssembly.position.set(side * 0.084, 0.034, 0.182);
    eyeAssembly.rotation.y = side * 0.10;

    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.036, 22, 20), scleraMat);
    eyeAssembly.add(eyeball);

    const irisGeom = new THREE.CircleGeometry(0.018, 26);
    const iris = new THREE.Mesh(irisGeom, irisMat);
    iris.position.set(0, 0, 0.035);
    eyeAssembly.add(iris);

    const corneaGeom = new THREE.SphereGeometry(0.023, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cornea = new THREE.Mesh(corneaGeom, corneaMat);
    cornea.position.set(0, 0, 0.027);
    eyeAssembly.add(cornea);

    const lashGeom = new THREE.TorusGeometry(0.036, 0.0035, 6, 16, Math.PI * 0.85);
    const lashMat = new THREE.MeshBasicMaterial({ color: 0x090D16 });
    const lash = new THREE.Mesh(lashGeom, lashMat);
    lash.position.set(0, 0.015, 0.028);
    lash.rotation.z = side * 0.08;
    eyeAssembly.add(lash);

    const eyelidGeom = new THREE.SphereGeometry(0.039, 22, 18, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const eyelid = new THREE.Mesh(eyelidGeom, skinMat);
    eyelid.position.set(0, 0.004, 0);
    eyelid.rotation.x = -Math.PI * 0.55;
    eyeAssembly.add(eyelid);

    return { eyeAssembly, eyelid };
  };

  const leftEye = createRealisticEye(true);
  const rightEye = createRealisticEye(false);
  headGroup.add(leftEye.eyeAssembly, rightEye.eyeAssembly);

  // Scalp Hair & Accessories
  createRealisticHair(appearance.hairStyle, hairMat, headGroup);
  createRealisticAccessory(appearance.accessory, headGroup);

  root.add(headGroup);

  // ==========================================
  // 7. REALISTIC ANIMATION CONTROLLER
  // ==========================================
  const controller: RealisticHumanController = {
    group: root,
    headGroup,
    chestGroup,
    leftEyeLid: leftEye.eyelid,
    rightEyeLid: rightEye.eyelid,
    leftArm,
    rightArm,
    blinkTimer: 0,
    nextBlinkTime: 2.2 + Math.random() * 2.8,
    isBlinking: false,
    happyTimer: 0,

    triggerHappy: () => {
      controller.happyTimer = 2.0;
    },

    update: (delta: number, elapsedTime: number) => {
      // 1. Natural subtle human breathing cycle (approx. 14-16 breaths/min)
      const breath = Math.sin(elapsedTime * 2.1) * 0.014;
      chestGroup.scale.set(1 + breath * 0.4, 1 + breath, 1 + breath * 0.4);
      headGroup.position.y = 1.84 * heightFactor + breath * 0.3;

      // 2. Micro-gaze & natural subtle head idle (saccadic presence)
      const idleYaw = Math.sin(elapsedTime * 0.75) * 0.035;
      const idlePitch = Math.cos(elapsedTime * 1.05) * 0.022;
      headGroup.rotation.y = idleYaw;
      headGroup.rotation.x = idlePitch + 0.05;

      // 3. Realistic Natural Blinking (Swift 140ms eyelid flutter)
      controller.blinkTimer += delta;
      if (!controller.isBlinking && controller.blinkTimer >= controller.nextBlinkTime) {
        controller.isBlinking = true;
        controller.blinkTimer = 0;
      }

      if (controller.isBlinking) {
        const blinkProgress = controller.blinkTimer / 0.15;
        if (blinkProgress >= 1.0) {
          controller.isBlinking = false;
          controller.blinkTimer = 0;
          controller.nextBlinkTime = 2.0 + Math.random() * 3.5;
          controller.leftEyeLid.rotation.x = -Math.PI * 0.55;
          controller.rightEyeLid.rotation.x = -Math.PI * 0.55;
        } else {
          const eyelidAngle = -Math.PI * 0.55 + Math.sin(blinkProgress * Math.PI) * 0.56;
          controller.leftEyeLid.rotation.x = eyelidAngle;
          controller.rightEyeLid.rotation.x = eyelidAngle;
        }
      }

      // 4. Celebratory Hand Wave & Grateful Nod when served
      if (controller.happyTimer > 0) {
        controller.happyTimer -= delta;
        const waveAngle = Math.sin(elapsedTime * 12) * 0.32;
        controller.rightArm.rotation.z = -0.65 + waveAngle;
        controller.rightArm.rotation.x = 0.55;
        headGroup.rotation.x = Math.sin(elapsedTime * 9) * 0.07 + 0.05;
      } else {
        controller.rightArm.rotation.z = 0;
        controller.rightArm.rotation.x = 0;
      }
    },
  };

  return controller;
}
