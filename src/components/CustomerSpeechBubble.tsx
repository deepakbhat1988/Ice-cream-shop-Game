import React from 'react';
import { IceCreamOrder } from '../types/game';
import { FLAVORS, TOPPINGS } from '../game/orderManager';
import { Heart } from 'lucide-react';
import {
  WaffleConeIcon,
  SundaeCupIcon,
  MilkshakeGlassIcon,
  ContainerVisual,
  FlavorVisual,
  ToppingVisual,
} from './ChildVisualIcons';

interface CustomerSpeechBubbleProps {
  currentOrder: IceCreamOrder | null;
  queueLength: number;
}

export const CustomerSpeechBubble: React.FC<CustomerSpeechBubbleProps> = ({ currentOrder, queueLength }) => {
  if (!currentOrder) {
    return (
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-2 border-pink-200 text-pink-700 font-semibold text-sm animate-pulse flex items-center gap-2">
        <span>🍓 Waiting for the next customer to step up...</span>
      </div>
    );
  }

  const patienceRatio = currentOrder.remainingPatienceSeconds / currentOrder.totalPatienceSeconds;
  const isUrgent = patienceRatio < 0.3;

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[92%] max-w-md pointer-events-none z-10 transition-all duration-300">
      {/* Main Order Bubble */}
      <div className={`relative bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border-4 transition-all duration-300 pointer-events-auto ${
        isUrgent ? 'border-rose-400 ring-4 ring-rose-200 animate-squish' : 'border-pink-300'
      }`}>
        {/* Pointer Triangle pointing down to Strawberry Customer */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-pink-300" />

        {/* Customer Header & Patience */}
        <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍓</span>
            <div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight">{currentOrder.customerName}</h3>
              <p className="text-[11px] text-pink-500 font-medium">
                {currentOrder.isMilkshake ? '🍌 Banana Milkshake Order' : '🍦 Custom Scoop Order'}
              </p>
            </div>
          </div>

          {/* Hearts Patience Indicator */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: currentOrder.maxHearts }).map((_, i) => {
                const filled = i < currentOrder.currentHearts;
                return (
                  <Heart
                    key={i}
                    size={18}
                    className={`transition-all duration-300 ${
                      filled
                        ? isUrgent
                          ? 'fill-rose-500 text-rose-500 animate-bounce'
                          : 'fill-pink-500 text-pink-500'
                        : 'fill-gray-200 text-gray-300 scale-90'
                    }`}
                  />
                );
              })}
            </div>
            {/* Smooth bar */}
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  isUrgent ? 'bg-rose-500' : 'bg-pink-400'
                }`}
                style={{ width: `${Math.max(5, patienceRatio * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Order Requirements Recipe Cards - 100% Visual for Kids! */}
        <div className="flex items-center gap-3">
          {/* Target Container Badge: Actual Cone / Cup / Glass Graphic */}
          <div className="flex flex-col items-center justify-center bg-pink-50 border-2 border-pink-300 rounded-2xl p-2 min-w-[76px] shadow-sm">
            <ContainerVisual type={currentOrder.container} size={42} />
          </div>

          {/* Target Ingredients: Scoops & Toppings (Pure visual!) */}
          <div className="flex-1">
            {currentOrder.isMilkshake ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {currentOrder.milkshakeFlavor && (
                    <div className="flex items-center gap-1.5 p-1 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs">
                      <FlavorVisual flavorId={currentOrder.milkshakeFlavor} size={36} />
                      <span className="text-sm">🌀</span>
                    </div>
                  )}
                </div>
                {/* Milkshake Toppings */}
                {currentOrder.toppings.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {currentOrder.toppings.map(tId => (
                      <div key={tId} className="p-0.5 rounded-xl border border-yellow-300 bg-yellow-50 shadow-2xs">
                        <ToppingVisual toppingId={tId} size={32} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Scoops bottom-to-top */}
                <div className="flex items-center gap-2 flex-wrap">
                  {currentOrder.scoops.map((sId, idx) => (
                    <div key={idx} className="relative">
                      <FlavorVisual flavorId={sId} size={38} />
                      <span className="absolute -bottom-1 -right-1 bg-black/75 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Toppings list */}
                {currentOrder.toppings.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {currentOrder.toppings.map(tId => (
                      <div key={tId} className="p-0.5 rounded-xl border border-pink-300 bg-pink-50 shadow-2xs">
                        <ToppingVisual toppingId={tId} size={32} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Queue Info Chip */}
      {queueLength > 1 && (
        <div className="mt-1.5 flex justify-center">
          <div className="bg-pink-600/90 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow flex items-center gap-1 backdrop-blur-sm">
            <span>🍓 +{queueLength - 1} cute berries waiting in line</span>
          </div>
        </div>
      )}
    </div>
  );
};
