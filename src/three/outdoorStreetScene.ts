import * as THREE from 'three';

export interface OutdoorStreetController {
  group: THREE.Group;
  update: (delta: number, elapsedTime: number) => void;
}

interface MovingVehicle {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  speed: number;
  direction: 1 | -1; // 1: moving right (+X), -1: moving left (-X)
  laneZ: number;
  minX: number;
  maxX: number;
  wheelRadius: number;
}

/**
 * Creates asphalt road texture with lane markings and zebra crossing
 */
function createRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark asphalt base with subtle gravel grain
  ctx.fillStyle = '#1E232A';
  ctx.fillRect(0, 0, 1024, 512);

  // Asphalt grain noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const gray = Math.floor(25 + Math.random() * 30);
    ctx.fillStyle = `rgb(${gray}, ${gray + 2}, ${gray + 5})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // 2. Double solid yellow center divider line
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(1024, 250);
  ctx.moveTo(0, 262);
  ctx.lineTo(1024, 262);
  ctx.stroke();

  // 3. White dashed lane lines
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 5;
  ctx.setLineDash([32, 28]);

  // South lane divider (Eastbound)
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.lineTo(1024, 130);
  ctx.stroke();

  // North lane divider (Westbound)
  ctx.beginPath();
  ctx.moveTo(0, 382);
  ctx.lineTo(1024, 382);
  ctx.stroke();

  // 4. Pedestrian Zebra Crosswalk right outside the parlour (around center X: 450 to 570)
  ctx.setLineDash([]);
  ctx.fillStyle = '#F8FAFC';
  const zebraStartX = 460;
  const zebraWidth = 110;
  const stripeW = 14;
  const gapW = 10;
  for (let x = zebraStartX; x < zebraStartX + zebraWidth; x += stripeW + gapW) {
    ctx.fillRect(x, 20, stripeW, 472);
  }

  // White road shoulder solid lines
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(0, 12, 1024, 6);
  ctx.fillRect(0, 494, 1024, 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

/**
 * Creates concrete sidewalk paver texture
 */
function createSidewalkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(0, 0, 512, 512);

  // Paver tile joints
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 3;
  const tileSize = 64;
  for (let x = 0; x <= 512; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  return texture;
}

// -------------------------------------------------------------
// Realistic Vehicle Model Builders (Cars, Taxis, SUVs, Buses)
// -------------------------------------------------------------

function createWheelMesh(radius = 0.32, width = 0.18): THREE.Mesh {
  const geom = new THREE.CylinderGeometry(radius, radius, width, 18);
  geom.rotateZ(Math.PI / 2);

  // Rubber tire with alloy hubcap
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.8,
  });
  const wheel = new THREE.Mesh(geom, tireMat);

  // Silver hubcap on outside
  const hubGeom = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width + 0.01, 14);
  hubGeom.rotateZ(Math.PI / 2);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    metalness: 0.85,
    roughness: 0.2,
  });
  const hub = new THREE.Mesh(hubGeom, hubMat);
  wheel.add(hub);

  wheel.castShadow = true;
  return wheel;
}

/**
 * 1. Realistic Modern City Sedan / Coupe
 */
function createCarModel(colorHex: number): { group: THREE.Group; wheels: THREE.Mesh[]; wheelRadius: number } {
  const car = new THREE.Group();
  const wheels: THREE.Mesh[] = [];
  const wheelRadius = 0.28;

  const paintMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.6,
    roughness: 0.25,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1E293B,
    transmission: 0.85,
    transparent: true,
    opacity: 0.45,
    roughness: 0.05,
    reflectivity: 0.9,
  });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, metalness: 0.9, roughness: 0.1 });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.7 });

  // Main Car Lower Body Chassis
  const chassisGeom = new THREE.BoxGeometry(3.6, 0.52, 1.6);
  const chassis = new THREE.Mesh(chassisGeom, paintMat);
  chassis.position.y = 0.45;
  chassis.castShadow = true;
  car.add(chassis);

  // Tapered Front Hood & Bumper
  const hoodGeom = new THREE.BoxGeometry(1.1, 0.38, 1.55);
  const hood = new THREE.Mesh(hoodGeom, paintMat);
  hood.position.set(1.4, 0.42, 0);
  hood.rotation.z = -0.06;
  car.add(hood);

  // Cabin / Greenhouse Roof
  const cabinGeom = new THREE.BoxGeometry(1.8, 0.54, 1.4);
  const cabin = new THREE.Mesh(cabinGeom, paintMat);
  cabin.position.set(-0.15, 0.92, 0);
  car.add(cabin);

  // Windshields (Front & Rear angled glass)
  const windshieldGeom = new THREE.BoxGeometry(0.85, 0.52, 1.35);
  const frontGlass = new THREE.Mesh(windshieldGeom, glassMat);
  frontGlass.position.set(0.68, 0.85, 0);
  frontGlass.rotation.z = -0.48;
  car.add(frontGlass);

  const rearGlass = new THREE.Mesh(windshieldGeom, glassMat);
  rearGlass.position.set(-0.95, 0.85, 0);
  rearGlass.rotation.z = 0.48;
  car.add(rearGlass);

  // Side Windows
  const sideGlassGeom = new THREE.BoxGeometry(1.5, 0.38, 1.42);
  const sideGlass = new THREE.Mesh(sideGlassGeom, glassMat);
  sideGlass.position.set(-0.15, 0.88, 0);
  car.add(sideGlass);

  // Front Headlights (Bright warm glow)
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xFFFBEB,
    emissive: 0xFEF08A,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  [-0.6, 0.6].forEach(zOffset => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.22), lightMat);
    light.position.set(1.95, 0.46, zOffset);
    car.add(light);
  });

  // Rear Taillights (Red brake lights)
  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xEF4444,
    emissive: 0xDC2626,
    emissiveIntensity: 0.8,
  });
  [-0.6, 0.6].forEach(zOffset => {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.24), tailLightMat);
    tail.position.set(-1.82, 0.52, zOffset);
    car.add(tail);
  });

  // Front Grille & Chrome Trim
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.75), darkTrimMat);
  grille.position.set(1.96, 0.36, 0);
  car.add(grille);

  // Side Mirrors
  [-0.82, 0.82].forEach(zOffset => {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.14), paintMat);
    mirror.position.set(0.65, 0.82, zOffset);
    car.add(mirror);
  });

  // 4 Wheels
  const wheelOffsets = [
    { x: 1.15, z: 0.8 },
    { x: 1.15, z: -0.8 },
    { x: -1.15, z: 0.8 },
    { x: -1.15, z: -0.8 },
  ];
  wheelOffsets.forEach(pos => {
    const wheel = createWheelMesh(wheelRadius, 0.16);
    wheel.position.set(pos.x, wheelRadius, pos.z);
    car.add(wheel);
    wheels.push(wheel);
  });

  return { group: car, wheels, wheelRadius };
}

/**
 * 2. Yellow City Taxi with Roof Beacon
 */
function createTaxiModel(): { group: THREE.Group; wheels: THREE.Mesh[]; wheelRadius: number } {
  const { group, wheels, wheelRadius } = createCarModel(0xFBBF24);

  // Taxi roof sign
  const signBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.12, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xFEF08A, emissive: 0xF59E0B, emissiveIntensity: 0.4 })
  );
  signBase.position.set(-0.15, 1.25, 0);
  group.add(signBase);

  // Black and white checkered side stripes
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.5 });
  [-0.81, 0.81].forEach(zOffset => {
    for (let c = 0; c < 6; c++) {
      if (c % 2 === 0) {
        const check = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.02), stripeMat);
        check.position.set(-0.7 + c * 0.26, 0.52, zOffset);
        group.add(check);
      }
    }
  });

  return { group, wheels, wheelRadius };
}

/**
 * 3. Modern City Transit Bus (Large, detailed, with passenger windows & digital sign)
 */
function createCityBusModel(primaryColorHex = 0x0284C7): { group: THREE.Group; wheels: THREE.Mesh[]; wheelRadius: number } {
  const bus = new THREE.Group();
  const wheels: THREE.Mesh[] = [];
  const wheelRadius = 0.42;

  const busLength = 7.8;
  const busHeight = 2.5;
  const busWidth = 2.1;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryColorHex,
    roughness: 0.35,
    metalness: 0.2,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.3,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0F172A,
    transmission: 0.8,
    transparent: true,
    opacity: 0.45,
    roughness: 0.05,
    reflectivity: 0.85,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 });

  // Lower Body Chassis
  const lowerChassis = new THREE.Mesh(
    new THREE.BoxGeometry(busLength, 0.85, busWidth),
    bodyMat
  );
  lowerChassis.position.y = 0.82;
  lowerChassis.castShadow = true;
  bus.add(lowerChassis);

  // Middle Window Band
  const windowBand = new THREE.Mesh(
    new THREE.BoxGeometry(busLength - 0.2, 1.15, busWidth + 0.02),
    glassMat
  );
  windowBand.position.y = 1.78;
  bus.add(windowBand);

  // Window pillars (Vertical struts between passenger windows)
  for (let p = 0; p < 7; p++) {
    const px = -2.8 + p * 0.95;
    [-busWidth / 2 - 0.01, busWidth / 2 + 0.01].forEach(pz => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.15, 0.04), darkTrimMat);
      pillar.position.set(px, 1.78, pz);
      bus.add(pillar);
    });
  }

  // Upper Roof Cap (White streamlined transit bus roof)
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(busLength, 0.45, busWidth),
    whiteMat
  );
  roof.position.y = 2.55;
  roof.castShadow = true;
  bus.add(roof);

  // Roof AC Units
  const ac1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.2), whiteMat);
  ac1.position.set(0.5, 2.88, 0);
  bus.add(ac1);

  const ac2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.1), whiteMat);
  ac2.position.set(-2.2, 2.86, 0);
  bus.add(ac2);

  // Front Windshield (Massive curved glass)
  const frontWindshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.35, busWidth - 0.1),
    glassMat
  );
  frontWindshield.position.set(busLength / 2 - 0.05, 1.82, 0);
  frontWindshield.rotation.z = -0.12;
  bus.add(frontWindshield);

  // Glowing Electronic Destination Sign above windshield ("42 • CITY LOOP")
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 64;
  const sctx = signCanvas.getContext('2d')!;
  sctx.fillStyle = '#0F172A';
  sctx.fillRect(0, 0, 256, 64);
  sctx.fillStyle = '#F59E0B';
  sctx.font = 'bold 26px sans-serif';
  sctx.fillText('42 • OCEAN DRIVE', 12, 42);
  const signTex = new THREE.CanvasTexture(signCanvas);

  const destSign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.32),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  destSign.position.set(busLength / 2 + 0.02, 2.52, 0);
  destSign.rotation.y = Math.PI / 2;
  bus.add(destSign);

  // Large Front Headlights
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xFFFBEB,
    emissive: 0xFEF08A,
    emissiveIntensity: 1.0,
  });
  [-0.75, 0.75].forEach(zOffset => {
    const light = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), lightMat);
    light.rotation.z = Math.PI / 2;
    light.position.set(busLength / 2 + 0.02, 0.65, zOffset);
    bus.add(light);
  });

  // Rear Vertical Red Brake Lights
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xEF4444,
    emissive: 0xDC2626,
    emissiveIntensity: 0.9,
  });
  [-0.85, 0.85].forEach(zOffset => {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.14), tailMat);
    tail.position.set(-busLength / 2 - 0.02, 1.1, zOffset);
    bus.add(tail);
  });

  // Front Passenger Entrance Doors (Glass bi-fold)
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.5 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.04), doorMat);
  door.position.set(2.4, 1.2, busWidth / 2 + 0.01);
  bus.add(door);

  // Big Sturdy Bus Wheels (Front single pair, Rear dual pair)
  const wheelPositions = [
    { x: 2.3, z: 1.05 },
    { x: 2.3, z: -1.05 },
    { x: -2.2, z: 1.05 },
    { x: -2.2, z: -1.05 },
  ];
  wheelPositions.forEach(pos => {
    const wheel = createWheelMesh(wheelRadius, 0.22);
    wheel.position.set(pos.x, wheelRadius, pos.z);
    bus.add(wheel);
    wheels.push(wheel);
  });

  return { group: bus, wheels, wheelRadius };
}

/**
 * 4. Classic Yellow School / Shuttle Bus
 */
function createSchoolBusModel(): { group: THREE.Group; wheels: THREE.Mesh[]; wheelRadius: number } {
  const { group, wheels, wheelRadius } = createCityBusModel(0xF59E0B);

  // Black side rub rails
  const railMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.7 });
  [-1.06, 1.06].forEach(zOffset => {
    [0.7, 1.0].forEach(yPos => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.05, 0.04), railMat);
      rail.position.set(0, yPos, zOffset);
      group.add(rail);
    });
  });

  // Hexagonal STOP sign on driver side
  const stopSign = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.03, 8),
    new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.3 })
  );
  stopSign.position.set(1.6, 1.6, -1.1);
  stopSign.rotation.x = Math.PI / 2;
  group.add(stopSign);

  return { group, wheels, wheelRadius };
}

/**
 * Builds the complete Outdoor Street Scene with:
 * - Wide sidewalk directly outside parlour
 * - Multi-lane asphalt road with crosswalk and markings
 * - Moving realistic traffic: Cars, Yellow Taxis, Red Coupes, City Buses, School Bus
 * - Opposite sidewalk with cafe promenade, city park, trees, town buildings, and distant hills
 */
export function createOutdoorStreetScene(): OutdoorStreetController {
  const root = new THREE.Group();
  root.name = 'outdoor_street_scene';

  const movingVehicles: MovingVehicle[] = [];

  // =============================================================
  // 1. SOUTH SIDEWALK (Directly outside the parlour: Z = -4.2 to -5.8)
  // =============================================================
  const sidewalkTex = createSidewalkTexture();
  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    roughness: 0.75,
  });

  const southSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.16, 1.8),
    sidewalkMat
  );
  southSidewalk.position.set(0, 0.08, -5.0);
  southSidewalk.receiveShadow = true;
  root.add(southSidewalk);

  // Granite Curb along south sidewalk edge (Z = -5.9)
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });
  const southCurb = new THREE.Mesh(new THREE.BoxGeometry(80, 0.2, 0.18), curbMat);
  southCurb.position.set(0, 0.1, -5.9);
  root.add(southCurb);

  // =============================================================
  // 2. MULTI-LANE ASPHALT ROADWAY (Z = -6.0 to -10.4)
  // =============================================================
  const roadTex = createRoadTexture();
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.85,
    metalness: 0.05,
  });
  const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(80, 4.4), roadMat);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.position.set(0, 0.01, -8.2);
  roadMesh.receiveShadow = true;
  root.add(roadMesh);

  // =============================================================
  // 3. NORTH SIDEWALK & PROMENADE (Z = -10.5 to -12.4)
  // =============================================================
  const northCurb = new THREE.Mesh(new THREE.BoxGeometry(80, 0.2, 0.18), curbMat);
  northCurb.position.set(0, 0.1, -10.5);
  root.add(northCurb);

  const northSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(80, 0.16, 2.0),
    sidewalkMat
  );
  northSidewalk.position.set(0, 0.08, -11.5);
  northSidewalk.receiveShadow = true;
  root.add(northSidewalk);

  // Decorative wrought iron street lamps along both sidewalks
  const lampPoleMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.7, roughness: 0.3 });
  const lampGlowMat = new THREE.MeshStandardMaterial({
    color: 0xFEF3C7,
    emissive: 0xFDE68A,
    emissiveIntensity: 0.7,
  });

  const streetLampPositions = [
    { x: -14, z: -5.6 },
    { x: -5, z: -5.6 },
    { x: 5, z: -5.6 },
    { x: 14, z: -5.6 },
    { x: -10, z: -11.6 },
    { x: 0, z: -11.6 },
    { x: 10, z: -11.6 },
  ];

  streetLampPositions.forEach(lp => {
    const lamp = new THREE.Group();
    lamp.position.set(lp.x, 0.16, lp.z);

    // Fluted post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 3.2, 10), lampPoleMat);
    post.position.y = 1.6;
    lamp.add(post);

    // Arched arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.05), lampPoleMat);
    arm.position.set(0.18, 3.15, 0);
    lamp.add(arm);

    // Lantern fixture
    const fixture = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 6), lampGlowMat);
    fixture.position.set(0.36, 3.0, 0);
    lamp.add(fixture);

    root.add(lamp);
  });

  // Bus Stop Shelter on North Sidewalk (Z = -11.8, X = 6)
  const busStop = new THREE.Group();
  busStop.position.set(6.5, 0.16, -11.8);

  const glassShelterMat = new THREE.MeshPhysicalMaterial({
    color: 0xE2E8F0,
    transmission: 0.9,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
  });

  // Glass canopy roof
  const shelterRoof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 1.4), lampPoleMat);
  shelterRoof.position.set(0, 2.4, 0);
  busStop.add(shelterRoof);

  // Rear glass panel
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 0.04), glassShelterMat);
  backPanel.position.set(0, 1.2, -0.6);
  busStop.add(backPanel);

  // Transit bench inside shelter
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.08, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xB45309, roughness: 0.6 })
  );
  bench.position.set(0, 0.5, -0.3);
  busStop.add(bench);

  // Bus Stop Signpost
  const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8), lampPoleMat);
  signPole.position.set(2.0, 1.1, 0.6);
  busStop.add(signPole);

  const stopSignHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16),
    new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.4 })
  );
  stopSignHead.position.set(2.0, 2.1, 0.6);
  stopSignHead.rotation.x = Math.PI / 2;
  busStop.add(stopSignHead);

  root.add(busStop);

  // =============================================================
  // 4. LUSH PARK & CITY LANDSCAPE BACKGROUND (Z = -12.5 to -35.0)
  // =============================================================
  // Park stone retaining wall
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.8 });
  const stoneWall = new THREE.Mesh(new THREE.BoxGeometry(80, 0.7, 0.35), wallMat);
  stoneWall.position.set(0, 0.45, -12.5);
  root.add(stoneWall);

  // Park lawn & green landscape
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.85 });
  const parkLawn = new THREE.Mesh(new THREE.PlaneGeometry(80, 22), grassMat);
  parkLawn.rotation.x = -Math.PI / 2;
  parkLawn.position.set(0, 0.35, -23.5);
  parkLawn.receiveShadow = true;
  root.add(parkLawn);

  // Park trees & blossoming cherry trees along the promenade
  const treeColors = [0x16A34A, 0x15803D, 0xF472B6, 0x22C55E, 0xFB7185];
  const treePositions = [
    { x: -18, z: -14.5, s: 1.4, c: 0 },
    { x: -12, z: -15.2, s: 1.6, c: 2 }, // Cherry blossom
    { x: -6, z: -14.8, s: 1.5, c: 1 },
    { x: 1, z: -15.5, s: 1.6, c: 3 },
    { x: 9, z: -15.0, s: 1.5, c: 4 }, // Cherry blossom
    { x: 15, z: -14.8, s: 1.4, c: 0 },
    { x: 21, z: -15.2, s: 1.6, c: 1 },
  ];

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });
  treePositions.forEach(tp => {
    const tree = new THREE.Group();
    tree.position.set(tp.x, 0.35, tp.z);
    tree.scale.set(tp.s, tp.s, tp.s);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8), trunkMat);
    trunk.position.y = 0.9;
    tree.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({
      color: treeColors[tp.c],
      roughness: 0.65,
    });
    // Multi-puff tree canopy
    const canopy = new THREE.Group();
    canopy.position.y = 2.2;
    [-0.3, 0.3].forEach(dx => {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 2), foliageMat);
      puff.position.set(dx, 0.2, 0);
      canopy.add(puff);
    });
    const topPuff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 2), foliageMat);
    topPuff.position.set(0, 0.7, 0);
    canopy.add(topPuff);

    tree.add(canopy);
    root.add(tree);
  });

  // Town Buildings / Facades in Background (Z = -26 to -32)
  const buildingColors = [0xFFFBEB, 0xE2E8F0, 0xFEF3C7, 0xF1F5F9, 0xE0E7FF];
  for (let b = 0; b < 9; b++) {
    const bx = -28 + b * 7.0;
    const bHeight = 7.5 + (b % 3) * 2.2;
    const bWidth = 6.4;
    const bDepth = 6.0;

    const bMat = new THREE.MeshStandardMaterial({
      color: buildingColors[b % buildingColors.length],
      roughness: 0.7,
    });
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), bMat);
    bldg.position.set(bx, bHeight / 2 + 0.35, -28);
    root.add(bldg);

    // Architectural Roof Trim / Parapet
    const roofTrim = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.3, 0.4, bDepth + 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 })
    );
    roofTrim.position.set(bx, bHeight + 0.35 + 0.2, -28);
    root.add(roofTrim);

    // Windows with soft reflective glow
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x93C5FD,
      roughness: 0.15,
      metalness: 0.2,
    });
    for (let floor = 1; floor < Math.floor(bHeight / 2); floor++) {
      [-1.8, 0, 1.8].forEach(wx => {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.3), winMat);
        win.position.set(bx + wx, floor * 2.0 + 1.2, -24.95);
        root.add(win);
      });
    }
  }

  // =============================================================
  // 5. MOVING VEHICLES SYSTEM (Cars, Yellow Taxis, City Buses)
  // =============================================================
  // Lane 1: Eastbound (Driving to the Right, Z = -7.1, direction: +1)
  // Lane 2: Westbound (Driving to the Left, Z = -9.3, direction: -1)

  // Vehicle 1: Red Sports Coupe (Eastbound)
  const car1 = createCarModel(0xEF4444);
  car1.group.position.set(-18, 0, -7.1);
  root.add(car1.group);
  movingVehicles.push({
    group: car1.group,
    wheels: car1.wheels,
    speed: 7.2,
    direction: 1,
    laneZ: -7.1,
    minX: -40,
    maxX: 40,
    wheelRadius: car1.wheelRadius,
  });

  // Vehicle 2: City Transit Bus (Eastbound)
  const bus1 = createCityBusModel(0x0284C7);
  bus1.group.position.set(-4, 0, -7.1);
  root.add(bus1.group);
  movingVehicles.push({
    group: bus1.group,
    wheels: bus1.wheels,
    speed: 5.4,
    direction: 1,
    laneZ: -7.1,
    minX: -40,
    maxX: 40,
    wheelRadius: bus1.wheelRadius,
  });

  // Vehicle 3: White Sleek Sedan (Eastbound)
  const car2 = createCarModel(0xF8FAFC);
  car2.group.position.set(16, 0, -7.1);
  root.add(car2.group);
  movingVehicles.push({
    group: car2.group,
    wheels: car2.wheels,
    speed: 6.8,
    direction: 1,
    laneZ: -7.1,
    minX: -40,
    maxX: 40,
    wheelRadius: car2.wheelRadius,
  });

  // Vehicle 4: Yellow City Taxi (Westbound, Facing Left)
  const taxi = createTaxiModel();
  taxi.group.position.set(22, 0, -9.3);
  taxi.group.rotation.y = Math.PI; // Face west
  root.add(taxi.group);
  movingVehicles.push({
    group: taxi.group,
    wheels: taxi.wheels,
    speed: 7.5,
    direction: -1,
    laneZ: -9.3,
    minX: -40,
    maxX: 40,
    wheelRadius: taxi.wheelRadius,
  });

  // Vehicle 5: Classic Yellow School / Shuttle Bus (Westbound, Facing Left)
  const schoolBus = createSchoolBusModel();
  schoolBus.group.position.set(5, 0, -9.3);
  schoolBus.group.rotation.y = Math.PI;
  root.add(schoolBus.group);
  movingVehicles.push({
    group: schoolBus.group,
    wheels: schoolBus.wheels,
    speed: 5.2,
    direction: -1,
    laneZ: -9.3,
    minX: -40,
    maxX: 40,
    wheelRadius: schoolBus.wheelRadius,
  });

  // Vehicle 6: Cobalt Blue Modern Hatchback (Westbound, Facing Left)
  const car3 = createCarModel(0x2563EB);
  car3.group.position.set(-14, 0, -9.3);
  car3.group.rotation.y = Math.PI;
  root.add(car3.group);
  movingVehicles.push({
    group: car3.group,
    wheels: car3.wheels,
    speed: 6.5,
    direction: -1,
    laneZ: -9.3,
    minX: -40,
    maxX: 40,
    wheelRadius: car3.wheelRadius,
  });

  // Animation controller
  const controller: OutdoorStreetController = {
    group: root,
    update: (delta: number, _elapsedTime: number) => {
      movingVehicles.forEach(veh => {
        const moveDist = veh.speed * delta * veh.direction;
        veh.group.position.x += moveDist;

        // Realistic wheel spin relative to velocity and radius
        const wheelRotDelta = (veh.speed * delta) / veh.wheelRadius;
        veh.wheels.forEach(w => {
          w.rotation.x += veh.direction * wheelRotDelta;
        });

        // Loop seamlessly when leaving visible bounds
        if (veh.direction === 1 && veh.group.position.x > veh.maxX) {
          veh.group.position.x = veh.minX;
        } else if (veh.direction === -1 && veh.group.position.x < veh.minX) {
          veh.group.position.x = veh.maxX;
        }
      });
    },
  };

  return controller;
}
