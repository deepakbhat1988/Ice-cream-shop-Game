import * as THREE from 'three';
import { CustomerAppearance } from '../types/game';

export interface HumanCustomerController {
  group: THREE.Group;
  headGroup: THREE.Group;
  leftEyelid: THREE.Mesh;
  rightEyelid: THREE.Mesh;
  blinkTimer: number;
  nextBlinkTime: number;
  isBlinking: boolean;
  happyBounce: number;
  update: (delta: number, elapsedTime: number) => void;
  triggerHappy: () => void;
}

// Helper to create soft blush texture
function createBlushTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(244, 63, 94, 0.6)');
  grad.addColorStop(0.6, 'rgba(251, 113, 133, 0.25)');
  grad.addColorStop(1, 'rgba(251, 113, 133, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// Straw Hat Texture
function createStrawTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 3;
  for (let i = 0; i < 128; i += 8) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();
  }
  for (let j = 0; j < 128; j += 12) {
    ctx.beginPath();
    ctx.moveTo(j, 0);
    ctx.lineTo(j, 128);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

export function createHumanCustomer(appearance: CustomerAppearance): HumanCustomerController {
  const root = new THREE.Group();
  const headGroup = new THREE.Group();

  const skinColor = new THREE.Color(appearance.skinTone);
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.5,
    metalness: 0.02,
  });

  const hairColor = new THREE.Color(appearance.hairColor);
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.45,
    metalness: 0.05,
  });

  // 1. Torso & Upper Body (Behind Counter)
  const bodyGroup = new THREE.Group();
  bodyGroup.position.y = 0.55;

  const shirtMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(appearance.shirtColor),
    roughness: 0.6,
  });

  // Torso / Shoulders
  const torsoGeom = new THREE.CylinderGeometry(0.42, 0.46, 0.8, 20);
  torsoGeom.scale(1.2, 1, 0.7);
  const torso = new THREE.Mesh(torsoGeom, shirtMat);
  torso.castShadow = true;
  torso.receiveShadow = true;
  bodyGroup.add(torso);

  // Collar / Neckband
  const collarGeom = new THREE.TorusGeometry(0.18, 0.05, 12, 24);
  const collarMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5 });
  const collar = new THREE.Mesh(collarGeom, collarMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.4;
  bodyGroup.add(collar);

  // Cute little button on shirt
  const buttonGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12);
  const buttonMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.2 });
  const button1 = new THREE.Mesh(buttonGeom, buttonMat);
  button1.rotation.x = Math.PI / 2;
  button1.position.set(0, 0.22, 0.28);
  const button2 = button1.clone();
  button2.position.set(0, 0.08, 0.29);
  bodyGroup.add(button1, button2);

  // Arms resting forward towards counter
  const armGeom = new THREE.CylinderGeometry(0.1, 0.09, 0.65, 16);
  const leftArm = new THREE.Mesh(armGeom, shirtMat);
  leftArm.position.set(-0.48, 0.15, 0.1);
  leftArm.rotation.set(0.4, 0, 0.25);
  bodyGroup.add(leftArm);

  const rightArm = new THREE.Mesh(armGeom, shirtMat);
  rightArm.position.set(0.48, 0.15, 0.1);
  rightArm.rotation.set(0.4, 0, -0.25);
  bodyGroup.add(rightArm);

  // Hands
  const handGeom = new THREE.SphereGeometry(0.1, 16, 16);
  const leftHand = new THREE.Mesh(handGeom, skinMat);
  leftHand.position.set(-0.52, -0.15, 0.35);
  bodyGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeom, skinMat);
  rightHand.position.set(0.52, -0.15, 0.35);
  bodyGroup.add(rightHand);

  root.add(bodyGroup);

  // 2. Neck
  const neckGeom = new THREE.CylinderGeometry(0.14, 0.16, 0.32, 16);
  const neck = new THREE.Mesh(neckGeom, skinMat);
  neck.position.y = 1.0;
  root.add(neck);

  // 3. Head (Anime/Chibi proportions with cute chin and cheeks)
  headGroup.position.y = 1.42;

  // Head base geometry
  const headGeom = new THREE.SphereGeometry(0.58, 32, 32);
  headGeom.scale(1.0, 1.05, 0.95);
  const headMesh = new THREE.Mesh(headGeom, skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Cute Ears
  const earGeom = new THREE.SphereGeometry(0.13, 14, 14);
  earGeom.scale(0.5, 1.0, 0.7);
  const leftEar = new THREE.Mesh(earGeom, skinMat);
  leftEar.position.set(-0.56, 0.02, -0.05);
  leftEar.rotation.y = -0.2;
  const rightEar = new THREE.Mesh(earGeom, skinMat);
  rightEar.position.set(0.56, 0.02, -0.05);
  rightEar.rotation.y = 0.2;
  headGroup.add(leftEar, rightEar);

  // Blush Cheeks (translucent pink glow on cheeks)
  const blushMat = new THREE.MeshBasicMaterial({
    map: createBlushTexture(),
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const blushGeom = new THREE.PlaneGeometry(0.24, 0.16);
  const leftBlush = new THREE.Mesh(blushGeom, blushMat);
  leftBlush.position.set(-0.28, -0.08, 0.49);
  leftBlush.rotation.set(-0.1, -0.25, 0);

  const rightBlush = new THREE.Mesh(blushGeom, blushMat);
  rightBlush.position.set(0.28, -0.08, 0.49);
  rightBlush.rotation.set(-0.1, 0.25, 0);
  headGroup.add(leftBlush, rightBlush);

  // 3D Eyes (Sclera + Iris + Pupil + Gloss Catchlights + Eyelids)
  const eyeColor = new THREE.Color(appearance.eyeColor);
  const irisMat = new THREE.MeshStandardMaterial({
    color: eyeColor,
    roughness: 0.1,
    metalness: 0.1,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0F172A });
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  // Function to create one complete eye assembly
  const createEye = (isLeft: boolean) => {
    const eyeAssembly = new THREE.Group();
    const xPos = isLeft ? -0.22 : 0.22;
    const yAngle = isLeft ? -0.2 : 0.2;

    // Sclera (White of eye)
    const scleraGeom = new THREE.SphereGeometry(0.14, 20, 20);
    scleraGeom.scale(1.0, 1.15, 0.35);
    const scleraMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const sclera = new THREE.Mesh(scleraGeom, scleraMat);
    eyeAssembly.add(sclera);

    // Iris (Vibrant anime eye color)
    const irisGeom = new THREE.SphereGeometry(0.09, 18, 18);
    irisGeom.scale(1.0, 1.1, 0.2);
    const iris = new THREE.Mesh(irisGeom, irisMat);
    iris.position.set(0, -0.01, 0.04);
    eyeAssembly.add(iris);

    // Pupil
    const pupilGeom = new THREE.SphereGeometry(0.05, 14, 14);
    pupilGeom.scale(0.9, 1.0, 0.2);
    const pupil = new THREE.Mesh(pupilGeom, pupilMat);
    pupil.position.set(0, 0, 0.055);
    eyeAssembly.add(pupil);

    // Primary Big Gloss Catchlight
    const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), shineMat);
    shine1.position.set(isLeft ? 0.025 : -0.015, 0.038, 0.065);
    eyeAssembly.add(shine1);

    // Secondary Small Catchlight
    const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), shineMat);
    shine2.position.set(isLeft ? -0.03 : 0.03, -0.035, 0.062);
    eyeAssembly.add(shine2);

    // Eyelid for Blinking (Rotates down to cover eye)
    const eyelidGeom = new THREE.SphereGeometry(0.155, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    eyelidGeom.scale(1.0, 1.18, 0.4);
    const eyelid = new THREE.Mesh(eyelidGeom, skinMat);
    eyelid.position.set(0, 0.02, 0.02);
    eyelid.rotation.x = -Math.PI / 2; // Open state
    eyeAssembly.add(eyelid);

    // Eyelash line
    const lashGeom = new THREE.TorusGeometry(0.12, 0.014, 8, 16, Math.PI * 0.75);
    const lashMat = new THREE.MeshBasicMaterial({ color: 0x1E1B4B });
    const lash = new THREE.Mesh(lashGeom, lashMat);
    lash.position.set(0, 0.08, 0.04);
    lash.rotation.z = isLeft ? 0.2 : -0.2;
    eyeAssembly.add(lash);

    // Eyebrow
    const browGeom = new THREE.BoxGeometry(0.18, 0.024, 0.02);
    const browMat = new THREE.MeshBasicMaterial({ color: hairColor });
    const brow = new THREE.Mesh(browGeom, browMat);
    brow.position.set(0, 0.17, 0.03);
    brow.rotation.z = isLeft ? 0.08 : -0.08;
    eyeAssembly.add(brow);

    eyeAssembly.position.set(xPos, 0.06, 0.48);
    eyeAssembly.rotation.y = yAngle;

    return { eyeAssembly, eyelid };
  };

  const leftEyeData = createEye(true);
  const rightEyeData = createEye(false);
  headGroup.add(leftEyeData.eyeAssembly, rightEyeData.eyeAssembly);

  // 3D Nose (Cute button nose)
  const noseGeom = new THREE.SphereGeometry(0.045, 12, 12);
  noseGeom.scale(1.0, 0.9, 1.4);
  const nose = new THREE.Mesh(noseGeom, skinMat);
  nose.position.set(0, -0.04, 0.58);
  headGroup.add(nose);

  // Sweet Smiling Mouth
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, -0.2, 0.52);

  // Smile curve (torus segment)
  const smileGeom = new THREE.TorusGeometry(0.1, 0.02, 10, 20, Math.PI * 0.85);
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x991B1B });
  const smile = new THREE.Mesh(smileGeom, smileMat);
  smile.rotation.z = Math.PI * 1.08;
  mouthGroup.add(smile);

  // Little pink tongue / teeth shine inside smile
  const teethGeom = new THREE.BoxGeometry(0.09, 0.022, 0.02);
  const teethMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const teeth = new THREE.Mesh(teethGeom, teethMat);
  teeth.position.set(0, -0.015, 0.01);
  mouthGroup.add(teeth);

  headGroup.add(mouthGroup);

  // 4. Detailed 3D Hair Models
  const hairGroup = new THREE.Group();

  // Base Scalp Skull Cap
  const scalpGeom = new THREE.SphereGeometry(0.61, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7);
  scalpGeom.scale(1.01, 1.05, 0.98);
  const scalp = new THREE.Mesh(scalpGeom, hairMat);
  hairGroup.add(scalp);

  if (appearance.hairStyle === 'bob_bangs') {
    // Chic Bob with curved bangs
    // Bangs across forehead
    for (let b = -3; b <= 3; b++) {
      const bangGeom = new THREE.CylinderGeometry(0.06, 0.04, 0.32, 12);
      bangGeom.scale(1.2, 1, 0.6);
      const bang = new THREE.Mesh(bangGeom, hairMat);
      bang.position.set(b * 0.11, 0.28 - Math.abs(b) * 0.03, 0.52);
      bang.rotation.x = -0.35;
      bang.rotation.z = b * -0.08;
      hairGroup.add(bang);
    }
    // Left and Right Bob Curving Sides
    const sideGeom = new THREE.CylinderGeometry(0.14, 0.12, 0.65, 14);
    sideGeom.scale(0.8, 1, 1.2);
    const leftBob = new THREE.Mesh(sideGeom, hairMat);
    leftBob.position.set(-0.52, -0.05, 0.05);
    leftBob.rotation.z = -0.15;
    const rightBob = new THREE.Mesh(sideGeom, hairMat);
    rightBob.position.set(0.52, -0.05, 0.05);
    rightBob.rotation.z = 0.15;
    hairGroup.add(leftBob, rightBob);
  } else if (appearance.hairStyle === 'ponytail') {
    // High Ponytail with Ribbon
    // Front bangs
    for (let b = -2; b <= 2; b++) {
      const bang = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.28, 12), hairMat);
      bang.position.set(b * 0.14, 0.28, 0.52);
      bang.rotation.x = -0.3;
      hairGroup.add(bang);
    }
    // Ponytail tie
    const tieGeom = new THREE.TorusGeometry(0.08, 0.03, 10, 16);
    const tieMat = new THREE.MeshStandardMaterial({ color: 0xF43F5E });
    const tie = new THREE.Mesh(tieGeom, tieMat);
    tie.position.set(0, 0.46, -0.48);
    tie.rotation.x = 0.5;
    hairGroup.add(tie);

    // Ponytail tail flow
    const tailGeom = new THREE.CylinderGeometry(0.16, 0.05, 0.75, 16);
    tailGeom.scale(1, 1, 0.8);
    const tail = new THREE.Mesh(tailGeom, hairMat);
    tail.position.set(0, 0.18, -0.72);
    tail.rotation.x = -0.65;
    hairGroup.add(tail);
  } else if (appearance.hairStyle === 'twin_tails') {
    // Cute Twin Pigtails
    for (let b = -3; b <= 3; b++) {
      const bang = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.28, 10), hairMat);
      bang.position.set(b * 0.11, 0.28, 0.52);
      bang.rotation.x = -0.3;
      hairGroup.add(bang);
    }
    // Left & Right Tail
    const pigtailGeom = new THREE.ConeGeometry(0.16, 0.68, 14);
    pigtailGeom.scale(1, 1, 0.7);
    const leftTail = new THREE.Mesh(pigtailGeom, hairMat);
    leftTail.position.set(-0.58, 0.1, -0.2);
    leftTail.rotation.z = -0.7;
    leftTail.rotation.x = -0.2;

    const rightTail = new THREE.Mesh(pigtailGeom, hairMat);
    rightTail.position.set(0.58, 0.1, -0.2);
    rightTail.rotation.z = 0.7;
    rightTail.rotation.x = -0.2;
    hairGroup.add(leftTail, rightTail);

    // Ribbon Bows on Tails
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xFB7185 });
    const leftRibbon = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 16), ribbonMat);
    leftRibbon.position.set(-0.52, 0.32, -0.15);
    const rightRibbon = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 16), ribbonMat);
    rightRibbon.position.set(0.52, 0.32, -0.15);
    hairGroup.add(leftRibbon, rightRibbon);
  } else if (appearance.hairStyle === 'curly_short') {
    // Textured anime curls / waves
    for (let c = 0; c < 14; c++) {
      const curlGeom = new THREE.SphereGeometry(0.16, 12, 12);
      const curl = new THREE.Mesh(curlGeom, hairMat);
      const angle = (c / 14) * Math.PI * 1.6 - Math.PI * 0.8;
      curl.position.set(Math.sin(angle) * 0.48, 0.32 + (c % 2) * 0.08, Math.cos(angle) * 0.42);
      hairGroup.add(curl);
    }
  } else {
    // side_part
    const partGeom = new THREE.BoxGeometry(0.55, 0.22, 0.2);
    const partHair = new THREE.Mesh(partGeom, hairMat);
    partHair.position.set(0.1, 0.35, 0.46);
    partHair.rotation.set(-0.25, 0.1, -0.15);
    hairGroup.add(partHair);
  }

  headGroup.add(hairGroup);

  // 5. Accessories (Straw hat, bow, flower, etc.)
  if (appearance.accessory === 'straw_hat') {
    // Woven straw sun hat with pink ribbon band
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 0.48, 0.05);
    hatGroup.rotation.x = -0.15;

    const strawMat = new THREE.MeshStandardMaterial({
      map: createStrawTexture(),
      roughness: 0.65,
    });
    // Hat Dome
    const domeGeom = new THREE.CylinderGeometry(0.48, 0.52, 0.32, 24);
    const dome = new THREE.Mesh(domeGeom, strawMat);
    hatGroup.add(dome);

    // Hat Brim
    const brimGeom = new THREE.CylinderGeometry(0.95, 0.95, 0.04, 28);
    const brim = new THREE.Mesh(brimGeom, strawMat);
    brim.position.y = -0.14;
    hatGroup.add(brim);

    // Hat Ribbon
    const hatBandGeom = new THREE.CylinderGeometry(0.53, 0.53, 0.09, 24);
    const hatBandMat = new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.4 });
    const hatBand = new THREE.Mesh(hatBandGeom, hatBandMat);
    hatBand.position.y = -0.08;
    hatGroup.add(hatBand);

    headGroup.add(hatGroup);
  } else if (appearance.accessory === 'pink_bow') {
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0.32, 0.5, 0.25);
    bowGroup.rotation.z = -0.4;
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xEC4899, roughness: 0.3 });

    const leftWing = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 12), bowMat);
    leftWing.rotation.z = Math.PI / 2;
    leftWing.position.x = -0.11;

    const rightWing = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.24, 12), bowMat);
    rightWing.rotation.z = -Math.PI / 2;
    rightWing.position.x = 0.11;

    const centerKnot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), bowMat);
    bowGroup.add(leftWing, rightWing, centerKnot);
    headGroup.add(bowGroup);
  } else if (appearance.accessory === 'flower_clip') {
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(-0.44, 0.38, 0.32);
    flowerGroup.rotation.y = -0.5;

    // Center
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.3 });
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.2 })
    );
    flowerGroup.add(center);

    for (let p = 0; p < 5; p++) {
      const angle = (p / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), petalMat);
      petal.scale.set(1, 1.4, 0.4);
      petal.position.set(Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0);
      flowerGroup.add(petal);
    }
    headGroup.add(flowerGroup);
  } else if (appearance.accessory === 'sunglasses_head') {
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.42, 0.42);
    glassesGroup.rotation.x = -0.45;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.2 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.1, metalness: 0.8 });

    const leftRim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 10, 20), frameMat);
    leftRim.position.x = -0.2;
    const leftLens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 18), lensMat);
    leftLens.rotation.x = Math.PI / 2;
    leftLens.position.x = -0.2;

    const rightRim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 10, 20), frameMat);
    rightRim.position.x = 0.2;
    const rightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 18), lensMat);
    rightLens.rotation.x = Math.PI / 2;
    rightLens.position.x = 0.2;

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), frameMat);

    glassesGroup.add(leftRim, leftLens, rightRim, rightLens, bridge);
    headGroup.add(glassesGroup);
  }

  root.add(headGroup);

  // Controller state
  let blinkTimer = 0;
  let nextBlinkTime = 2.5 + Math.random() * 2.5;
  let isBlinking = false;
  let happyBounce = 0;

  const update = (delta: number, elapsedTime: number) => {
    // 1. Natural blinking
    blinkTimer += delta;
    if (!isBlinking && blinkTimer >= nextBlinkTime) {
      isBlinking = true;
      blinkTimer = 0;
    }

    if (isBlinking) {
      // Eyelid closes and opens
      const blinkProgress = blinkTimer / 0.16; // 160ms blink
      if (blinkProgress <= 0.5) {
        // Closing: rotation from -PI/2 to 0
        const rot = THREE.MathUtils.lerp(-Math.PI / 2, 0, blinkProgress * 2);
        leftEyeData.eyelid.rotation.x = rot;
        rightEyeData.eyelid.rotation.x = rot;
      } else if (blinkProgress <= 1.0) {
        // Opening: rotation from 0 back to -PI/2
        const rot = THREE.MathUtils.lerp(0, -Math.PI / 2, (blinkProgress - 0.5) * 2);
        leftEyeData.eyelid.rotation.x = rot;
        rightEyeData.eyelid.rotation.x = rot;
      } else {
        isBlinking = false;
        leftEyeData.eyelid.rotation.x = -Math.PI / 2;
        rightEyeData.eyelid.rotation.x = -Math.PI / 2;
        nextBlinkTime = 3.0 + Math.random() * 3.0;
        blinkTimer = 0;
      }
    }

    // 2. Gentle idle breathing and head tilt
    const breath = Math.sin(elapsedTime * 2.2) * 0.015;
    bodyGroup.position.y = 0.55 + breath;
    headGroup.position.y = 1.42 + breath * 1.5;
    headGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.05;
    headGroup.rotation.z = Math.cos(elapsedTime * 1.1) * 0.02;

    // 3. Happy bounce on serve
    if (happyBounce > 0) {
      happyBounce -= delta * 3;
      const jump = Math.abs(Math.sin(happyBounce * Math.PI * 4)) * 0.18;
      root.position.y += jump;
      headGroup.rotation.x = -0.15 * Math.sin(happyBounce * Math.PI * 3);
    }
  };

  const triggerHappy = () => {
    happyBounce = 1.0;
  };

  return {
    group: root,
    headGroup,
    leftEyelid: leftEyeData.eyelid,
    rightEyelid: rightEyeData.eyelid,
    blinkTimer,
    nextBlinkTime,
    isBlinking,
    happyBounce,
    update,
    triggerHappy,
  };
}
