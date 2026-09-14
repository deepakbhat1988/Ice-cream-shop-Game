import * as THREE from 'three';
import { FlavorId, ToppingId, ContainerType } from '../types/game';
import { FLAVORS } from '../game/orderManager';
import { getRealisticFlavorTexture, createMiniStrawberryGarnish } from './realisticFlavorTextures';

// 1. Wood Floor / Counter Texture Generator
export function createPolishedWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm amber honey wood base
  ctx.fillStyle = '#D97706';
  ctx.fillRect(0, 0, 512, 512);

  // Planks
  const plankH = 64;
  for (let y = 0; y < 512; y += plankH) {
    ctx.fillStyle = y % 128 === 0 ? '#B45309' : '#D97706';
    ctx.fillRect(0, y, 512, plankH - 2);

    // Subtle grain lines
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.15)';
    ctx.lineWidth = 1.5;
    for (let g = 0; g < plankH; g += 6) {
      ctx.beginPath();
      ctx.moveTo(0, y + g);
      ctx.bezierCurveTo(150, y + g + Math.sin(g) * 4, 350, y + g - Math.sin(g) * 4, 512, y + g);
      ctx.stroke();
    }

    // Plank seam
    ctx.fillStyle = '#451A03';
    ctx.fillRect(0, y + plankH - 2, 512, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Checkerboard Cafe Tile Floor Texture
export function createCheckerboardFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const tileSize = 64;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#FEF3C7' : '#B45309'; // Warm cream & terracotta tile
      ctx.fillRect(x, y, tileSize, tileSize);

      // Grout line border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 4);
  return texture;
}

// 3. Chalkboard Menu Texture
export function createChalkboardMenuTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Blackboard
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 512, 256);

  // Border frame
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);

  // Chalk Title
  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍦 ICE CREAM PARLOR 🍨', 256, 46);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 58);
  ctx.lineTo(472, 58);
  ctx.stroke();

  // Menu items
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'left';

  ctx.fillText('WAFFLE CONES  -  $3.50', 50, 95);
  ctx.fillText('DELUXE SUNDAES -  $5.25', 50, 135);
  ctx.fillText('BANANA SHAKES -  $4.75', 50, 175);

  ctx.fillStyle = '#F472B6';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText('★ 6 Fresh Farm Churned Flavors Daily ★', 50, 220);

  // Cute chalk ice cream illustration
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(430, 130, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E8A338';
  ctx.beginPath();
  ctx.moveTo(406, 135);
  ctx.lineTo(454, 135);
  ctx.lineTo(430, 195);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Waffle Cone Texture
export function createWaffleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E8A338'; // Baked golden waffle
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

// 5. Trash Disposal Symbol Texture
export function createTrashDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2563EB'; // Royal blue
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(64, 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(58, 42, 12, 34);
  ctx.fillRect(52, 76, 10, 36);
  ctx.fillRect(66, 76, 10, 36);
  ctx.beginPath();
  ctx.moveTo(70, 46);
  ctx.lineTo(88, 58);
  ctx.lineTo(84, 68);
  ctx.lineTo(70, 56);
  ctx.fill();
  ctx.fillRect(92, 60, 18, 28);
  ctx.fillRect(86, 52, 4, 4);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds the complete 3D Store Architecture:
 * - 3D Floor with checkered cafe tiles receding into perspective
 * - 3D Back Wall with chalkboard menu, backbar shelving with bottles and cups
 * - 3D Left and Right Walls with sunlit cafe windows
 * - 3D Ceiling with exposed wooden beams and hanging brass pendant lamps
 * - 3D Tropical Awning & Hanging Garland
 */
export function createRealisticStoreRoom(): THREE.Group {
  const room = new THREE.Group();

  // 1. 3D Cafe Floor (Extending in front and behind counter)
  const floorTex = createCheckerboardFloorTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.35,
    metalness: 0.05,
  });
  const floorGeom = new THREE.PlaneGeometry(16, 16);
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  room.add(floor);

  // 2. Open-Air Panoramic Veranda & Terrace Back Wall
  // Opens wide to the magnificent panoramic hills overlooking the shop
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xFFFBEB, // Warm ivory cafe wall
    roughness: 0.8,
  });

  // Left and Right Back Wall Columns/Flanks (Leaving center open from -4.5 to +4.5 for panoramic view)
  [-6.2, 6.2].forEach(wx => {
    const flankGeom = new THREE.BoxGeometry(3.6, 6, 0.4);
    const flank = new THREE.Mesh(flankGeom, wallMat);
    flank.position.set(wx, 3, -4.2);
    flank.receiveShadow = true;
    room.add(flank);

    // Wainscoting panel
    const wainscot = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.8, 0.44),
      new THREE.MeshStandardMaterial({ color: 0x99F6E4, roughness: 0.5 })
    );
    wainscot.position.set(wx, 0.9, -4.18);
    room.add(wainscot);
  });

  // Top Overhead Entrance Beam bridging the opening
  const archGeom = new THREE.BoxGeometry(9.2, 0.6, 0.45);
  const archMesh = new THREE.Mesh(archGeom, wallMat);
  archMesh.position.set(0, 5.7, -4.2);
  room.add(archMesh);

  // Elegant Open Storefront Portal & Low Marble Threshold Step (Directly leads out to the bustling sidewalk & street)
  const thresholdMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.3 });
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.08, 0.45), thresholdMat);
  threshold.position.set(0, 0.04, -4.2);
  threshold.receiveShadow = true;
  room.add(threshold);

  // Modern Sleek Brass/Glass Entrance Mullions framing the side views
  const mullionMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.8, roughness: 0.2 });
  [-4.4, 4.4].forEach(px => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.6, 0.12), mullionMat);
    post.position.set(px, 2.8, -4.2);
    room.add(post);
  });

  // 3. 3D Chalkboard Menu Board on Left Wall Flank
  const menuTex = createChalkboardMenuTexture();
  const menuMat = new THREE.MeshStandardMaterial({ map: menuTex, roughness: 0.4 });
  const menuMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 0.06), menuMat);
  menuMesh.position.set(-5.8, 3.4, -3.98);
  menuMesh.castShadow = true;
  room.add(menuMesh);

  // 4. 3D Back Bar Floating Shelves on Right Wall Flank
  const shelfWoodMat = new THREE.MeshStandardMaterial({ color: 0xB45309, roughness: 0.35 });
  [2.8, 3.8].forEach(sy => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.45), shelfWoodMat);
    shelf.position.set(5.8, sy, -3.95);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    room.add(shelf);

    // Glass syrup bottles on shelf
    for (let b = 0; b < 3; b++) {
      const bottleColor = [0x54230D, 0xDC2626, 0xD97706][b % 3];
      const bottleGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.38, 14);
      const bottle = new THREE.Mesh(
        bottleGeom,
        new THREE.MeshPhysicalMaterial({ color: bottleColor, transmission: 0.7, opacity: 0.85, transparent: true, roughness: 0.1 })
      );
      bottle.position.set(5.8 - 0.7 + b * 0.65, sy + 0.23, -3.95);
      room.add(bottle);
    }
  });

  // 5. Left & Right Side Walls with Arched Cafe Windows
  [-1, 1].forEach(side => {
    const sideWallGeom = new THREE.BoxGeometry(0.4, 6, 16);
    const sideWall = new THREE.Mesh(sideWallGeom, wallMat);
    sideWall.position.set(side * 8, 3, 0);
    sideWall.receiveShadow = true;
    room.add(sideWall);

    // Arched Window Frame overlooking palm terrace
    const winFrameGeom = new THREE.BoxGeometry(0.44, 3.2, 3.6);
    const winFrameMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.3 });
    const winFrame = new THREE.Mesh(winFrameGeom, winFrameMat);
    winFrame.position.set(side * 7.95, 3.2, 0);
    room.add(winFrame);

    // Sunlit Glass Pane
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xBAE6FD,
      transmission: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.4,
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.0, 3.4), glassMat);
    glass.position.set(side * 7.95, 3.2, 0);
    room.add(glass);
  });

  // 6. 3D Ceiling with Wooden Beams
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.5 });
  for (let b = -4; b <= 4; b += 2.5) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 0.25), beamMat);
    beam.position.set(0, 5.85, b);
    room.add(beam);
  }

  // 7. Hanging Brass Pendant Lamps with Warm Ambient Point Lights
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.85, roughness: 0.2 });
  [-2.2, 2.2].forEach(lx => {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(lx, 4.4, 0.2);

    // Cord
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), new THREE.MeshBasicMaterial({ color: 0x1E293B }));
    cord.position.y = 0.7;
    lampGroup.add(cord);

    // Conical Brass Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.32, 20, 1, true), brassMat);
    lampGroup.add(shade);

    // Glowing Filament Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), new THREE.MeshBasicMaterial({ color: 0xFEF08A }));
    bulb.position.y = -0.06;
    lampGroup.add(bulb);

    // Localized Warm Light Pool
    const lampLight = new THREE.PointLight(0xFEF3C7, 1.6, 6);
    lampLight.position.y = -0.15;
    lampGroup.add(lampLight);

    room.add(lampGroup);
  });

  return room;
}

/**
 * Builds the 3D Service Counter with:
 * - Rounded maple countertop with depth and bevel
 * - Mint/cream front paneling
 * - Glass sneeze guard showcase over ice cream wells
 * - Center yellow prep mat
 */
export function createRealisticServiceCounter(): THREE.Group {
  const counterGroup = new THREE.Group();
  counterGroup.name = 'service_counter';

  const width = 8.4;
  const depth = 1.6;
  const height = 0.95;

  // Counter Base Body
  const baseGeom = new THREE.BoxGeometry(width, height, depth);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xCCFBF1, // Fresh vintage mint base
    roughness: 0.4,
  });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.set(0, height / 2, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  counterGroup.add(base);

  // Front Paneling Details
  const panelCount = 7;
  const panelW = (width - 0.8) / panelCount;
  for (let p = 0; p < panelCount; p++) {
    const px = -width / 2 + 0.5 + p * panelW + panelW / 2;
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(panelW * 0.86, height * 0.72, 0.05),
      new THREE.MeshStandardMaterial({ color: p % 2 === 0 ? 0xFCE7F3 : 0xFFFBEB, roughness: 0.3 })
    );
    panel.position.set(px, height / 2, depth / 2 + 0.025);
    counterGroup.add(panel);
  }

  // Polished Maple Countertop
  const woodTex = createPolishedWoodTexture();
  woodTex.repeat.set(4, 1);
  const topGeom = new THREE.BoxGeometry(width + 0.3, 0.12, depth + 0.25);
  const topMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.25,
    metalness: 0.05,
  });
  const topMesh = new THREE.Mesh(topGeom, topMat);
  topMesh.position.set(0, height + 0.06, 0);
  topMesh.receiveShadow = true;
  counterGroup.add(topMesh);

  // Beveled Edge Bullnose Trim
  const trimGeom = new THREE.BoxGeometry(width + 0.34, 0.05, depth + 0.29);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.3 });
  const trim = new THREE.Mesh(trimGeom, trimMat);
  trim.position.set(0, height + 0.03, 0);
  counterGroup.add(trim);

  return counterGroup;
}

/**
 * 6 Stainless Steel Flavor Wells with Realistic Scoopable Ice Cream Texture & Metal Scoops
 */
export function createRealisticFlavorWells(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'flavor_wells';

  const flavorsList: Array<{ id: FlavorId; x: number; z: number }> = [
    { id: 'vanilla',    x: -0.52, z: -0.22 },
    { id: 'strawberry', x: 0.0,   z: -0.22 },
    { id: 'chocolate',  x: 0.52,  z: -0.22 },
    { id: 'mint',       x: -0.52, z: 0.22 },
    { id: 'mango',      x: 0.0,   z: 0.22 },
    { id: 'blueberry',  x: 0.52,  z: 0.22 },
  ];

  // Stainless Tray Rim
  const trayGeom = new THREE.BoxGeometry(1.8, 0.08, 1.05);
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85, roughness: 0.2 });
  const tray = new THREE.Mesh(trayGeom, steelMat);
  tray.position.y = 0.04;
  group.add(tray);

  flavorsList.forEach(item => {
    const flvInfo = FLAVORS.find(f => f.id === item.id);
    const flvColor = flvInfo ? flvInfo.color : '#FFFFFF';

    const tubGroup = new THREE.Group();
    tubGroup.name = `flavor_${item.id}`;
    tubGroup.userData = { action: 'scoop', flavorId: item.id, label: flvInfo?.name };
    tubGroup.position.set(item.x, 0, item.z);

    // Sunken Stainless Tub
    const tubRim = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.035, 12, 24), steelMat);
    tubRim.rotation.x = Math.PI / 2;
    tubRim.position.y = 0.08;
    tubRim.userData = { action: 'scoop', flavorId: item.id };
    tubGroup.add(tubRim);

    // Rippled Ice Cream Mound
    // Realistic Churned Ice Cream Mound with fruit chunks, seeds, and real ripples
    const flvTexture = getRealisticFlavorTexture(item.id);
    const creamGeom = new THREE.SphereGeometry(0.2, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const creamMat = new THREE.MeshStandardMaterial({
      map: flvTexture,
      roughness: 0.42,
      metalness: 0.04,
    });
    const cream = new THREE.Mesh(creamGeom, creamMat);
    cream.position.y = 0.06;
    cream.userData = { action: 'scoop', flavorId: item.id };
    tubGroup.add(cream);

    // Realistic Ripple Swirls
    for (let s = 0; s < 4; s++) {
      const swirl = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), creamMat);
      const ang = (s / 4) * Math.PI * 2;
      swirl.position.set(Math.cos(ang) * 0.1, 0.14, Math.sin(ang) * 0.1);
      swirl.userData = { action: 'scoop', flavorId: item.id };
      tubGroup.add(swirl);
    }

    // Authentic Real Garnish for specific flavors (e.g. real strawberry garnish for strawberry!)
    if (item.id === 'strawberry') {
      const berryGarnish = createMiniStrawberryGarnish();
      berryGarnish.position.set(-0.06, 0.17, -0.06);
      berryGarnish.rotation.set(0.3, 0.2, 0.4);
      tubGroup.add(berryGarnish);
    }

    // Heavy Metal Ice Cream Spade / Scoop Resting in Tub
    const scoopGroup = new THREE.Group();
    scoopGroup.position.set(0.08, 0.16, 0.08);
    scoopGroup.rotation.set(0.4, 0, -0.4);
    scoopGroup.userData = { action: 'scoop', flavorId: item.id };

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.32, 10), steelMat);
    handle.userData = { action: 'scoop', flavorId: item.id };
    scoopGroup.add(handle);

    const scoopBowl = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), steelMat);
    scoopBowl.position.y = -0.16;
    scoopBowl.userData = { action: 'scoop', flavorId: item.id };
    scoopGroup.add(scoopBowl);

    tubGroup.add(scoopGroup);
    group.add(tubGroup);
  });

  return group;
}

/**
 * Realistic Commercial Milkshake Blender Machine with:
 * - Heavy die-cast motor base with rubber vibration dampening feet
 * - Brushed aluminum front faceplate with knurled speed dial & metal toggle switches
 * - Contoured clear Tritan glass blending pitcher with volume measurement markings
 * - 4-prong laser-cut stainless steel blender blade assembly & drive gear
 * - Commercial spill-proof rubber lid with removable measuring center plug
 * - Creamy blended banana milkshake liquid inside
 * - Wooden cutting board with a fresh ripe banana
 */
export function createRealisticBananaMachine(): THREE.Group {
  const machine = new THREE.Group();
  machine.name = 'banana_machine';
  machine.userData = { action: 'blend', label: 'Blend Banana Milkshake' };

  // Premium Materials
  const castCharcoalMat = new THREE.MeshStandardMaterial({
    color: 0x1E242B,
    roughness: 0.35,
    metalness: 0.2,
  });
  const brushedStainlessMat = new THREE.MeshStandardMaterial({
    color: 0xD8E0E8,
    metalness: 0.92,
    roughness: 0.18,
  });
  const darkRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181B,
    roughness: 0.85,
    metalness: 0.05,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xF1F5F9,
    metalness: 0.95,
    roughness: 0.1,
  });
  const clearJarMat = new THREE.MeshPhysicalMaterial({
    color: 0xF8FAFC,
    transparent: true,
    opacity: 0.38,
    transmission: 0.92,
    roughness: 0.08,
    ior: 1.52,
  });

  // 1. Heavy Motor Base (Die-cast Charcoal Body)
  const baseGeom = new THREE.BoxGeometry(0.54, 0.44, 0.54);
  const base = new THREE.Mesh(baseGeom, castCharcoalMat);
  base.position.y = 0.22;
  base.castShadow = true;
  base.userData = { action: 'blend', label: 'Blend Banana Milkshake' };
  machine.add(base);

  // 4 Non-slip Rubber Feet
  const footPositions = [
    [-0.22, -0.22],
    [0.22, -0.22],
    [-0.22, 0.22],
    [0.22, 0.22],
  ];
  footPositions.forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.04, 12), darkRubberMat);
    foot.position.set(fx, 0.02, fz);
    foot.userData = { action: 'blend' };
    machine.add(foot);
  });

  // Top Jar Centering Pad (Rubberized platform where pitcher sits)
  const padGeom = new THREE.CylinderGeometry(0.24, 0.25, 0.04, 20);
  const jarPad = new THREE.Mesh(padGeom, darkRubberMat);
  jarPad.position.set(0, 0.46, 0);
  jarPad.userData = { action: 'blend' };
  machine.add(jarPad);

  // 4 Jar alignment prongs
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const prong = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.04), darkRubberMat);
    prong.position.set(Math.cos(angle) * 0.18, 0.48, Math.sin(angle) * 0.18);
    machine.add(prong);
  }

  // Central Stainless Drive Spline Gear
  const driveGear = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), chromeMat);
  driveGear.position.set(0, 0.48, 0);
  machine.add(driveGear);

  // 2. Front Control Faceplate (Brushed Stainless Steel Panel)
  const faceplateGeom = new THREE.BoxGeometry(0.42, 0.32, 0.02);
  const faceplate = new THREE.Mesh(faceplateGeom, brushedStainlessMat);
  faceplate.position.set(0, 0.23, 0.275);
  faceplate.userData = { action: 'blend' };
  machine.add(faceplate);

  // Central Rotary Speed Dial (Knurled Metal Dial with Speed Indicator)
  const dialGeom = new THREE.CylinderGeometry(0.08, 0.085, 0.04, 24);
  const dial = new THREE.Mesh(dialGeom, brushedStainlessMat);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0, 0.23, 0.295);
  dial.userData = { action: 'blend' };
  machine.add(dial);

  // Dial Notch Indicator
  const dialNotch = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, 0.05, 0.01),
    new THREE.MeshBasicMaterial({ color: 0x0F172A })
  );
  dialNotch.position.set(0, 0.26, 0.315);
  machine.add(dialNotch);

  // Metal Paddle Switches (Left: PULSE, Right: START / STOP)
  const switchBaseGeom = new THREE.BoxGeometry(0.04, 0.08, 0.02);
  const paddleGeom = new THREE.CylinderGeometry(0.015, 0.02, 0.05, 10);

  // Pulse Switch (Left)
  const pulseBase = new THREE.Mesh(switchBaseGeom, castCharcoalMat);
  pulseBase.position.set(-0.14, 0.23, 0.29);
  machine.add(pulseBase);
  const pulsePaddle = new THREE.Mesh(paddleGeom, chromeMat);
  pulsePaddle.rotation.x = 0.4;
  pulsePaddle.position.set(-0.14, 0.23, 0.31);
  pulsePaddle.userData = { action: 'blend' };
  machine.add(pulsePaddle);

  // Start / Stop Switch (Right)
  const startBase = new THREE.Mesh(switchBaseGeom, castCharcoalMat);
  startBase.position.set(0.14, 0.23, 0.29);
  machine.add(startBase);
  const startPaddle = new THREE.Mesh(paddleGeom, chromeMat);
  startPaddle.rotation.x = -0.4;
  startPaddle.position.set(0.14, 0.23, 0.31);
  startPaddle.userData = { action: 'blend' };
  machine.add(startPaddle);

  // Power Ready Indicator LED (Subtle emerald green glow)
  const led = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.01, 10),
    new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x10B981,
      emissiveIntensity: 0.9,
    })
  );
  led.rotation.x = Math.PI / 2;
  led.position.set(0, 0.33, 0.29);
  machine.add(led);

  // 3. Realistic Contoured Blending Pitcher (Clear Tritan Jar)
  const pitcherGroup = new THREE.Group();
  pitcherGroup.name = 'pitcher';
  pitcherGroup.userData = { action: 'blend' };

  // Main Jar Body (Tapered upward with thick walls)
  const jarGeom = new THREE.CylinderGeometry(0.24, 0.19, 0.68, 20, 1, true);
  const jar = new THREE.Mesh(jarGeom, clearJarMat);
  jar.position.y = 0.82;
  jar.userData = { action: 'blend' };
  pitcherGroup.add(jar);

  // Jar Bottom Stainless Collar
  const collarGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 20);
  const collar = new THREE.Mesh(collarGeom, brushedStainlessMat);
  collar.position.y = 0.51;
  collar.userData = { action: 'blend' };
  pitcherGroup.add(collar);

  // Stainless Steel Blender Blade Assembly Inside Jar
  const bladeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12), chromeMat);
  bladeHub.position.y = 0.54;
  pitcherGroup.add(bladeHub);

  // 4 Laser-cut Stainless Blender Blades with curved tips
  for (let b = 0; b < 4; b++) {
    const bAngle = (b * Math.PI) / 2;
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.03), chromeMat);
    bMesh.rotation.y = bAngle;
    bMesh.rotation.z = (b % 2 === 0 ? 0.2 : -0.2); // angled up/down like real Vitamix blades
    bMesh.position.set(0, 0.55, 0);
    pitcherGroup.add(bMesh);
  }

  // Realistic Measurement Graduations on Jar Side (oz/ml hash markings)
  for (let m = 0; m < 5; m++) {
    const hashMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04 + (m % 2 === 0 ? 0.02 : 0), 0.006, 0.005),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 })
    );
    hashMesh.position.set(0, 0.62 + m * 0.08, 0.215 + m * 0.008);
    pitcherGroup.add(hashMesh);
  }

  // Molded Heavy Pitcher Handle with Soft-Grip Comfort Insert
  const handlePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.24, 1.05, 0),
    new THREE.Vector3(0.38, 0.98, 0),
    new THREE.Vector3(0.38, 0.68, 0),
    new THREE.Vector3(0.22, 0.60, 0),
  ]);
  const handleOuter = new THREE.Mesh(
    new THREE.TubeGeometry(handlePath, 16, 0.03, 10, false),
    castCharcoalMat
  );
  handleOuter.userData = { action: 'blend' };
  pitcherGroup.add(handleOuter);

  // Realistic Triangular Pour Spout at Top Lip
  const spout = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.08, 3),
    clearJarMat
  );
  spout.rotation.x = Math.PI;
  spout.position.set(0, 1.16, 0.24);
  pitcherGroup.add(spout);

  // Creamy Golden Banana Milkshake Inside Pitcher
  const shakeGeom = new THREE.CylinderGeometry(0.22, 0.18, 0.52, 18);
  const shakeMat = new THREE.MeshStandardMaterial({
    color: 0xFDE047, // Rich golden banana cream
    roughness: 0.3,
  });
  const shakeMesh = new THREE.Mesh(shakeGeom, shakeMat);
  shakeMesh.position.y = 0.78;
  shakeMesh.userData = { action: 'blend' };
  pitcherGroup.add(shakeMesh);

  // Froth / Foam Cap at Top of Shake
  const foamMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.225, 0.21, 0.04, 18),
    new THREE.MeshStandardMaterial({
      color: 0xFEF08A, // Frothy bubble layer
      roughness: 0.55,
    })
  );
  foamMesh.position.y = 1.04;
  pitcherGroup.add(foamMesh);

  // 4. Heavy-Duty Rubber Sealing Lid
  const lidBaseGeom = new THREE.CylinderGeometry(0.26, 0.25, 0.05, 20);
  const lid = new THREE.Mesh(lidBaseGeom, darkRubberMat);
  lid.position.y = 1.17;
  lid.userData = { action: 'blend' };
  pitcherGroup.add(lid);

  // Lid Dual Locking Flanges on Sides
  const flangeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.08), darkRubberMat);
  flangeLeft.position.set(-0.25, 1.15, 0);
  const flangeRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.08), darkRubberMat);
  flangeRight.position.set(0.25, 1.15, 0);
  pitcherGroup.add(flangeLeft, flangeRight);

  // Removable Clear Polycarbonate Measuring Plug in Center of Lid
  const plugGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.07, 16);
  const plug = new THREE.Mesh(plugGeom, clearJarMat);
  plug.position.y = 1.22;
  plug.userData = { action: 'blend' };
  pitcherGroup.add(plug);

  machine.add(pitcherGroup);

  return machine;
}

/**
 * Stainless Steel Syrup Squeeze Bottles Rack (Chocolate, Strawberry, Caramel)
 */
export function createRealisticSyrupRack(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'syrup_rack';

  // Chrome Wire Rack
  const rack = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.06, 0.38),
    new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9, roughness: 0.2 })
  );
  rack.position.y = 0.03;
  group.add(rack);

  const syrups: Array<{ id: ToppingId; color: number; name: string; x: number }> = [
    { id: 'chocolate_sauce', color: 0x451A03, name: 'Choco Fudge', x: -0.32 },
    { id: 'strawberry_syrup', color: 0xE11D48, name: 'Wild Berry', x: 0.0 },
  ];

  syrups.forEach(s => {
    const bottle = new THREE.Group();
    bottle.name = `topping_${s.id}`;
    bottle.userData = { action: 'topping', toppingId: s.id, label: s.name };
    bottle.position.set(s.x, 0, 0);

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.48, 18),
      new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.3 })
    );
    body.position.y = 0.26;
    body.userData = { action: 'topping', toppingId: s.id };
    bottle.add(body);

    // Translucent Squeeze Cone & Tip
    const cap = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.3 })
    );
    cap.position.y = 0.58;
    cap.userData = { action: 'topping', toppingId: s.id };
    bottle.add(cap);

    group.add(bottle);
  });

  return group;
}

/**
 * Glass Topping Bowls with Cherries, Sprinkles, and Whipped Cream
 */
export function createRealisticToppingBowls(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'topping_bowls';

  // 1. Maraschino Cherries Bowl
  const cherryBowl = createSingleGlassBowl('cherry', 0xEF4444);
  cherryBowl.position.set(-0.35, 0, 0.18);
  group.add(cherryBowl);

  // 2. Rainbow Sprinkles Bowl
  const sprinkleBowl = createSingleGlassBowl('sprinkles', 0xFBBF24);
  sprinkleBowl.position.set(0.0, 0, 0.18);
  group.add(sprinkleBowl);

  // 3. Whipped Cream Jar
  const creamBowl = createSingleGlassBowl('whipped_cream', 0xFFFFFF);
  creamBowl.position.set(0.35, 0, 0.18);
  group.add(creamBowl);

  return group;
}

function createSingleGlassBowl(toppingId: ToppingId, contentColor: number): THREE.Group {
  const bowlGroup = new THREE.Group();
  bowlGroup.name = `topping_${toppingId}`;
  bowlGroup.userData = { action: 'topping', toppingId, label: toppingId };

  // Glass Bowl
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xBAE6FD,
    transparent: true,
    opacity: 0.6,
    transmission: 0.85,
    roughness: 0.1,
  });
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.16, 18), glassMat);
  bowl.position.y = 0.08;
  bowl.userData = { action: 'topping', toppingId };
  bowlGroup.add(bowl);

  // Content Mound
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.65),
    new THREE.MeshStandardMaterial({ color: contentColor, roughness: 0.35 })
  );
  mound.position.y = 0.1;
  mound.userData = { action: 'topping', toppingId };
  bowlGroup.add(mound);

  // Glistening Cherry with green stem
  if (toppingId === 'cherry') {
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.1 }));
    ch.position.set(0, 0.18, 0);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 6), new THREE.MeshBasicMaterial({ color: 0x15803D }));
    stem.position.set(0, 0.08, 0);
    stem.rotation.z = 0.3;
    ch.add(stem);
    bowlGroup.add(ch);
  }

  return bowlGroup;
}

/**
 * Container Dispenser Tower (Stacked Waffle Cones, Sundae Cups, Milkshake Glasses)
 */
export function createRealisticContainerDispenser(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'container_dispenser';

  // Base stand
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.06, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9, roughness: 0.2 })
  );
  base.position.y = 0.03;
  group.add(base);

  // 1. Stacked Waffle Cones
  const coneGroup = new THREE.Group();
  coneGroup.name = 'cone_stack';
  coneGroup.userData = { action: 'container', container: 'waffle_cone', label: 'Waffle Cones' };
  coneGroup.position.set(-0.28, 0, 0);

  const waffleMat = new THREE.MeshStandardMaterial({
    map: createWaffleTexture(),
    roughness: 0.45,
  });
  for (let c = 0; c < 4; c++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 18, 1, true), waffleMat);
    cone.rotation.x = Math.PI;
    cone.position.y = 0.3 + c * 0.11;
    cone.userData = { action: 'container', container: 'waffle_cone' };
    coneGroup.add(cone);
  }
  group.add(coneGroup);

  // 2. Stacked Pastel Cups
  const cupGroup = new THREE.Group();
  cupGroup.name = 'cup_stack';
  cupGroup.userData = { action: 'container', container: 'cup', label: 'Sundae Cups' };
  cupGroup.position.set(0.0, 0, 0);

  const cupMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3 });
  for (let u = 0; u < 4; u++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.2, 18), cupMat);
    cup.position.y = 0.18 + u * 0.09;
    cup.userData = { action: 'container', container: 'cup' };
    cupGroup.add(cup);
  }
  group.add(cupGroup);

  // 3. Tall Milkshake Glass with Striped Straw
  const glassGroup = new THREE.Group();
  glassGroup.name = 'glass_stack';
  glassGroup.userData = { action: 'container', container: 'milkshake_glass', label: 'Milkshake Glass' };
  glassGroup.position.set(0.28, 0, 0);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.6,
    transmission: 0.9,
    roughness: 0.08,
  });
  const shakeGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.45, 18), glassMat);
  shakeGlass.position.y = 0.24;
  shakeGlass.userData = { action: 'container', container: 'milkshake_glass' };
  glassGroup.add(shakeGlass);

  // Red and white striped straw
  const straw = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.55, 10),
    new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 })
  );
  straw.position.set(0.04, 0.35, 0.02);
  straw.rotation.z = -0.2;
  straw.userData = { action: 'container', container: 'milkshake_glass' };
  glassGroup.add(straw);

  group.add(glassGroup);
  return group;
}

/**
 * Polished Golden Service Bell
 */
export function createRealisticServiceBell(): THREE.Group {
  const bell = new THREE.Group();
  bell.name = 'service_bell';
  bell.userData = { action: 'serve', label: 'Serve Order!' };

  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.26, 0.06, 20),
    new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3 })
  );
  base.position.y = 0.03;
  base.userData = { action: 'serve' };
  bell.add(base);

  // Brass Dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.88, roughness: 0.15 })
  );
  dome.position.y = 0.06;
  dome.castShadow = true;
  dome.userData = { action: 'serve' };
  bell.add(dome);

  // Plunger Stem & Button
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10),
    new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.1 })
  );
  stem.position.y = 0.27;
  stem.userData = { action: 'serve' };
  bell.add(stem);

  const btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.2 })
  );
  btn.position.y = 0.33;
  btn.userData = { action: 'serve' };
  bell.add(btn);

  return bell;
}

/**
 * Deep Royal Blue Recycling / Trash Bin
 */
export function createRealisticTrashBin(): THREE.Group {
  const bin = new THREE.Group();
  bin.name = 'trash_bin';
  bin.userData = { action: 'trash', label: 'Trash / Clear Tray' };

  // Body
  const binBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.34, 0.82, 24),
    new THREE.MeshStandardMaterial({ color: 0x1D4ED8, roughness: 0.35 })
  );
  binBody.position.y = 0.41;
  binBody.castShadow = true;
  binBody.userData = { action: 'trash' };
  bin.add(binBody);

  // Swing Flap Lid
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.41, 0.035, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.82;
  rim.userData = { action: 'trash' };
  bin.add(rim);

  const flap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.03, 20),
    new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.25 })
  );
  flap.position.set(0, 0.8, 0);
  flap.rotation.x = 0.25; // ajar
  flap.userData = { action: 'trash' };
  bin.add(flap);

  // Decal
  const iconMat = new THREE.MeshBasicMaterial({ map: createTrashDecalTexture(), transparent: true });
  const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), iconMat);
  decal.position.set(0, 0.44, 0.39);
  decal.userData = { action: 'trash' };
  bin.add(decal);

  return bin;
}
