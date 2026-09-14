import * as THREE from 'three';

// 1. Wood Grain Texture Helper
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5E6D3'; // warm maple base
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#E6D0B8';
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.sin(y * 0.05) * 2));
    ctx.bezierCurveTo(80, y + Math.sin(y * 0.08) * 6, 180, y - Math.sin(y * 0.08) * 6, 256, y);
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

  ctx.fillStyle = '#2563EB'; // Blue bin color
  ctx.fillRect(0, 0, 128, 128);

  // White figure disposing trash (international symbol)
  ctx.fillStyle = '#FFFFFF';
  // Head
  ctx.beginPath();
  ctx.arc(64, 28, 10, 0, Math.PI * 2);
  ctx.fill();
  // Body torso
  ctx.fillRect(58, 42, 12, 34);
  // Legs
  ctx.fillRect(52, 76, 10, 36);
  ctx.fillRect(66, 76, 10, 36);
  // Arm reaching to bin
  ctx.beginPath();
  ctx.moveTo(70, 46);
  ctx.lineTo(88, 58);
  ctx.lineTo(84, 68);
  ctx.lineTo(70, 56);
  ctx.fill();
  // Mini bin
  ctx.fillRect(92, 60, 18, 28);
  // Falling paper
  ctx.fillRect(86, 52, 4, 4);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Waffle Cone Texture
export function createRealisticWaffleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E8A338'; // Baked waffle
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#BA7518';
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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  return texture;
}

// 4. Create Realistic Banana Milkshake Machine (Yellow Banana Body with Black Funnel Hopper)
export function createRealisticBananaMachine(): THREE.Group {
  const group = new THREE.Group();

  // Shiny Metallic Base
  const baseGeom = new THREE.CylinderGeometry(0.48, 0.54, 0.16, 24);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.25,
    metalness: 0.8,
  });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.08;
  group.add(base);

  // Banana Shaped Yellow Body (Curved tapered cylinder)
  const bodyGeom = new THREE.CylinderGeometry(0.34, 0.42, 1.4, 24);
  bodyGeom.scale(1.0, 1.0, 0.85);
  const bananaYellowMat = new THREE.MeshStandardMaterial({
    color: 0xFACC15, // Vibrant Banana Yellow
    roughness: 0.2,
    metalness: 0.05,
  });
  const body = new THREE.Mesh(bodyGeom, bananaYellowMat);
  body.position.set(0, 0.82, -0.05);
  body.rotation.x = -0.08; // subtle curve
  group.add(body);

  // Black Funnel Hopper at top (exact match to game.jpeg!)
  const funnelGeom = new THREE.CylinderGeometry(0.48, 0.28, 0.45, 24, 1, true);
  const funnelMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B, // Matte Charcoal Black
    roughness: 0.4,
    metalness: 0.3,
    side: THREE.DoubleSide,
  });
  const funnel = new THREE.Mesh(funnelGeom, funnelMat);
  funnel.position.set(0, 1.62, -0.1);
  group.add(funnel);

  // Glowing Blue Activation Button (as in game.jpeg!)
  const buttonGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.04, 20);
  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8, // Electric cyan/blue
    emissive: 0x0284C7,
    emissiveIntensity: 0.6,
    roughness: 0.1,
  });
  const button = new THREE.Mesh(buttonGeom, buttonMat);
  button.rotation.x = Math.PI / 2;
  button.position.set(0, 0.88, 0.32);
  group.add(button);

  // Blender Glass Bowl / Pitcher attached below hopper
  const pitcherGeom = new THREE.CylinderGeometry(0.3, 0.24, 0.55, 20);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.6,
    transmission: 0.85,
    roughness: 0.1,
  });
  const pitcher = new THREE.Mesh(pitcherGeom, glassMat);
  pitcher.position.set(0, 0.45, 0.14);
  group.add(pitcher);

  // Internal blending blades
  const bladeGeom = new THREE.BoxGeometry(0.18, 0.03, 0.03);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.9, roughness: 0.1 });
  const blade1 = new THREE.Mesh(bladeGeom, bladeMat);
  const blade2 = blade1.clone();
  blade2.rotation.y = Math.PI / 2;
  pitcher.add(blade1, blade2);

  // Serving plate with ready banana (exact match to game.jpeg!)
  const plateGeom = new THREE.CylinderGeometry(0.42, 0.4, 0.05, 20);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xBAE6FD, roughness: 0.2 });
  const plate = new THREE.Mesh(plateGeom, plateMat);
  plate.position.set(0, 0.03, 0.6);
  group.add(plate);

  // Fresh curved yellow banana on plate
  const bananaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 0.06, 0.55),
    new THREE.Vector3(-0.08, 0.14, 0.64),
    new THREE.Vector3(0.12, 0.14, 0.62),
    new THREE.Vector3(0.26, 0.06, 0.55),
  ]);
  const bananaGeom = new THREE.TubeGeometry(bananaCurve, 16, 0.065, 8, false);
  const bananaMesh = new THREE.Mesh(bananaGeom, new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.3 }));
  group.add(bananaMesh);

  return group;
}

// 5. Create Squeeze Bottles in Stainless Steel Caddy (Blue, Caramel, Chocolate)
export function createSyrupBottlesRack(): THREE.Group {
  const group = new THREE.Group();

  // Stainless Steel Rack Base
  const rackGeom = new THREE.BoxGeometry(1.2, 0.08, 0.45);
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    metalness: 0.9,
    roughness: 0.15,
  });
  const rack = new THREE.Mesh(rackGeom, chromeMat);
  rack.position.y = 0.04;
  group.add(rack);

  // 3 Squeeze Bottles: Blue, Gold/Caramel, Chocolate
  const bottleConfigs = [
    { x: -0.36, color: 0x2563EB, name: 'blue_syrup' },    // Berry Blue
    { x: 0.0, color: 0xD97706, name: 'caramel_syrup' },   // Butterscotch
    { x: 0.36, color: 0x54230D, name: 'choco_syrup' },    // Dark Chocolate
  ];

  bottleConfigs.forEach(cfg => {
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(cfg.x, 0, 0);

    // Main Cylindrical Squeeze Body
    const bodyGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.58, 18);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: 0.35,
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.33;
    bottleGroup.add(body);

    // Translucent bottle shoulder / neck
    const shoulderGeom = new THREE.ConeGeometry(0.13, 0.14, 18, 1, true);
    const whitePlasticMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.3 });
    const shoulder = new THREE.Mesh(shoulderGeom, whitePlasticMat);
    shoulder.position.y = 0.69;
    bottleGroup.add(shoulder);

    // Tip Nozzle Cap
    const nozzleGeom = new THREE.CylinderGeometry(0.02, 0.04, 0.15, 12);
    const nozzle = new THREE.Mesh(nozzleGeom, whitePlasticMat);
    nozzle.position.y = 0.82;
    bottleGroup.add(nozzle);

    // Cute Label Band
    const labelGeom = new THREE.CylinderGeometry(0.132, 0.132, 0.22, 18);
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.4 });
    const label = new THREE.Mesh(labelGeom, labelMat);
    label.position.y = 0.33;
    bottleGroup.add(label);

    group.add(bottleGroup);
  });

  return group;
}

// 6. Create Glass Topping Bowls (Cherries, Brownies, Peanuts, Sprinkles)
export function createToppingBowls(): THREE.Group {
  const group = new THREE.Group();

  // Bowl 1: Maraschino Cherries in Green Bowl (Top left)
  const cherryBowl = createSingleBowl(0x34D399, 'cherries');
  cherryBowl.position.set(-0.35, 0, -0.32);
  group.add(cherryBowl);

  // Bowl 2: Chocolate Brownie Chunks in Purple Bowl (Top right)
  const brownieBowl = createSingleBowl(0xA855F7, 'brownies');
  brownieBowl.position.set(0.35, 0, -0.32);
  group.add(brownieBowl);

  // Bowl 3: Golden Waffle / Peanut bits in Blue Bowl (Bottom left)
  const peanutBowl = createSingleBowl(0x38BDF8, 'peanuts');
  peanutBowl.position.set(-0.35, 0, 0.25);
  group.add(peanutBowl);

  // Bowl 4: Rainbow Sprinkles in Turquoise/Petal Bowl (Bottom right)
  const sprinkleBowl = createSingleBowl(0x2DD4BF, 'sprinkles');
  sprinkleBowl.position.set(0.35, 0, 0.25);
  group.add(sprinkleBowl);

  return group;
}

function createSingleBowl(bowlColor: number, content: 'cherries' | 'brownies' | 'peanuts' | 'sprinkles'): THREE.Group {
  const bowlGroup = new THREE.Group();

  // Glass/Ceramic Bowl
  const bowlGeom = new THREE.SphereGeometry(0.28, 20, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bowlMat = new THREE.MeshPhysicalMaterial({
    color: bowlColor,
    roughness: 0.1,
    transmission: 0.4,
    transparent: true,
    opacity: 0.85,
  });
  const bowl = new THREE.Mesh(bowlGeom, bowlMat);
  bowl.position.y = 0.26;
  bowlGroup.add(bowl);

  // Content inside bowl
  if (content === 'cherries') {
    // Red glossy cherries with green stems
    const cherryMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.1, metalness: 0.2 });
    const stemMat = new THREE.MeshBasicMaterial({ color: 0x15803D });
    for (let c = 0; c < 7; c++) {
      const angle = (c / 7) * Math.PI * 2;
      const r = c === 0 ? 0 : 0.14;
      const ch = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), cherryMat);
      ch.position.set(Math.cos(angle) * r, 0.18 + Math.random() * 0.05, Math.sin(angle) * r);
      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.14, 6), stemMat);
      stem.position.set(0, 0.09, 0);
      stem.rotation.z = 0.3;
      ch.add(stem);
      bowlGroup.add(ch);
    }
  } else if (content === 'brownies') {
    // Chocolate brownie cubes
    const brownieMat = new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.8 });
    for (let b = 0; b < 8; b++) {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.09), brownieMat);
      cube.position.set((Math.random() - 0.5) * 0.28, 0.16 + Math.random() * 0.06, (Math.random() - 0.5) * 0.28);
      cube.rotation.set(Math.random(), Math.random(), Math.random());
      bowlGroup.add(cube);
    }
  } else if (content === 'peanuts') {
    // Golden crunch bits
    const peanutMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.5 });
    for (let p = 0; p < 16; p++) {
      const bit = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045, 0), peanutMat);
      bit.position.set((Math.random() - 0.5) * 0.32, 0.14 + Math.random() * 0.08, (Math.random() - 0.5) * 0.32);
      bowlGroup.add(bit);
    }
  } else {
    // Rainbow sprinkles
    const sprinkleColors = [0xEF4444, 0xFACC15, 0x3B82F6, 0x10B981, 0xEC4899, 0xFFFFFF];
    for (let s = 0; s < 30; s++) {
      const color = sprinkleColors[s % sprinkleColors.length];
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 6), new THREE.MeshBasicMaterial({ color }));
      sp.position.set((Math.random() - 0.5) * 0.34, 0.15 + Math.random() * 0.07, (Math.random() - 0.5) * 0.34);
      sp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      bowlGroup.add(sp);
    }
  }

  return bowlGroup;
}

// 7. Create Embedded Stainless Steel Flavor Wells
export function createFlavorWells(): THREE.Group {
  const group = new THREE.Group();

  // Stainless Steel Rim Tray Frame
  const frameGeom = new THREE.BoxGeometry(2.3, 0.06, 1.4);
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xCBD5E1,
    metalness: 0.85,
    roughness: 0.2,
  });
  const frame = new THREE.Mesh(frameGeom, steelMat);
  frame.position.y = 0.03;
  group.add(frame);

  // 4 Main Flavor Pans (2x2 grid, matching game.jpeg!)
  const panConfigs = [
    { x: -0.55, z: -0.34, color: 0xFDE047, name: 'Vanilla Bean' },
    { x: 0.55, z: -0.34, color: 0x54230D, name: 'Chocolate Fudge' },
    { x: -0.55, z: 0.34, color: 0x6EE7B7, name: 'Mint Chip' },
    { x: 0.55, z: 0.34, color: 0xF472B6, name: 'Strawberry Swirl' },
  ];

  panConfigs.forEach(pan => {
    // Recessed pan box
    const panBoxGeom = new THREE.BoxGeometry(0.96, 0.12, 0.58);
    const panMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.9,
      roughness: 0.25,
    });
    const panBox = new THREE.Mesh(panBoxGeom, panMat);
    panBox.position.set(pan.x, 0.04, pan.z);
    group.add(panBox);

    // Sculpted Ice cream mound with ripple surface
    const iceCreamGeom = new THREE.CylinderGeometry(0.42, 0.44, 0.08, 18);
    const iceCreamMat = new THREE.MeshStandardMaterial({
      color: pan.color,
      roughness: 0.45,
      metalness: 0.02,
    });
    const iceMound = new THREE.Mesh(iceCreamGeom, iceCreamMat);
    iceMound.position.set(pan.x, 0.08, pan.z);
    group.add(iceMound);

    // Ripple wave swirls on top of ice cream
    const swirlGeom = new THREE.TorusGeometry(0.24, 0.04, 8, 16);
    const swirl = new THREE.Mesh(swirlGeom, iceCreamMat);
    swirl.rotation.x = Math.PI / 2;
    swirl.position.set(pan.x, 0.12, pan.z);
    group.add(swirl);
  });

  return group;
}

// 8. Create Under-Counter Shelving with Cone Dispenser, Banana Crate, & Blue Trash Bin
export function createUnderCounterDetails(): THREE.Group {
  const group = new THREE.Group();

  // Stacked Waffle Cones in Acrylic Holder
  const coneTowerGroup = new THREE.Group();
  coneTowerGroup.position.set(-1.8, 0.4, 0.3);

  const waffleTex = createRealisticWaffleTexture();
  const coneMat = new THREE.MeshStandardMaterial({ map: waffleTex, roughness: 0.5 });
  for (let c = 0; c < 5; c++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 16, 1, true), coneMat);
    cone.rotation.x = Math.PI;
    cone.position.y = c * 0.14;
    coneTowerGroup.add(cone);
  }
  group.add(coneTowerGroup);

  // Wooden Banana Crate
  const crateGroup = new THREE.Group();
  crateGroup.position.set(-0.5, 0.3, 0.4);
  const crateMat = new THREE.MeshStandardMaterial({ color: 0x93C5FD, roughness: 0.4 }); // Blue tub as in game.jpeg
  const crateBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.3, 0.55), crateMat);
  crateGroup.add(crateBox);

  // Bunches of Bananas inside crate
  const bananaYellowMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.3 });
  for (let b = 0; b < 6; b++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0, 0),
      new THREE.Vector3(0, 0.1, 0.06),
      new THREE.Vector3(0.25, 0, 0),
    ]);
    const bMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.05, 8, false), bananaYellowMat);
    bMesh.position.set((Math.random() - 0.5) * 0.3, 0.15 + (b % 2) * 0.06, (Math.random() - 0.5) * 0.18);
    bMesh.rotation.y = (b / 6) * Math.PI;
    crateGroup.add(bMesh);
  }
  group.add(crateGroup);

  // Iconic Blue Recycling/Trash Bin on Bottom Right (Exact match to game.jpeg!)
  const binGroup = new THREE.Group();
  binGroup.position.set(2.6, 0.35, 0.5);

  // Main Bin Body (Dark Blue with White Logo)
  const binBodyGeom = new THREE.BoxGeometry(0.82, 0.75, 0.65);
  const binMat = new THREE.MeshStandardMaterial({
    color: 0x1E40AF, // Deep Royal Blue
    roughness: 0.3,
  });
  const binBody = new THREE.Mesh(binBodyGeom, binMat);
  binGroup.add(binBody);

  // Front Disposal Symbol Sign
  const signGeom = new THREE.PlaneGeometry(0.26, 0.26);
  const signMat = new THREE.MeshBasicMaterial({
    map: createTrashIconTexture(),
    transparent: true,
  });
  const sign = new THREE.Mesh(signGeom, signMat);
  sign.position.set(0, 0.06, 0.33);
  binGroup.add(sign);

  // Bin Swing Flap Lid
  const flapLidGeom = new THREE.BoxGeometry(0.86, 0.18, 0.69);
  const flapMat = new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.2 });
  const flapLid = new THREE.Mesh(flapLidGeom, flapMat);
  flapLid.position.y = 0.42;
  binGroup.add(flapLid);

  group.add(binGroup);

  return group;
}

// 9. Create Hanging Tropical Floral Garland Framing Top of Screen (Exact match to game.jpeg!)
export function createTropicalFlowerGarland(): THREE.Group {
  const garlandGroup = new THREE.Group();

  // Green Vine Cable
  const vineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.2, 4.8, 0.2),
    new THREE.Vector3(-2.6, 4.4, 0.1),
    new THREE.Vector3(0, 4.6, 0.2),
    new THREE.Vector3(2.6, 4.4, 0.1),
    new THREE.Vector3(5.2, 4.8, 0.2),
  ]);
  const vineGeom = new THREE.TubeGeometry(vineCurve, 32, 0.05, 8, false);
  const vineMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.6 });
  const vine = new THREE.Mesh(vineGeom, vineMat);
  garlandGroup.add(vine);

  // Lush Leaves and Blooming Hibiscus Flowers draped across the arch
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.5, side: THREE.DoubleSide });
  const flowerPinkMat = new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.3 });
  const flowerWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.3 });
  const flowerYellowMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.3 });

  for (let i = 0; i < 28; i++) {
    const t = i / 27;
    const pt = vineCurve.getPoint(t);

    // Hanging Leaf
    const leafGeom = new THREE.PlaneGeometry(0.24, 0.38);
    const leaf = new THREE.Mesh(leafGeom, leafMat);
    leaf.position.set(pt.x + (Math.random() - 0.5) * 0.15, pt.y - 0.12, pt.z + (Math.random() - 0.5) * 0.15);
    leaf.rotation.set(0.4, 0, (Math.random() - 0.5) * 0.8);
    garlandGroup.add(leaf);

    // Hibiscus / Plumeria Blossom every few segments
    if (i % 3 === 0) {
      const flwGroup = new THREE.Group();
      flwGroup.position.set(pt.x, pt.y - 0.06, pt.z + 0.05);

      const mat = i % 6 === 0 ? flowerPinkMat : (i % 6 === 3 ? flowerWhiteMat : flowerYellowMat);
      for (let p = 0; p < 5; p++) {
        const ang = (p / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), mat);
        petal.scale.set(1, 1.4, 0.4);
        petal.position.set(Math.cos(ang) * 0.09, Math.sin(ang) * 0.09, 0);
        flwGroup.add(petal);
      }
      // Golden flower center
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xF59E0B }));
      flwGroup.add(center);

      garlandGroup.add(flwGroup);
    }
  }

  return garlandGroup;
}
