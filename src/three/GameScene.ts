import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BuiltItem, ContainerType, FlavorId, IceCreamOrder, ToppingId } from '../types/game';
import {
  createRealisticStoreRoom,
  createRealisticServiceCounter,
  createRealisticFlavorWells,
  createRealisticBananaMachine,
  createRealisticSyrupRack,
  createRealisticToppingBowls,
  createRealisticContainerDispenser,
  createRealisticServiceBell,
  createRealisticTrashBin,
  createWaffleTexture,
} from './realisticStoreEnvironment';
import {
  createWhippedCreamMesh,
  createCherryMesh,
} from './cartoonStoreAssets';
import { createRealisticHumanCustomer, RealisticHumanController } from './realisticHumanCustomer';
import { createPanoramicHillLandscape, PanoramicHillController } from './panoramicHill';
import { createRealisticScoopMesh } from './realisticFlavorTextures';
import { FLAVORS } from '../game/orderManager';

export interface SceneInteractionCallbacks {
  onSelectFlavor?: (flavorId: FlavorId) => void;
  onSelectTopping?: (toppingId: ToppingId) => void;
  onSelectContainer?: (container: ContainerType) => void;
  onBlendMachine?: () => void;
  onClearTray?: () => void;
  onServe?: () => void;
}

export class GameScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;

  private targetCameraPos = new THREE.Vector3(0, 3.4, 6.0);
  private targetCameraLook = new THREE.Vector3(0, 1.05, 0.1);
  private isTransitioningCamera = false;

  private panoramicHill: PanoramicHillController | null = null;

  private customerContainer: THREE.Group;
  private humanCustomers: Map<string, {
    controller: RealisticHumanController;
    targetX: number;
    targetZ: number;
    currentX: number;
    currentZ: number;
  }> = new Map();

  // NEW: 3D order previews that float above each customer's head
  private orderPreviewContainer: THREE.Group;
  private orderPreviews: Map<string, THREE.Group> = new Map();

  private activeItemRoot: THREE.Group;

  private milkshakeMachine: THREE.Group;
  private isMachineBlending = false;
  private blendTimer = 0;

  private interactiveObjects: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  public callbacks: SceneInteractionCallbacks = {};

  private particleGroup: THREE.Group;
  private activeParticles: Array<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }> = [];

  constructor(container: HTMLElement, callbacks: SceneInteractionCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xE0F2FE);
    this.scene.fog = new THREE.FogExp2(0xE0F2FE, 0.006);

    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 120);
    this.camera.position.set(0, 3.4, 6.0);
    this.camera.lookAt(0, 1.05, 0.1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 1.05, 0.1);
    this.controls.minDistance = 2.4;
    this.controls.maxDistance = 12.0;
    this.controls.minPolarAngle = Math.PI * 0.10;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.minAzimuthAngle = -Math.PI * 0.42;
    this.controls.maxAzimuthAngle = Math.PI * 0.42;

    this.setupLighting();
    this.buildRealisticShop();

    this.customerContainer = new THREE.Group();
    this.scene.add(this.customerContainer);

    // NEW: Container for 3D order previews
    this.orderPreviewContainer = new THREE.Group();
    this.scene.add(this.orderPreviewContainer);

    this.activeItemRoot = new THREE.Group();
    this.activeItemRoot.position.set(0, 1.03, -0.5);
    this.scene.add(this.activeItemRoot);

    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);

    this.animate();
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(0xFFFBEB, 1.2);
    this.scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xBAE6FD, 0xD97706, 0.85);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    sunLight.position.set(4.5, 7.5, 5.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xFEF08A, 0.7);
    rimLight.position.set(-4, 5, -4);
    this.scene.add(rimLight);
  }

  private buildRealisticShop() {
    this.panoramicHill = createPanoramicHillLandscape();
    this.scene.add(this.panoramicHill.group);

    const shopRoot = new THREE.Group();

    const room = createRealisticStoreRoom();
    shopRoot.add(room);

    const counter = createRealisticServiceCounter();
    shopRoot.add(counter);

    const prepMatGeom = new THREE.BoxGeometry(0.82, 0.02, 0.62);
    const prepMatMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, roughness: 0.45 });
    const prepMat = new THREE.Mesh(prepMatGeom, prepMatMat);
    prepMat.position.set(0, 1.02, 0.35);
    prepMat.receiveShadow = true;
    shopRoot.add(prepMat);

    const bell = createRealisticServiceBell();
    bell.position.set(0.72, 1.02, 0.42);
    shopRoot.add(bell);
    this.interactiveObjects.push(bell);

    const flavorWells = createRealisticFlavorWells();
    flavorWells.position.set(1.5, 1.02, 0.25);
    shopRoot.add(flavorWells);
    flavorWells.children.forEach(child => {
      if (child.userData && child.userData.action === 'scoop') {
        this.interactiveObjects.push(child);
      }
    });

    this.milkshakeMachine = createRealisticBananaMachine();
    this.milkshakeMachine.position.set(-2.0, 1.02, 0.18);
    shopRoot.add(this.milkshakeMachine);
    this.interactiveObjects.push(this.milkshakeMachine);

    const containerDispenser = createRealisticContainerDispenser();
    containerDispenser.position.set(-2.95, 1.02, 0.22);
    shopRoot.add(containerDispenser);
    containerDispenser.children.forEach(child => {
      if (child.userData && child.userData.action === 'container') {
        this.interactiveObjects.push(child);
      }
    });

    const syrupRack = createRealisticSyrupRack();
    syrupRack.position.set(2.7, 1.02, 0.05);
    shopRoot.add(syrupRack);
    syrupRack.children.forEach(child => {
      if (child.userData && child.userData.action === 'topping') {
        this.interactiveObjects.push(child);
      }
    });

    const toppingBowls = createRealisticToppingBowls();
    toppingBowls.position.set(2.7, 1.02, 0.45);
    shopRoot.add(toppingBowls);
    toppingBowls.children.forEach(child => {
      if (child.userData && child.userData.action === 'topping') {
        this.interactiveObjects.push(child);
      }
    });

    const trashBin = createRealisticTrashBin();
    trashBin.position.set(3.4, 0.0, 0.5);
    shopRoot.add(trashBin);
    this.interactiveObjects.push(trashBin);

    this.scene.add(shopRoot);
  }

  public setCameraPreset(preset: 'parlor' | 'counter' | 'customers') {
    this.isTransitioningCamera = true;
    if (preset === 'parlor') {
      this.targetCameraPos.set(0, 3.4, 6.0);
      this.targetCameraLook.set(0, 1.05, 0.1);
    } else if (preset === 'counter') {
      this.targetCameraPos.set(0, 1.85, 2.6);
      this.targetCameraLook.set(0, 1.05, 0.3);
    } else {
      this.targetCameraPos.set(0, 2.2, 4.4);
      this.targetCameraLook.set(0, 1.55, -0.85);
    }
  }

  public updateCustomers(queue: IceCreamOrder[]) {
    const activeIds = new Set(queue.map(q => q.id));

    for (const [id, data] of this.humanCustomers.entries()) {
      if (!activeIds.has(id)) {
        this.customerContainer.remove(data.controller.group);
        this.humanCustomers.delete(id);
      }
    }

    queue.forEach((order, index) => {
      let targetX = 0.0;
      let targetZ = -0.85;

      if (index === 0) {
        targetX = 0.0;
        targetZ = -0.85;
      } else {
        targetX = 1.35 + (index - 1) * 0.8;
        targetZ = -2.1 - (index - 1) * 0.85;
      }

      if (this.humanCustomers.has(order.id)) {
        const entry = this.humanCustomers.get(order.id)!;
        entry.targetX = targetX;
        entry.targetZ = targetZ;
      } else {
        const controller = createRealisticHumanCustomer(order.appearance);
        const startX = targetX + 2.5;
        const startZ = targetZ - 1.2;
        controller.group.position.set(startX, 0.0, startZ);
       

        this.customerContainer.add(controller.group);
        this.humanCustomers.set(order.id, {
          controller,
          targetX,
          targetZ,
          currentX: startX,
          currentZ: startZ,
        });
      }
    });
  }

  public triggerCustomerHappy(orderId: string) {
    const entry = this.humanCustomers.get(orderId);
    if (entry) {
      entry.controller.triggerHappy();
    }
  }

  // ------------------------------------------------------------------
  // NEW: 3D Floating Order Preview
  // ------------------------------------------------------------------
  private buildOrderPreviewMesh(order: IceCreamOrder): THREE.Group {
    const g = new THREE.Group();
    g.scale.set(0.55, 0.55, 0.55);

    let topY = 0;

    if (order.isMilkshake || order.container === 'milkshake_glass') {
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.5,
        transmission: 0.9,
        roughness: 0.05,
      });
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.15, 0.6, 20),
        glassMat
      );
      glass.position.y = 0.3;
      g.add(glass);

      const flv = FLAVORS.find(f => f.id === (order.milkshakeFlavor || order.scoops[0]));
      const shakeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(flv?.color || '#FDE047'),
        roughness: 0.3,
      });
      const shake = new THREE.Mesh(
        new THREE.CylinderGeometry(0.21, 0.14, 0.55, 20),
        shakeMat
      );
      shake.position.y = 0.28;
      g.add(shake);

      const straw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.8, 10),
        new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 })
      );
      straw.position.set(0.06, 0.5, 0.04);
      straw.rotation.z = -0.22;
      g.add(straw);

      topY = 0.6;
    } else if (order.container === 'waffle_cone') {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.62, 20, 1, true),
        new THREE.MeshStandardMaterial({ map: createWaffleTexture(), roughness: 0.45 })
      );
      cone.rotation.x = Math.PI;
      cone.position.y = 0.31;
      g.add(cone);
      topY = 0.62;
    } else {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.19, 0.3, 20),
        new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3 })
      );
      cup.position.y = 0.15;
      g.add(cup);
      topY = 0.3;
    }

    if (!order.isMilkshake) {
      order.scoops.forEach((flv, idx) => {
        const scoop = createRealisticScoopMesh(flv);
        scoop.scale.set(0.62, 0.62, 0.62);
        scoop.position.y = topY + idx * 0.28;
        scoop.rotation.y = idx * 1.3;
        g.add(scoop);
      });
      topY += Math.max(0, order.scoops.length - 1) * 0.28 + 0.26;
    }

    if (order.toppings.includes('whipped_cream')) {
      const cream = createWhippedCreamMesh();
      cream.scale.set(0.55, 0.55, 0.55);
      cream.position.y = topY;
      g.add(cream);
    }

    if (order.toppings.includes('cherry')) {
      const cherry = createCherryMesh();
      cherry.scale.set(0.6, 0.6, 0.6);
      cherry.position.y = topY + (order.toppings.includes('whipped_cream') ? 0.38 : 0.12);
      g.add(cherry);
    }

    return g;
  }

  // Sync 3D previews with queue: only the active (index 0) customer shows a preview.
  public updateOrderPreviews(queue: IceCreamOrder[]) {
    const activeIds = new Set(queue.map(q => q.id));

    for (const [id, group] of this.orderPreviews.entries()) {
      if (!activeIds.has(id)) {
        this.orderPreviewContainer.remove(group);
        this.orderPreviews.delete(id);
      }
    }

    queue.forEach((order, index) => {
      if (index !== 0) {
        const existing = this.orderPreviews.get(order.id);
        if (existing) existing.visible = false;
        return;
      }

      let preview = this.orderPreviews.get(order.id);
      if (!preview) {
        preview = this.buildOrderPreviewMesh(order);
        this.orderPreviewContainer.add(preview);
        this.orderPreviews.set(order.id, preview);
      }
      preview.visible = true;
    });
  }

  // ------------------------------------------------------------------
  // Active item on the prep mat
  // ------------------------------------------------------------------
  public updateBuiltItem(item: BuiltItem) {
    while (this.activeItemRoot.children.length > 0) {
      this.activeItemRoot.remove(this.activeItemRoot.children[0]);
    }

    const group = new THREE.Group();

    if (item.container === 'milkshake_glass' || item.isMilkshake) {
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.55,
        transmission: 0.9,
        roughness: 0.05,
      });
      const glassGeom = new THREE.CylinderGeometry(0.24, 0.16, 0.68, 24);
      const glass = new THREE.Mesh(glassGeom, glassMat);
      glass.position.y = 0.34;
      group.add(glass);

      const flv = item.milkshakeFlavor || item.scoops[0] || 'vanilla';
      const flvInfo = FLAVORS.find(f => f.id === flv);
      const shakeColor = flvInfo ? flvInfo.color : '#FEF9C3';

      const liquidMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(shakeColor),
        roughness: 0.25,
      });
      const liquidGeom = new THREE.CylinderGeometry(0.23, 0.15, 0.62, 24);
      const liquid = new THREE.Mesh(liquidGeom, liquidMat);
      liquid.position.y = 0.32;
      group.add(liquid);

      if (item.toppings.includes('whipped_cream')) {
        const cream = createWhippedCreamMesh();
        cream.position.y = 0.68;
        group.add(cream);
      }

      const strawGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 12);
      const strawMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 });
      const straw = new THREE.Mesh(strawGeom, strawMat);
      straw.position.set(0.06, 0.52, 0.04);
      straw.rotation.z = -0.22;
      group.add(straw);

      if (item.toppings.includes('cherry')) {
        const cherry = createCherryMesh();
        cherry.position.set(0, item.toppings.includes('whipped_cream') ? 1.05 : 0.72, 0);
        group.add(cherry);
      }

      if (item.toppings.includes('sprinkles')) {
        this.addSprinklesToGroup(group, item.toppings.includes('whipped_cream') ? 0.9 : 0.65);
      }

      if (item.toppings.includes('chocolate_sauce')) {
        this.addDrizzleToGroup(group, 0.68, '#451A03');
      }

      if (item.toppings.includes('strawberry_syrup')) {
        this.addDrizzleToGroup(group, 0.68, '#E11D48');
      }
    } else {
      let currentY = 0;

      if (item.container === 'waffle_cone') {
        const coneGeom = new THREE.ConeGeometry(0.28, 0.72, 24, 1, true);
        const waffleMat = new THREE.MeshStandardMaterial({
          map: createWaffleTexture(),
          roughness: 0.45,
        });
        const cone = new THREE.Mesh(coneGeom, waffleMat);
        cone.rotation.x = Math.PI;
        cone.position.y = 0.36;
        group.add(cone);
        currentY = 0.72;
      } else {
        const cupGeom = new THREE.CylinderGeometry(0.3, 0.22, 0.34, 24);
        const cupMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3 });
        const cup = new THREE.Mesh(cupGeom, cupMat);
        cup.position.y = 0.17;
        group.add(cup);
        currentY = 0.34;
      }

      item.scoops.forEach((flavorId, idx) => {
        const scoop = createRealisticScoopMesh(flavorId);
        scoop.scale.set(0.72, 0.72, 0.72);
        const scoopY = currentY + idx * 0.34;
        scoop.position.set(0, scoopY, 0);
        scoop.rotation.y = idx * 1.3;
        group.add(scoop);
      });

      const topY = currentY + (item.scoops.length - 1) * 0.34 + 0.3;

      if (item.toppings.includes('whipped_cream')) {
        const cream = createWhippedCreamMesh();
        cream.scale.set(0.65, 0.65, 0.65);
        cream.position.y = topY;
        group.add(cream);
      }

      if (item.toppings.includes('chocolate_sauce')) {
        this.addDrizzleToGroup(group, topY, '#451A03');
      }

      if (item.toppings.includes('strawberry_syrup')) {
        this.addDrizzleToGroup(group, topY, '#E11D48');
      }

      if (item.toppings.includes('sprinkles')) {
        this.addSprinklesToGroup(group, topY + 0.06);
      }

      if (item.toppings.includes('cherry')) {
        const cherry = createCherryMesh();
        cherry.scale.set(0.7, 0.7, 0.7);
        const cherryY = item.toppings.includes('whipped_cream') ? topY + 0.45 : topY + 0.1;
        cherry.position.set(0, cherryY, 0);
        group.add(cherry);
      }
    }

    this.activeItemRoot.add(group);
  }

  private addDrizzleToGroup(group: THREE.Group, topY: number, color: string) {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.15,
      metalness: 0.1,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dripGeom = new THREE.CylinderGeometry(0.025, 0.014, 0.24, 8);
      const drip = new THREE.Mesh(dripGeom, mat);
      drip.position.set(Math.cos(angle) * 0.28, topY - 0.06, Math.sin(angle) * 0.28);
      drip.rotation.x = Math.PI / 6;
      group.add(drip);
    }
  }

  private addSprinklesToGroup(group: THREE.Group, topY: number) {
    const colors = [0xEF4444, 0xFACC15, 0x3B82F6, 0x10B981, 0xEC4899, 0xFFFFFF];
    for (let i = 0; i < 20; i++) {
      const color = colors[i % colors.length];
      const sprinkleGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.06, 6);
      const sprinkle = new THREE.Mesh(sprinkleGeom, new THREE.MeshBasicMaterial({ color }));
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.24;
      sprinkle.position.set(Math.cos(angle) * r, topY + Math.random() * 0.08, Math.sin(angle) * r);
      sprinkle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      group.add(sprinkle);
    }
  }

  public triggerMilkshakeBlend(durationSeconds = 1.2) {
    this.isMachineBlending = true;
    this.blendTimer = durationSeconds;
    this.spawnSparkleBurst(new THREE.Vector3(-2.0, 1.5, 0.18), 20, 0xFACC15);
  }

  public spawnSparkleBurst(position: THREE.Vector3, count = 18, primaryColor = 0xF472B6) {
    const starGeom = new THREE.OctahedronGeometry(0.06, 0);
    const colors = [primaryColor, 0xFACC15, 0x6EE7B7, 0x93C5FD, 0xFFFFFF];

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mesh = new THREE.Mesh(starGeom, new THREE.MeshBasicMaterial({ color }));
      mesh.position.copy(position);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2.5,
        Math.random() * 2.8 + 1.2,
        (Math.random() - 0.5) * 2.5
      );

      this.particleGroup.add(mesh);
      this.activeParticles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4,
      });
    }
  }

  private onPointerMove(event: PointerEvent) {
    if (!this.container) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  private onPointerDown(event: PointerEvent) {
    if (!this.container) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj && obj !== this.scene) {
          if (obj.userData && obj.userData.action) {
            const data = obj.userData;
            if (data.action === 'scoop' && data.flavorId) {
              this.spawnSparkleBurst(hit.point, 10, 0xF472B6);
              this.callbacks.onSelectFlavor?.(data.flavorId as FlavorId);
              return;
            } else if (data.action === 'blend') {
              this.callbacks.onBlendMachine?.();
              return;
            } else if (data.action === 'topping' && data.toppingId) {
              this.spawnSparkleBurst(hit.point, 8, 0xFBBF24);
              this.callbacks.onSelectTopping?.(data.toppingId as ToppingId);
              return;
            } else if (data.action === 'container' && data.container) {
              this.spawnSparkleBurst(hit.point, 8, 0x38BDF8);
              this.callbacks.onSelectContainer?.(data.container as ContainerType);
              return;
            } else if (data.action === 'serve') {
              this.spawnSparkleBurst(hit.point, 15, 0xFACC15);
              this.callbacks.onServe?.();
              return;
            } else if (data.action === 'trash') {
              this.callbacks.onClearTray?.();
              return;
            }
          }
          obj = obj.parent;
        }
      }
    }
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (this.panoramicHill) {
      this.panoramicHill.update(delta, elapsedTime);
    }

    if (this.isTransitioningCamera) {
      this.camera.position.lerp(this.targetCameraPos, Math.min(delta * 4, 1));
      this.controls.target.lerp(this.targetCameraLook, Math.min(delta * 4, 1));
      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.05) {
        this.isTransitioningCamera = false;
      }
    }

    this.controls.update();

    // Customers
    for (const [, entry] of this.humanCustomers.entries()) {
      const dx = entry.targetX - entry.currentX;
      const dz = entry.targetZ - entry.currentZ;
      entry.currentX += dx * Math.min(delta * 4.2, 1);
      entry.currentZ += dz * Math.min(delta * 4.2, 1);

      entry.controller.group.position.x = entry.currentX;
      entry.controller.group.position.z = entry.currentZ;

      entry.controller.update(delta, elapsedTime);
    }

    // NEW: Float the 3D order previews above customer heads and face the camera
    for (const [id, preview] of this.orderPreviews.entries()) {
      if (!preview.visible) continue;
      const entry = this.humanCustomers.get(id);
      if (!entry) continue;
      preview.position.set(
        entry.currentX,
        2.55 + Math.sin(elapsedTime * 2) * 0.05,
        entry.currentZ
      );
      preview.lookAt(this.camera.position.x, preview.position.y, this.camera.position.z);
    }

    // Banana machine vibration
    if (this.isMachineBlending) {
      this.blendTimer -= delta;
      const shakeAmount = 0.03;
      this.milkshakeMachine.position.x = -2.0 + (Math.random() - 0.5) * shakeAmount;
      this.milkshakeMachine.position.z = 0.18 + (Math.random() - 0.5) * shakeAmount;

      if (this.blendTimer <= 0) {
        this.isMachineBlending = false;
        this.milkshakeMachine.position.set(-2.0, 1.02, 0.18);
      }
    }

    // Particles
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        this.particleGroup.remove(p.mesh);
        this.activeParticles.splice(i, 1);
      } else {
        p.velocity.y -= 4.2 * delta;
        p.mesh.position.addScaledVector(p.velocity, delta);
        p.mesh.rotation.x += 4 * delta;
        p.mesh.rotation.y += 4 * delta;
        const progress = p.life / p.maxLife;
        const scale = 1 - progress;
        p.mesh.scale.set(scale, scale, scale);
      }
    }

    if (this.activeItemRoot.children.length > 0) {
      this.activeItemRoot.position.y = 1.03 + Math.sin(elapsedTime * 3) * 0.008;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
