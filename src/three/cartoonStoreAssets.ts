import * as THREE from 'three';
import { FlavorId, ToppingId, ContainerType } from '../types/game';
import { FLAVORS } from '../game/orderManager';

// 1. Wood Grain Texture Helper with bright cartoon warmth
export function createCartoonWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FEF3C7'; // Warm sunny blonde wood
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 3;
  for (let y = 0; y < 256; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.05) * 3);
    ctx.bezierCurveTo(70, y + Math.sin(y * 0.08) * 8, 180, y - Math.sin(y * 0.08) * 8, 256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Trash Can Disposal Icon Texture
export function createTrashIconTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#38BDF8'; // Bright cartoon sky blue
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#FFFFFF';
  // Head
  ctx.beginPath();
  ctx.arc(64, 28, 11, 0, Math.PI * 2);
  ctx.fill();
  // Body torso
  ctx.fillRect(57, 42, 14, 34);
  // Legs
  ctx.fillRect(50, 76, 11, 36);
  ctx.fillRect(67, 76, 11, 36);
  // Arm reaching to bin
  ctx.beginPath();
  ctx.moveTo(71, 46);
  ctx.lineTo(88, 58);
  ctx.lineTo(84, 68);
  ctx.lineTo(71, 56);
  ctx.fill();
  // Mini bin
  ctx.fillRect(90, 60, 20, 30);
  // Falling paper
  ctx.fillRect(84, 52, 5, 5);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Waffle Cone Texture with bright golden baked squares
export function createCartoonWaffleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F59E0B'; // Golden waffle
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 6;
  for (let i = -256; i < 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 256, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  // Soft waffle grid squares
  ctx.fillStyle = '#FBBF24';
  for (let x = 8; x < 256; x += 32) {
    for (let y = 8; y < 256; y += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Cartoon Ice Cream Scoop with cute swirl texture
export function createIceCreamScoop(color: string): THREE.Group {
  const scoopGroup = new THREE.Group();

  const scoopMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.35,
    metalness: 0.05,
  });

  // Main Scoop Sphere
  const mainGeom = new THREE.SphereGeometry(0.42, 24, 24);
  mainGeom.scale(1.05, 0.95, 1.05);
  const mainMesh = new THREE.Mesh(mainGeom, scoopMat);
  mainMesh.castShadow = true;
  scoopGroup.add(mainMesh);

  // Ruffled bottom skirt (authentic scoop edge)
  const ruffleCount = 14;
  for (let i = 0; i < ruffleCount; i++) {
    const angle = (i / ruffleCount) * Math.PI * 2;
    const ruffleGeom = new THREE.SphereGeometry(0.12, 10, 10);
    ruffleGeom.scale(1.2, 0.6, 1);
    const ruffle = new THREE.Mesh(ruffleGeom, scoopMat);
    ruffle.position.set(
      Math.cos(angle) * 0.38,
      -0.24 + (i % 2) * 0.04,
      Math.sin(angle) * 0.38
    );
    ruffle.rotation.y = angle;
    scoopGroup.add(ruffle);
  }

  // Top swirl peak
  const peakGeom = new THREE.ConeGeometry(0.16, 0.22, 12);
  peakGeom.scale(1, 1, 0.8);
  const peak = new THREE.Mesh(peakGeom, scoopMat);
  peak.position.set(0.04, 0.38, 0.02);
  peak.rotation.z = -0.15;
  scoopGroup.add(peak);

  return scoopGroup;
}

// 5. Whipped Cream Cloud
export function createWhippedCreamMesh(): THREE.Group {
  const creamGroup = new THREE.Group();
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.2,
    metalness: 0.05,
  });

  // Base tier
  const tier1Geom = new THREE.TorusGeometry(0.3, 0.12, 14, 20);
  const tier1 = new THREE.Mesh(tier1Geom, creamMat);
  tier1.rotation.x = Math.PI / 2;
  creamGroup.add(tier1);

  // Middle tier
  const tier2Geom = new THREE.TorusGeometry(0.2, 0.1, 12, 18);
  const tier2 = new THREE.Mesh(tier2Geom, creamMat);
  tier2.rotation.x = Math.PI / 2;
  tier2.position.y = 0.14;
  creamGroup.add(tier2);

  // Spiral swirl peak
  const peakGeom = new THREE.ConeGeometry(0.15, 0.32, 14);
  const peak = new THREE.Mesh(peakGeom, creamMat);
  peak.position.set(0.02, 0.28, 0.02);
  peak.rotation.z = -0.2;
  creamGroup.add(peak);

  creamGroup.scale.set(0.85, 0.85, 0.85);
  return creamGroup;
}

// 6. Shiny Red Maraschino Cherry with green curved stem
export function createCherryMesh(): THREE.Group {
  const cherryGroup = new THREE.Group();

  // Cherry Fruit
  const cherryGeom = new THREE.SphereGeometry(0.13, 18, 18);
  cherryGeom.scale(1.05, 0.96, 1.0);
  const cherryMat = new THREE.MeshStandardMaterial({
    color: 0xEF4444, // Bright cartoon red
    roughness: 0.12,
    metalness: 0.2,
  });
  const cherry = new THREE.Mesh(cherryGeom, cherryMat);
  cherry.castShadow = true;
  cherryGroup.add(cherry);

  // Gloss Highlight
  const glossGeom = new THREE.SphereGeometry(0.035, 8, 8);
  const glossMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const gloss = new THREE.Mesh(glossGeom, glossMat);
  gloss.position.set(0.04, 0.05, 0.1);
  cherryGroup.add(gloss);

  // Curved Stem
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0.05, 0.22, 0.02),
    new THREE.Vector3(0.12, 0.32, -0.04),
    new THREE.Vector3(0.18, 0.36, -0.02),
  ]);
  const stemGeom = new THREE.TubeGeometry(curve, 10, 0.015, 6, false);
  const stemMat = new THREE.MeshBasicMaterial({ color: 0x22C55E });
  const stem = new THREE.Mesh(stemGeom, stemMat);
  cherryGroup.add(stem);

  return cherryGroup;
}

// 7. Cartoon Awning Framing Top of Store (Candy Pink & Cream Stripes)
export function createCartoonAwning(): THREE.Group {
  const group = new THREE.Group();

  const awningWidth = 8.8;
  const awningDepth = 1.4;
  const stripeWidth = 0.55;
  const stripesCount = Math.ceil(awningWidth / stripeWidth);

  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xF472B6, roughness: 0.4 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.4 });

  // Main Slanted Canopy
  for (let i = 0; i < stripesCount; i++) {
    const isPink = i % 2 === 0;
    const xPos = -awningWidth / 2 + i * stripeWidth + stripeWidth / 2;

    const stripeGeom = new THREE.BoxGeometry(stripeWidth, 0.05, awningDepth);
    const stripe = new THREE.Mesh(stripeGeom, isPink ? pinkMat : creamMat);
    stripe.position.set(xPos, 0, 0);
    group.add(stripe);

    // Cute Scalloped Fringe along bottom edge
    const scallopGeom = new THREE.CylinderGeometry(stripeWidth / 2, stripeWidth / 2, 0.16, 16, 1, false, 0, Math.PI);
    const scallop = new THREE.Mesh(scallopGeom, isPink ? pinkMat : creamMat);
    scallop.rotation.x = Math.PI / 2;
    scallop.position.set(xPos, -0.08, awningDepth / 2);
    group.add(scallop);

    // Little drop ball at center of scallop
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), creamMat);
    ball.position.set(xPos, -0.2, awningDepth / 2);
    group.add(ball);
  }

  // Angled down slightly
  group.rotation.x = 0.35;
  return group;
}

// 8. Cartoon Hanging Garland with Tropical Flowers and Bunting Flags
export function createCartoonGarland(): THREE.Group {
  const group = new THREE.Group();

  // Gentle curved garland rope
  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.2, 0.2, 0),
    new THREE.Vector3(-2.1, -0.25, 0.1),
    new THREE.Vector3(0, -0.38, 0.15),
    new THREE.Vector3(2.1, -0.25, 0.1),
    new THREE.Vector3(4.2, 0.2, 0),
  ]);

  const ropeGeom = new THREE.TubeGeometry(ropeCurve, 32, 0.02, 6, false);
  const ropeMat = new THREE.MeshBasicMaterial({ color: 0x86EFAC }); // Pastel vine green
  const rope = new THREE.Mesh(ropeGeom, ropeMat);
  group.add(rope);

  // Bunting triangle flags
  const flagColors = [0xF472B6, 0x38BDF8, 0xFBBF24, 0x34D399, 0xA78BFA, 0xFB7185];
  for (let f = 0; f < 18; f++) {
    const t = (f + 0.5) / 18;
    const pt = ropeCurve.getPoint(t);

    const flagGeom = new THREE.ConeGeometry(0.14, 0.28, 3);
    const flagMat = new THREE.MeshStandardMaterial({
      color: flagColors[f % flagColors.length],
      roughness: 0.4,
    });
    const flag = new THREE.Mesh(flagGeom, flagMat);
    flag.position.set(pt.x, pt.y - 0.14, pt.z);
    flag.rotation.z = Math.PI;
    group.add(flag);
  }

  // Hibiscus blossoms at intervals
  const flowerColors = [0xFB7185, 0xF43F5E, 0xFBBF24, 0xEC4899];
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const pt = ropeCurve.getPoint(t);

    const flower = new THREE.Group();
    flower.position.set(pt.x, pt.y, pt.z + 0.05);

    // 5 Petals
    const pMat = new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length], roughness: 0.3 });
    for (let p = 0; p < 5; p++) {
      const angle = (p / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), pMat);
      petal.scale.set(1, 1.4, 0.3);
      petal.position.set(Math.cos(angle) * 0.09, Math.sin(angle) * 0.09, 0);
      flower.add(petal);
    }
    // Center Stamen
    const center = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8),
      new THREE.MeshBasicMaterial({ color: 0xFDE047 })
    );
    center.rotation.x = Math.PI / 2;
    center.position.z = 0.06;
    flower.add(center);

    group.add(flower);
  }

  return group;
}

// 9. Cartoon Service Counter with rounded pill edges and pastel panels
export function createCartoonCounter(): THREE.Group {
  const counterGroup = new THREE.Group();

  const width = 7.4;
  const depth = 1.35;
  const height = 0.85;

  // 1. Counter Body - Mint Green base with Candy Pink & Ivory accents
  const bodyGeom = new THREE.BoxGeometry(width, height, depth);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xCCFBF1, // Fresh pastel mint
    roughness: 0.35,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(0, height / 2 - 0.3, 0.45);
  body.castShadow = true;
  body.receiveShadow = true;
  counterGroup.add(body);

  // 2. Decorative Front Wainscoting Panels (Pink & Cream stripes)
  const panelCount = 7;
  const panelWidth = (width - 0.8) / panelCount;
  for (let p = 0; p < panelCount; p++) {
    const px = -width / 2 + 0.6 + p * panelWidth + panelWidth / 2;
    const panelGeom = new THREE.BoxGeometry(panelWidth * 0.86, height * 0.68, 0.04);
    const panelMat = new THREE.MeshStandardMaterial({
      color: p % 2 === 0 ? 0xFCE7F3 : 0xFFFBEB, // alternating soft pink / cream
      roughness: 0.3,
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.position.set(px, height / 2 - 0.3, 0.45 + depth / 2 + 0.02);
    counterGroup.add(panel);
  }

  // 3. Countertop - Warm Polished Honey Maple Wood with rounded beveled edge
  const woodTex = createCartoonWoodTexture();
  woodTex.repeat.set(3, 1);
  const topGeom = new THREE.BoxGeometry(width + 0.25, 0.1, depth + 0.2);
  const topMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0xFFFBEB,
    roughness: 0.25,
    metalness: 0.05,
  });
  const topMesh = new THREE.Mesh(topGeom, topMat);
  topMesh.position.set(0, height - 0.3, 0.45);
  topMesh.receiveShadow = true;
  counterGroup.add(topMesh);

  // Edge trim (Baby pink accent rail)
  const trimGeom = new THREE.BoxGeometry(width + 0.28, 0.05, depth + 0.24);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xF472B6, roughness: 0.3 });
  const trim = new THREE.Mesh(trimGeom, trimMat);
  trim.position.set(0, height - 0.33, 0.45);
  counterGroup.add(trim);

  return counterGroup;
}

// 10. Golden Service Bell with interactive metadata
export function createGoldenServiceBell(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'service_bell';
  group.userData = { action: 'serve', label: 'Serve Order!' };

  // Base Pedestal
  const baseGeom = new THREE.CylinderGeometry(0.24, 0.26, 0.06, 20);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.03;
  base.userData = { action: 'serve' };
  group.add(base);

  // Shiny Golden Bell Dome
  const domeGeom = new THREE.SphereGeometry(0.22, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xFBBF24,
    metalness: 0.85,
    roughness: 0.15,
  });
  const dome = new THREE.Mesh(domeGeom, goldMat);
  dome.position.y = 0.06;
  dome.castShadow = true;
  dome.userData = { action: 'serve' };
  group.add(dome);

  // Top Stem and Plunger Button
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 12), goldMat);
  stem.position.y = 0.26;
  stem.userData = { action: 'serve' };
  group.add(stem);

  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), baseMat);
  button.position.y = 0.32;
  button.userData = { action: 'serve' };
  group.add(button);

  // Cute Little Sparkle indicator
  const sparkle = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.05, 0),
    new THREE.MeshBasicMaterial({ color: 0xFEF08A })
  );
  sparkle.position.set(0.18, 0.26, 0.1);
  group.add(sparkle);

  return group;
}

// 11. 6 Cartoon Ice Cream Flavor Tubs with 3D interactive tags
export function createCartoonFlavorWells(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'flavor_wells';

  // 6 flavors in 2 rows of 3
  const flavorsList: Array<{ id: FlavorId; x: number; z: number }> = [
    { id: 'vanilla',    x: -0.48, z: -0.18 },
    { id: 'strawberry', x: 0.0,   z: -0.18 },
    { id: 'chocolate',  x: 0.48,  z: -0.18 },
    { id: 'mint',       x: -0.48, z: 0.22 },
    { id: 'mango',      x: 0.0,   z: 0.22 },
    { id: 'blueberry',  x: 0.48,  z: 0.22 },
  ];

  // Well tray housing
  const trayGeom = new THREE.BoxGeometry(1.65, 0.08, 0.95);
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0, // Chrome stainless tray
    metalness: 0.7,
    roughness: 0.2,
  });
  const tray = new THREE.Mesh(trayGeom, trayMat);
  tray.position.y = 0.02;
  group.add(tray);

  flavorsList.forEach(item => {
    const flvInfo = FLAVORS.find(f => f.id === item.id);
    const flvColor = flvInfo ? flvInfo.color : '#FFFFFF';

    const tubGroup = new THREE.Group();
    tubGroup.name = `flavor_${item.id}`;
    tubGroup.userData = { action: 'scoop', flavorId: item.id, label: flvInfo?.name };
    tubGroup.position.set(item.x, 0, item.z);

    // Cylindrical Stainless Tub Rim
    const rimGeom = new THREE.TorusGeometry(0.2, 0.035, 12, 24);
    const rim = new THREE.Mesh(rimGeom, trayMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.06;
    rim.userData = { action: 'scoop', flavorId: item.id };
    tubGroup.add(rim);

    // Big creamy rounded ice cream mound
    const creamGeom = new THREE.SphereGeometry(0.19, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const creamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(flvColor),
      roughness: 0.35,
    });
    const cream = new THREE.Mesh(creamGeom, creamMat);
    cream.position.y = 0.04;
    cream.userData = { action: 'scoop', flavorId: item.id };
    tubGroup.add(cream);

    // Swirl folds
    for (let s = 0; s < 4; s++) {
      const swirl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), creamMat);
      const ang = (s / 4) * Math.PI * 2;
      swirl.position.set(Math.cos(ang) * 0.1, 0.12, Math.sin(ang) * 0.1);
      swirl.userData = { action: 'scoop', flavorId: item.id };
      tubGroup.add(swirl);
    }

    // Mini Silver Scoop Spoon resting in tub
    const spoonHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8),
      trayMat
    );
    spoonHandle.position.set(0.08, 0.16, 0.06);
    spoonHandle.rotation.set(0.4, 0, -0.4);
    spoonHandle.userData = { action: 'scoop', flavorId: item.id };
    tubGroup.add(spoonHandle);

    group.add(tubGroup);
  });

  return group;
}

// 12. Cartoon Banana Milkshake Machine with cute animated blender jar
export function createCartoonBananaMachine(): THREE.Group {
  const machine = new THREE.Group();
  machine.name = 'banana_machine';
  machine.userData = { action: 'blend', label: 'Blend Banana Milkshake!' };

  const bananaYellow = 0xFDE047;
  const yellowMat = new THREE.MeshStandardMaterial({ color: bananaYellow, roughness: 0.3 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8, roughness: 0.2 });

  // 1. Heavy Base
  const baseGeom = new THREE.CylinderGeometry(0.36, 0.42, 0.25, 24);
  const base = new THREE.Mesh(baseGeom, yellowMat);
  base.position.y = 0.125;
  base.userData = { action: 'blend' };
  machine.add(base);

  // Chrome drip tray
  const dripTray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 20), chromeMat);
  dripTray.position.set(0.12, 0.03, 0.22);
  dripTray.userData = { action: 'blend' };
  machine.add(dripTray);

  // 2. Curved Banana Machine Body Rising Up
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(-0.05, 0.6, -0.05),
    new THREE.Vector3(0.05, 1.05, -0.02),
    new THREE.Vector3(0.14, 1.35, 0.08),
  ]);
  const spineGeom = new THREE.TubeGeometry(curve, 16, 0.18, 16, false);
  const spine = new THREE.Mesh(spineGeom, yellowMat);
  spine.castShadow = true;
  spine.userData = { action: 'blend' };
  machine.add(spine);

  // Cute Cartoon Banana Tip at the top
  const bananaTip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 14), yellowMat);
  bananaTip.position.set(0.16, 1.48, 0.1);
  bananaTip.rotation.z = -0.3;
  bananaTip.userData = { action: 'blend' };
  machine.add(bananaTip);

  // Brown banana stem tip
  const stemTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.05, 0.08, 10),
    new THREE.MeshBasicMaterial({ color: 0x78350F })
  );
  stemTip.position.set(0.22, 1.62, 0.12);
  machine.add(stemTip);

  // 3. Chrome Motor Head
  const motorGeom = new THREE.CylinderGeometry(0.22, 0.24, 0.35, 20);
  const motor = new THREE.Mesh(motorGeom, chromeMat);
  motor.position.set(0.14, 1.15, 0.12);
  motor.userData = { action: 'blend' };
  machine.add(motor);

  // 4. Clear Glass Blender Pitcher
  const pitcherGeom = new THREE.CylinderGeometry(0.22, 0.16, 0.68, 20);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xBAE6FD,
    transparent: true,
    opacity: 0.5,
    transmission: 0.85,
    roughness: 0.1,
  });
  const pitcher = new THREE.Mesh(pitcherGeom, glassMat);
  pitcher.position.set(0.14, 0.62, 0.14);
  pitcher.userData = { action: 'blend' };
  machine.add(pitcher);

  // Blended liquid inside pitcher
  const shakeLiquidGeom = new THREE.CylinderGeometry(0.2, 0.15, 0.54, 18);
  const shakeLiquidMat = new THREE.MeshStandardMaterial({
    color: 0xFEF08A, // Sunny banana shake
    roughness: 0.3,
  });
  const shakeLiquid = new THREE.Mesh(shakeLiquidGeom, shakeLiquidMat);
  shakeLiquid.position.set(0.14, 0.56, 0.14);
  shakeLiquid.userData = { action: 'blend' };
  machine.add(shakeLiquid);

  // Pitcher Handle
  const handleGeom = new THREE.TorusGeometry(0.18, 0.035, 10, 16, Math.PI);
  const handle = new THREE.Mesh(handleGeom, yellowMat);
  handle.position.set(0.38, 0.65, 0.14);
  handle.rotation.y = Math.PI / 2;
  machine.add(handle);

  // 5. Cute Banana Mascot Eyes on Machine Body
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0F172A });
  const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyeMat);
  leftEye.position.set(-0.02, 0.85, 0.16);
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), eyeWhite);
  leftPupil.position.set(-0.01, 0.86, 0.19);

  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyeMat);
  rightEye.position.set(0.08, 0.85, 0.16);
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), eyeWhite);
  rightPupil.position.set(0.09, 0.86, 0.19);

  machine.add(leftEye, leftPupil, rightEye, rightPupil);

  // Smiling mouth
  const smileGeom = new THREE.TorusGeometry(0.05, 0.012, 8, 16, Math.PI * 0.8);
  const smile = new THREE.Mesh(smileGeom, eyeMat);
  smile.rotation.z = Math.PI * 1.1;
  smile.position.set(0.03, 0.76, 0.17);
  machine.add(smile);

  return machine;
}

// 13. Container Dispenser Stacks (Cones and Cups)
export function createContainerDispenser(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'container_dispenser';

  // Base stand
  const baseGeom = new THREE.BoxGeometry(0.55, 0.06, 0.55);
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.8, roughness: 0.2 });
  const base = new THREE.Mesh(baseGeom, chromeMat);
  base.position.y = 0.03;
  group.add(base);

  // Stack of Waffle Cones
  const coneGroup = new THREE.Group();
  coneGroup.name = 'cone_stack';
  coneGroup.userData = { action: 'container', container: 'waffle_cone', label: 'Waffle Cones' };
  coneGroup.position.set(-0.14, 0, 0);

  const waffleMat = new THREE.MeshStandardMaterial({
    map: createCartoonWaffleTexture(),
    roughness: 0.45,
  });

  for (let c = 0; c < 4; c++) {
    const coneGeom = new THREE.ConeGeometry(0.18, 0.45, 18, 1, true);
    const cone = new THREE.Mesh(coneGeom, waffleMat);
    cone.rotation.x = Math.PI;
    cone.position.y = 0.32 + c * 0.12;
    cone.userData = { action: 'container', container: 'waffle_cone' };
    coneGroup.add(cone);
  }
  group.add(coneGroup);

  // Stack of Pastel Cups
  const cupGroup = new THREE.Group();
  cupGroup.name = 'cup_stack';
  cupGroup.userData = { action: 'container', container: 'cup', label: 'Pastel Cups' };
  cupGroup.position.set(0.14, 0, 0);

  const cupMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3 });
  for (let u = 0; u < 4; u++) {
    const cupGeom = new THREE.CylinderGeometry(0.18, 0.13, 0.22, 18);
    const cup = new THREE.Mesh(cupGeom, cupMat);
    cup.position.y = 0.18 + u * 0.09;
    cup.userData = { action: 'container', container: 'cup' };
    cupGroup.add(cup);
  }
  group.add(cupGroup);

  return group;
}

// 14. Toppings Station (Syrup Bottles & Glass Bowls)
export function createCartoonToppingsStation(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'toppings_station';

  // 1. Syrup Bottles (Chocolate & Strawberry)
  const syrups = [
    { id: 'chocolate_sauce', color: 0x451A03, name: 'Choco Syrup', x: -0.32 },
    { id: 'strawberry_syrup', color: 0xE11D48, name: 'Berry Syrup', x: 0.0 },
  ];

  syrups.forEach(s => {
    const bottle = new THREE.Group();
    bottle.name = `topping_${s.id}`;
    bottle.userData = { action: 'topping', toppingId: s.id, label: s.name };
    bottle.position.set(s.x, 0, -0.2);

    const bodyGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.44, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.24;
    body.userData = { action: 'topping', toppingId: s.id };
    bottle.add(body);

    const capGeom = new THREE.ConeGeometry(0.11, 0.16, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeom, capMat);
    cap.position.y = 0.54;
    cap.userData = { action: 'topping', toppingId: s.id };
    bottle.add(cap);

    group.add(bottle);
  });

  // 2. Topping Bowls (Cherries, Sprinkles, Whipped Cream)
  // Cherries Bowl
  const cherryBowl = createMiniBowl(0xEF4444, 'cherry');
  cherryBowl.position.set(-0.32, 0, 0.2);
  group.add(cherryBowl);

  // Sprinkles Bowl
  const sprinkleBowl = createMiniBowl(0xFBBF24, 'sprinkles');
  sprinkleBowl.position.set(0.0, 0, 0.2);
  group.add(sprinkleBowl);

  // Whipped Cream Jar
  const creamBowl = createMiniBowl(0xFFFFFF, 'whipped_cream');
  creamBowl.position.set(0.32, 0, 0.0);
  group.add(creamBowl);

  return group;
}

function createMiniBowl(contentColor: number, toppingId: ToppingId): THREE.Group {
  const bowlGroup = new THREE.Group();
  bowlGroup.name = `topping_${toppingId}`;
  bowlGroup.userData = { action: 'topping', toppingId, label: toppingId };

  // Glass Bowl
  const bowlGeom = new THREE.CylinderGeometry(0.18, 0.12, 0.16, 16);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xBAE6FD,
    transparent: true,
    opacity: 0.6,
    transmission: 0.8,
    roughness: 0.1,
  });
  const bowl = new THREE.Mesh(bowlGeom, glassMat);
  bowl.position.y = 0.08;
  bowl.userData = { action: 'topping', toppingId };
  bowlGroup.add(bowl);

  // Content Mound
  const moundGeom = new THREE.SphereGeometry(0.14, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const moundMat = new THREE.MeshStandardMaterial({ color: contentColor, roughness: 0.3 });
  const mound = new THREE.Mesh(moundGeom, moundMat);
  mound.position.y = 0.1;
  mound.userData = { action: 'topping', toppingId };
  bowlGroup.add(mound);

  if (toppingId === 'cherry') {
    const miniCherry = createCherryMesh();
    miniCherry.scale.set(0.6, 0.6, 0.6);
    miniCherry.position.set(0, 0.18, 0);
    bowlGroup.add(miniCherry);
  } else if (toppingId === 'whipped_cream') {
    const miniCream = createWhippedCreamMesh();
    miniCream.scale.set(0.5, 0.5, 0.5);
    miniCream.position.set(0, 0.14, 0);
    bowlGroup.add(miniCream);
  }

  return bowlGroup;
}

// 15. Cheerful Cartoon Blue Recycling / Trash Bin
export function createCartoonTrashBin(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'trash_bin';
  group.userData = { action: 'trash', label: 'Trash / Clear Tray' };

  // Cylindrical blue body with slight taper
  const binGeom = new THREE.CylinderGeometry(0.38, 0.32, 0.78, 24);
  const binMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8, // Bright cartoon sky blue
    roughness: 0.35,
  });
  const bin = new THREE.Mesh(binGeom, binMat);
  bin.position.y = 0.39;
  bin.userData = { action: 'trash' };
  group.add(bin);

  // Dark grey swing-flap lid
  const rimGeom = new THREE.TorusGeometry(0.39, 0.035, 12, 24);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3 });
  const rim = new THREE.Mesh(rimGeom, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.78;
  rim.userData = { action: 'trash' };
  group.add(rim);

  const flapGeom = new THREE.CylinderGeometry(0.36, 0.36, 0.03, 20);
  const flap = new THREE.Mesh(flapGeom, rimMat);
  flap.position.set(0, 0.76, 0);
  flap.rotation.x = 0.3; // slightly ajar
  flap.userData = { action: 'trash' };
  group.add(flap);

  // White Recycling Decal on front
  const iconMat = new THREE.MeshBasicMaterial({
    map: createTrashIconTexture(),
    transparent: true,
  });
  const iconMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), iconMat);
  iconMesh.position.set(0, 0.42, 0.37);
  iconMesh.userData = { action: 'trash' };
  group.add(iconMesh);

  return group;
}

// 16. Cartoon Tropical Beach Background with Puffy 3D Clouds & Palm Trees
export function createCartoonStoreBackground(): THREE.Group {
  const bgRoot = new THREE.Group();

  // Sky Backdrop Plane
  const skyGeom = new THREE.PlaneGeometry(36, 18);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 256;
  skyCanvas.height = 256;
  const ctx = skyCanvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#38BDF8'); // Vibrant sky blue
  grad.addColorStop(0.6, '#BAE6FD'); // Soft pastel horizon
  grad.addColorStop(1, '#86EFAC'); // Sunny tropical greens
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex });
  const sky = new THREE.Mesh(skyGeom, skyMat);
  sky.position.set(0, 5, -8);
  bgRoot.add(sky);

  // Puffy 3D Cartoon Clouds
  const cloudPositions = [
    { x: -7, y: 5.8, z: -6.5, scale: 1.1 },
    { x: -1, y: 6.5, z: -7.0, scale: 1.4 },
    { x: 6,  y: 5.6, z: -6.2, scale: 1.0 },
  ];

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.15,
  });

  cloudPositions.forEach(cp => {
    const cloud = new THREE.Group();
    cloud.position.set(cp.x, cp.y, cp.z);
    cloud.scale.set(cp.scale, cp.scale * 0.7, cp.scale * 0.8);

    // 5 overlapping spheres
    const parts = [
      { x: 0, y: 0, z: 0, r: 0.75 },
      { x: -0.6, y: -0.15, z: 0, r: 0.55 },
      { x: 0.6, y: -0.15, z: 0, r: 0.55 },
      { x: -0.3, y: 0.25, z: 0, r: 0.52 },
      { x: 0.3, y: 0.22, z: 0, r: 0.48 },
    ];
    parts.forEach(p => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 14, 14), cloudMat);
      puff.position.set(p.x, p.y, p.z);
      cloud.add(puff);
    });
    bgRoot.add(cloud);
  });

  // Stylized Cartoon Palm Trees on left and right
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0xA16207, roughness: 0.6 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.4 });

  [-6.2, 6.2].forEach(tx => {
    const palm = new THREE.Group();
    palm.position.set(tx, 0, -5.5);

    // Curved Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.18, 0.28, 6.5, 12);
    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 3.25;
    trunk.rotation.z = tx < 0 ? -0.12 : 0.12;
    palm.add(trunk);

    // Palm Fronds Crown
    for (let f = 0; f < 7; f++) {
      const ang = (f / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.2, 8), leafMat);
      frond.scale.set(1, 1, 0.3);
      frond.position.set(Math.cos(ang) * 0.9, 6.2, Math.sin(ang) * 0.9);
      frond.rotation.set(Math.cos(ang) * 0.8, ang, Math.sin(ang) * 0.8);
      palm.add(frond);
    }
    bgRoot.add(palm);
  });

  return bgRoot;
}
