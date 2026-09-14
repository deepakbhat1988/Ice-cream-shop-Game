import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BuiltItem, ContainerType, FlavorId, GameStats, IceCreamOrder, ScoreBreakdown, ToppingId } from './types/game';
import { evaluateOrder, generateOrder } from './game/orderManager';
import { GameScene } from './three/GameScene';
import { sounds } from './audio/soundManager';
import { CustomerOrderTickets } from './components/CustomerOrderTickets';
import { PreparationStation } from './components/PreparationStation';
import { GameHUD } from './components/GameHUD';
import { DaySummaryModal } from './components/DaySummaryModal';
import { RecipeHelpModal } from './components/RecipeHelpModal';
import { ServingFeedback } from './components/ServingFeedback';
import { CameraControls } from './components/CameraControls';
import confetti from 'canvas-confetti';
import { Play, Sparkles } from 'lucide-react';

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const gameSceneRef = useRef<GameScene | null>(null);

  // Sound Mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getIsMuted());

  // Help Modal
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Active Score Toast
  const [servingScore, setServingScore] = useState<ScoreBreakdown | null>(null);

  // Camera preset view ('parlor' by default for zoomed out 3D view)
  const [cameraView, setCameraView] = useState<'parlor' | 'counter' | 'customers'>('parlor');

  const handleCameraChange = (view: 'parlor' | 'counter' | 'customers') => {
    setCameraView(view);
    gameSceneRef.current?.setCameraPreset(view);
  };

  // Initial built item default
  const defaultBuiltItem: BuiltItem = {
    container: 'waffle_cone',
    scoops: [],
    toppings: [],
    isMilkshake: false,
  };

  const [builtItem, setBuiltItem] = useState<BuiltItem>(defaultBuiltItem);

  // Customer Queue (3 at counter bays + queue line)
  const [customerQueue, setCustomerQueue] = useState<IceCreamOrder[]>([]);
  const [activeOrderIndex, setActiveOrderIndex] = useState<number>(0);
  const customerCounterRef = useRef<number>(0);

  // Game Stats
  const [stats, setStats] = useState<GameStats>({
    day: 1,
    score: 0,
    coins: 0,
    combo: 0,
    maxCombo: 0,
    customersServed: 0,
    perfectOrders: 0,
    angryCustomers: 0,
    timeLeft: 90,
    isShiftActive: false,
    isDayComplete: false,
    isGameOver: false,
  });

  // 1. Initialize Three.js Game Scene
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const scene = new GameScene(canvasContainerRef.current);
    gameSceneRef.current = scene;

    return () => {
      scene.dispose();
      gameSceneRef.current = null;
    };
  }, []);

  // Update 3D Scene Callbacks dynamically so they always have current state & handlers
  useEffect(() => {
    if (!gameSceneRef.current) return;
    gameSceneRef.current.callbacks = {
      onSelectFlavor: (flavorId: FlavorId) => {
        setBuiltItem(prev => {
          if (prev.isMilkshake) {
            sounds.playPop(520);
            return { ...prev, milkshakeFlavor: flavorId, isBlended: false };
          }
          if (prev.scoops.length >= 3) {
            sounds.playPop(300);
            return prev;
          }
          sounds.playScoop();
          return { ...prev, scoops: [...prev.scoops, flavorId] };
        });
      },
      onSelectTopping: (toppingId: ToppingId) => {
        sounds.playTopping();
        setBuiltItem(prev => {
          const exists = prev.toppings.includes(toppingId);
          return {
            ...prev,
            toppings: exists
              ? prev.toppings.filter(t => t !== toppingId)
              : [...prev.toppings, toppingId],
          };
        });
      },
      onSelectContainer: (container: ContainerType) => {
        sounds.playPop(480);
        const isMilkshake = container === 'milkshake_glass';
        setBuiltItem(prev => ({
          ...prev,
          container,
          isMilkshake,
          scoops: isMilkshake ? [] : prev.scoops,
          isBlended: false,
        }));
      },
      onBlendMachine: () => {
        handleBlendMilkshake();
      },
      onClearTray: () => {
        handleClearTray();
      },
      onServe: () => {
        handleServe();
      },
    };
  });

  // Sync 3D Scene with Customer Queue
  useEffect(() => {
    if (gameSceneRef.current) {
      gameSceneRef.current.updateCustomers(customerQueue);
    }
  }, [customerQueue]);

  // Sync 3D Scene with Active Built Item on the Tray
  useEffect(() => {
    if (gameSceneRef.current) {
      gameSceneRef.current.updateBuiltItem(builtItem);
    }
  }, [builtItem]);

  // Start / Reset Shift
  const startDayShift = (dayNum = 1) => {
    sounds.playPop(580);
    // Generate initial queue of customers for 3 bays + buffer
    const initialQueue: IceCreamOrder[] = [];
    for (let i = 0; i < 5; i++) {
      initialQueue.push(generateOrder(dayNum, customerCounterRef.current++, i));
    }

    setCustomerQueue(initialQueue);
    setActiveOrderIndex(0);
    setBuiltItem(defaultBuiltItem);
    setServingScore(null);
    setStats({
      day: dayNum,
      score: 0,
      coins: 0,
      combo: 0,
      maxCombo: 0,
      customersServed: 0,
      perfectOrders: 0,
      angryCustomers: 0,
      timeLeft: 90,
      isShiftActive: true,
      isDayComplete: false,
      isGameOver: false,
    });
  };

  // Main Shift Timer & Customer Patience Loop
  useEffect(() => {
    if (!stats.isShiftActive || stats.isDayComplete) return;

    const interval = setInterval(() => {
      // 1. Decrement shift time
      setStats(prev => {
        const nextTime = prev.timeLeft - 1;
        if (nextTime <= 0) {
          return {
            ...prev,
            timeLeft: 0,
            isShiftActive: false,
            isDayComplete: true,
          };
        }
        return { ...prev, timeLeft: nextTime };
      });

      // 2. Decrement patience for the active customer at the counter (one customer at a time)
      setCustomerQueue(prevQueue => {
        if (prevQueue.length === 0) return prevQueue;

        let hadAngryCustomer = false;
        const updated = prevQueue.map((order, idx) => {
          // Strictly the single active customer at the counter loses patience
          if (idx === 0) {
            const nextPatience = order.remainingPatienceSeconds - 1;
            const heartRatio = nextPatience / order.totalPatienceSeconds;
            const currentHearts = Math.max(0, Math.ceil(heartRatio * order.maxHearts));

            if (nextPatience <= 0) {
              hadAngryCustomer = true;
            }

            return {
              ...order,
              remainingPatienceSeconds: nextPatience,
              currentHearts,
            };
          }
          return order;
        });

        if (hadAngryCustomer) {
          sounds.playAngrySigh();
          setStats(s => ({
            ...s,
            combo: 0,
            angryCustomers: s.angryCustomers + 1,
          }));

          // Filter out expired customers and add fresh ones
          const active = updated.filter(o => o.remainingPatienceSeconds > 0);
          while (active.length < 5) {
            active.push(generateOrder(stats.day, customerCounterRef.current++, active.length));
          }
          return active;
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stats.isShiftActive, stats.isDayComplete, stats.day]);

  // Handle Serving Current Built Item to Active Customer
  const handleServe = () => {
    if (customerQueue.length === 0) return;

    const targetIndex = Math.min(activeOrderIndex, customerQueue.length - 1);
    const activeOrder = customerQueue[targetIndex];
    sounds.playServeBell();

    const evaluation = evaluateOrder(activeOrder, builtItem, stats.combo);
    setServingScore(evaluation);

    if (evaluation.isPerfect) {
      sounds.playSuccessChime(true);
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.5 },
      });
      if (gameSceneRef.current) {
        gameSceneRef.current.spawnSparkleBurst(new THREE.Vector3(-0.25, 2.0, 0.35), 25, 0xFBBF24);
        gameSceneRef.current.triggerCustomerHappy(activeOrder.id);
      }
    } else if (evaluation.accuracyScore >= 60) {
      sounds.playSuccessChime(false);
      if (gameSceneRef.current) {
        gameSceneRef.current.spawnSparkleBurst(new THREE.Vector3(-0.25, 1.8, 0.35), 15, 0xF472B6);
        gameSceneRef.current.triggerCustomerHappy(activeOrder.id);
      }
    } else {
      sounds.playAngrySigh();
    }

    // Update Stats
    const nextCombo = evaluation.accuracyScore >= 75 ? stats.combo + 1 : 0;
    setStats(prev => ({
      ...prev,
      score: prev.score + evaluation.totalScore,
      coins: prev.coins + evaluation.tipEarned,
      combo: nextCombo,
      maxCombo: Math.max(prev.maxCombo, nextCombo),
      customersServed: prev.customersServed + 1,
      perfectOrders: prev.perfectOrders + (evaluation.isPerfect ? 1 : 0),
    }));

    // Remove served customer and advance line
    setCustomerQueue(prev => {
      const filtered = prev.filter(o => o.id !== activeOrder.id);
      const newOrder = generateOrder(stats.day, customerCounterRef.current++, filtered.length);
      return [...filtered, newOrder];
    });

    // Reset active order index safely
    setActiveOrderIndex(0);

    // Reset tray for next order
    setBuiltItem(defaultBuiltItem);
  };

  // Clear / Trash Current Item
  const handleClearTray = () => {
    sounds.playTrash();
    setBuiltItem(defaultBuiltItem);
  };

  // Blend Milkshake on Banana Machine
  const handleBlendMilkshake = () => {
    if (!builtItem.milkshakeFlavor) return;
    sounds.playBlender();
    if (gameSceneRef.current) {
      gameSceneRef.current.triggerMilkshakeBlend(1.2);
    }
    setBuiltItem(prev => ({
      ...prev,
      isBlended: true,
    }));
  };

  // Toggle Sound Mute
  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-sky-100 flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas Layer */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-pointer z-0" />

      {/* Top HUD: Shift Timer, Score, Coins, Audio, Recipe Book */}
      {stats.isShiftActive && (
        <GameHUD
          stats={stats}
          onToggleSound={handleToggleSound}
          isMuted={isMuted}
          onOpenHelp={() => setShowHelp(true)}
        />
      )}

      {/* 3D Camera Preset View Controls & Drag Orbit Indicator */}
      <CameraControls
        currentView={cameraView}
        onChangeView={handleCameraChange}
      />

      {/* Vertical Customer Order Tickets (Floating above customer heads, NEVER on face!) */}
      {stats.isShiftActive && !stats.isDayComplete && (
        <CustomerOrderTickets
          queue={customerQueue}
          activeOrderIndex={activeOrderIndex}
          onSelectOrder={setActiveOrderIndex}
        />
      )}

      {/* Serving Score Feedback Popup */}
      <ServingFeedback
        score={servingScore}
        onClear={() => setServingScore(null)}
      />

      {/* Bottom Preparation Counter Station */}
      {stats.isShiftActive && !stats.isDayComplete && (
        <PreparationStation
          builtItem={builtItem}
          onUpdateBuiltItem={setBuiltItem}
          onServe={handleServe}
          onClear={handleClearTray}
          onBlendMilkshake={handleBlendMilkshake}
        />
      )}

      {/* Welcome / Start Shift Screen (Shown before start) */}
      {!stats.isShiftActive && !stats.isDayComplete && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-pink-300 text-center flex flex-col items-center gap-4 animate-pop">
            <div className="w-20 h-20 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center text-4xl shadow-inner animate-float">
              🍨
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight leading-tight">
                Summer Ice Cream Cafe 3D
              </h1>
              <p className="text-xs sm:text-sm text-pink-600 font-semibold mt-1">
                Serve delicious cones, sundaes, & banana shakes to eager cafe customers!
              </p>
            </div>

            <div className="w-full bg-pink-50/80 rounded-2xl p-3 border border-pink-200 text-left text-xs text-gray-700 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span>🧇</span>
                <span>Select cones or sundae dishes & stack scoops</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍌</span>
                <span>Blend real fruit shakes at the banana station</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔔</span>
                <span>Check customer tickets above & ring the bell to serve</span>
              </div>
            </div>

            <button
              onClick={() => startDayShift(1)}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-105 shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={20} className="fill-white" />
              <span>OPEN SHOP (DAY 1)</span>
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Day End / Shift Complete Summary Modal */}
      {stats.isDayComplete && (
        <DaySummaryModal
          stats={stats}
          onNextDay={() => startDayShift(stats.day + 1)}
          onRestartDay={() => startDayShift(stats.day)}
        />
      )}

      {/* Recipe Help Handbook Modal */}
      {showHelp && (
        <RecipeHelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
