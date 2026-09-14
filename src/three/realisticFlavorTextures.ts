import * as THREE from 'three';
import { FlavorId } from '../types/game';

// Cache textures for performance
const textureCache = new Map<FlavorId, THREE.CanvasTexture>();

/**
 * Creates a photorealistic, artisan ice cream texture with real fruit chunks,
 * seeds, chocolate chips, and swirls.
 */
export function getRealisticFlavorTexture(flavorId: FlavorId): THREE.CanvasTexture {
  if (textureCache.has(flavorId)) {
    return textureCache.get(flavorId)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  switch (flavorId) {
    case 'strawberry':
      drawRealisticStrawberryTexture(ctx);
      break;
    case 'vanilla':
      drawRealisticVanillaBeanTexture(ctx);
      break;
    case 'chocolate':
      drawRealisticChocolateFudgeTexture(ctx);
      break;
    case 'mint':
      drawRealisticMintChocoTexture(ctx);
      break;
    case 'mango':
      drawRealisticMangoTexture(ctx);
      break;
    case 'blueberry':
      drawRealisticBlueberryTexture(ctx);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  textureCache.set(flavorId, texture);
  return texture;
}

// 1. Real Strawberry Ice Cream with Strawberry Chunks, Seeds, and Puree Ripples
function drawRealisticStrawberryTexture(ctx: CanvasRenderingContext2D) {
  // Base creamy strawberry pink
  ctx.fillStyle = '#FB7185';
  ctx.fillRect(0, 0, 512, 512);

  // Soft marbled cream swirls
  for (let i = 0; i < 8; i++) {
    const grad = ctx.createRadialGradient(
      Math.random() * 512, Math.random() * 512, 20,
      Math.random() * 512, Math.random() * 512, 160
    );
    grad.addColorStop(0, 'rgba(255, 228, 230, 0.6)'); // Sweet cream
    grad.addColorStop(0.6, 'rgba(244, 63, 94, 0.4)'); // Deep berry
    grad.addColorStop(1, 'rgba(251, 113, 133, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 140, 0, Math.PI * 2);
    ctx.fill();
  }

  // Strawberry Jam / Puree Ripple Veins
  ctx.strokeStyle = '#BE123C';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  for (let r = 0; r < 5; r++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }

  // Real Embedded Diced Strawberry Chunks (Dark ruby red with seed indents)
  for (let c = 0; c < 35; c++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = 8 + Math.random() * 14;

    ctx.fillStyle = '#881337'; // Deep dark strawberry fruit flesh
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.75, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright pulp highlight
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.ellipse(x + 2, y - 2, radius * 0.5, radius * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tiny Golden Strawberry Seeds scattered across the ice cream
  for (let s = 0; s < 120; s++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;

    // Small dark shadow rim
    ctx.fillStyle = 'rgba(136, 19, 55, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x, y, 3.5, 2.2, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Golden yellow strawberry achene seed
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.ellipse(x + 0.8, y - 0.5, 2.4, 1.4, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 2. Real Vanilla Bean with Micro Vanilla Bean Specks & Custard Swirl
function drawRealisticVanillaBeanTexture(ctx: CanvasRenderingContext2D) {
  // Rich custard cream base
  ctx.fillStyle = '#FEF3C7';
  ctx.fillRect(0, 0, 512, 512);

  // Soft warm honey/buttercream marbling
  for (let i = 0; i < 7; i++) {
    const grad = ctx.createRadialGradient(
      Math.random() * 512, Math.random() * 512, 10,
      Math.random() * 512, Math.random() * 512, 180
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(0.7, 'rgba(253, 230, 138, 0.4)');
    grad.addColorStop(1, 'rgba(254, 243, 199, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 150, 0, Math.PI * 2);
    ctx.fill();
  }

  // Real ground black vanilla bean specks
  for (let b = 0; b < 320; b++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() < 0.25 ? 2.5 : 1.4;

    ctx.fillStyle = Math.random() < 0.6 ? '#1E293B' : '#0F172A';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 3. Dark Chocolate Fudge with Choco Chips & Brownie Bits
function drawRealisticChocolateFudgeTexture(ctx: CanvasRenderingContext2D) {
  // Rich Dutch cocoa base
  ctx.fillStyle = '#3E1F0F';
  ctx.fillRect(0, 0, 512, 512);

  // Glossy fudge ribbon swirls
  ctx.strokeStyle = '#231107';
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';
  for (let r = 0; r < 6; r++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }

  // Real dark chocolate chips & chunks
  for (let c = 0; c < 55; c++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = 6 + Math.random() * 10;

    // Dark chip
    ctx.fillStyle = '#180B04';
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.9, y + size * 0.7);
    ctx.lineTo(x - size * 0.9, y + size * 0.7);
    ctx.closePath();
    ctx.fill();

    // Specular chip sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// 4. Fresh Mint with Chocolate Flakes and Mint Leaf specks
function drawRealisticMintChocoTexture(ctx: CanvasRenderingContext2D) {
  // Fresh pastel green mint base
  ctx.fillStyle = '#A7F3D0';
  ctx.fillRect(0, 0, 512, 512);

  // Soft minty swirls
  for (let i = 0; i < 6; i++) {
    const grad = ctx.createRadialGradient(
      Math.random() * 512, Math.random() * 512, 10,
      Math.random() * 512, Math.random() * 512, 140
    );
    grad.addColorStop(0, 'rgba(209, 250, 229, 0.7)');
    grad.addColorStop(0.7, 'rgba(110, 231, 183, 0.4)');
    grad.addColorStop(1, 'rgba(167, 243, 208, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 130, 0, Math.PI * 2);
    ctx.fill();
  }

  // Natural crushed mint leaf bits
  for (let m = 0; m < 80; m++) {
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark chocolate flake shavings & chips
  for (let f = 0; f < 90; f++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const w = 4 + Math.random() * 12;
    const h = 2 + Math.random() * 6;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

// 5. Tropical Alphonso Mango with Orange Fruit Puree Ribbons
function drawRealisticMangoTexture(ctx: CanvasRenderingContext2D) {
  // Golden sweet mango base
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(0, 0, 512, 512);

  // Intense orange mango puree ripples
  ctx.strokeStyle = '#EA580C';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  for (let r = 0; r < 7; r++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }

  // Mango fruit pulp chunks
  for (let p = 0; p < 30; p++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 8 + Math.random() * 12;

    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Glistening highlight
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 6. Wild Blueberry with Indigo Fruit Bursts and Violet Compote
function drawRealisticBlueberryTexture(ctx: CanvasRenderingContext2D) {
  // Lavender blueberry cream
  ctx.fillStyle = '#C084FC';
  ctx.fillRect(0, 0, 512, 512);

  // Dark violet compote swirls
  ctx.strokeStyle = '#6B21A8';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  for (let r = 0; r < 6; r++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512,
      Math.random() * 512, Math.random() * 512
    );
    ctx.stroke();
  }

  // Whole dark wild blueberries
  for (let b = 0; b < 35; b++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 9 + Math.random() * 8;

    // Deep indigo berry
    ctx.fillStyle = '#3B0764';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Berry bloom highlight
    ctx.fillStyle = '#A855F7';
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // Calyx star
    ctx.fillStyle = '#1E1B4B';
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Creates a 3D Scoop with high-detail realistic material using the procedural fruit texture
 */
export function createRealisticScoopMesh(flavorId: FlavorId): THREE.Group {
  const group = new THREE.Group();
  const texture = getRealisticFlavorTexture(flavorId);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.42,
    metalness: 0.04,
  });

  // Main Sphere Scoop
  const sphereGeom = new THREE.SphereGeometry(0.42, 28, 24);
  sphereGeom.scale(1.04, 0.96, 1.04);
  const sphere = new THREE.Mesh(sphereGeom, mat);
  sphere.castShadow = true;
  group.add(sphere);

  // Ruffled bottom skirt (authentic scoop edge)
  const ruffleCount = 14;
  for (let i = 0; i < ruffleCount; i++) {
    const angle = (i / ruffleCount) * Math.PI * 2;
    const ruffleGeom = new THREE.SphereGeometry(0.12, 10, 10);
    ruffleGeom.scale(1.2, 0.6, 1);
    const ruffle = new THREE.Mesh(ruffleGeom, mat);
    ruffle.position.set(
      Math.cos(angle) * 0.38,
      -0.24 + (i % 2) * 0.04,
      Math.sin(angle) * 0.38
    );
    ruffle.rotation.y = angle;
    group.add(ruffle);
  }

  // Top swirl peak
  const peakGeom = new THREE.ConeGeometry(0.16, 0.22, 14);
  peakGeom.scale(1, 1, 0.8);
  const peak = new THREE.Mesh(peakGeom, mat);
  peak.position.set(0.04, 0.38, 0.02);
  peak.rotation.z = -0.15;
  group.add(peak);

  // For strawberry: add a tiny real 3D strawberry slice garnish!
  if (flavorId === 'strawberry') {
    const strawberryBerry = createMiniStrawberryGarnish();
    strawberryBerry.position.set(0.22, 0.32, 0.18);
    strawberryBerry.rotation.set(0.2, 0.4, 0.3);
    group.add(strawberryBerry);
  }

  return group;
}

/**
 * Creates a miniature 3D strawberry garnish with seeds and calyx leaves
 */
export function createMiniStrawberryGarnish(): THREE.Group {
  const berry = new THREE.Group();

  // Red berry cone/heart
  const berryMat = new THREE.MeshStandardMaterial({
    color: 0xE11D48,
    roughness: 0.25,
  });
  const bodyGeom = new THREE.ConeGeometry(0.065, 0.12, 12);
  const body = new THREE.Mesh(bodyGeom, berryMat);
  body.rotation.x = Math.PI;
  berry.add(body);

  // Tiny green leaves at top
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.4 });
  for (let l = 0; l < 4; l++) {
    const ang = (l / 4) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.02), leafMat);
    leaf.position.set(Math.cos(ang) * 0.03, 0.06, Math.sin(ang) * 0.03);
    leaf.rotation.y = ang;
    berry.add(leaf);
  }

  berry.scale.set(1.2, 1.2, 1.2);
  return berry;
}
