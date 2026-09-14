import React from 'react';
import { IceCreamOrder } from '../types/game';
import { FLAVORS, TOPPINGS } from '../game/orderManager';
import { Heart } from 'lucide-react';

interface CustomerOrderTicketsProps {
  queue: IceCreamOrder[];
  activeOrderIndex: number;
  onSelectOrder: (index: number) => void;
}

export const CustomerOrderTickets: React.FC<CustomerOrderTicketsProps> = ({
  queue,
  onSelectOrder,
}) => {
  // Strictly ONE customer at a time at the counter
  const activeOrder = queue[0];

  if (!activeOrder) {
    return null;
  }

  const patienceRatio = activeOrder.remainingPatienceSeconds / activeOrder.totalPatienceSeconds;
  const isUrgent = patienceRatio < 0.3;

  return (
    <div className="absolute top-12 sm:top-14 inset-x-0 w-full z-20 pointer-events-none flex justify-center">
      {/* 
        Positioned floating to the LEFT of the center customer without any frame or square box.
        Background is completely transparent, only the ice cream image itself is rendered!
      */}
      <div
        className="pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 select-none relative sm:absolute sm:right-[calc(50%+40px)] flex flex-col items-center bg-transparent"
        onClick={() => onSelectOrder(0)}
        title="Click to serve this order"
      >
        {/* Customer Patience Hearts - Frameless & Transparent */}
        <div className="flex items-center gap-1 mb-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-[11px] font-black text-white px-1.5 py-0.2 rounded-full bg-black/40 backdrop-blur-xs">
            {activeOrder.customerName}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 3 }).map((_, h) => {
              const heartFilled = h < Math.ceil(patienceRatio * 3);
              return (
                <Heart
                  key={h}
                  size={12}
                  className={
                    heartFilled
                      ? isUrgent
                        ? 'fill-rose-500 text-rose-500 animate-pulse'
                        : 'fill-rose-500 text-rose-500'
                      : 'fill-white/50 text-white/70'
                  }
                />
              );
            })}
          </div>
        </div>

        {/* 
          JUST THE ICE CREAM IMAGE ITSELF
          Completely transparent background, NO square box, NO frame, NO border.
        */}
        <div className="relative filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] flex flex-col items-center bg-transparent">
          {activeOrder.isMilkshake ? (
            // Milkshake Glass Image
            <div className="flex flex-col items-center bg-transparent">
              <div className="relative flex flex-col items-center">
                {/* Whipped cream & cherry */}
                <div className="flex items-center -space-x-1 -mb-1 z-20 text-sm filter drop-shadow-xs">
                  {activeOrder.toppings.includes('whipped_cream') && <span>☁️</span>}
                  {activeOrder.toppings.includes('cherry') && <span>🍒</span>}
                </div>

                {/* Frosted Shake Glass */}
                {(() => {
                  const flv = FLAVORS.find(f => f.id === activeOrder.milkshakeFlavor);
                  return (
                    <div
                      className="w-10 h-14 rounded-b-2xl border-2 border-white/80 shadow-md flex items-center justify-center relative overflow-hidden backdrop-blur-xs"
                      style={{ backgroundColor: flv?.color || '#FDE047' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-black/15" />
                      <span className="text-xs z-10 filter drop-shadow-xs">🍌</span>
                      {/* Straw */}
                      <div className="absolute -top-3 right-1.5 w-1.5 h-9 bg-gradient-to-b from-rose-500 via-white to-rose-500 rotate-12 shadow-xs" />
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            // Stacked Ice Cream Scoops on Cone / Dish
            <div className="flex flex-col items-center bg-transparent">
              <div className="flex flex-col-reverse items-center -space-y-2.5">
                {/* Container Base (Waffle Cone or Dish) */}
                {activeOrder.container === 'waffle_cone' ? (
                  <div className="relative flex flex-col items-center z-0 mt-0.5 filter drop-shadow-md">
                    {/* Waffle Cone SVG with crosshatch waffle texture */}
                    <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="2,2 32,2 17,40" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                      {/* Waffle Grid lines */}
                      <line x1="7" y1="2" x2="20" y2="32" stroke="#B45309" strokeWidth="1" strokeOpacity="0.7" />
                      <line x1="14" y1="2" x2="24" y2="24" stroke="#B45309" strokeWidth="1" strokeOpacity="0.7" />
                      <line x1="27" y1="2" x2="14" y2="32" stroke="#B45309" strokeWidth="1" strokeOpacity="0.7" />
                      <line x1="20" y1="2" x2="10" y2="24" stroke="#B45309" strokeWidth="1" strokeOpacity="0.7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-16 h-6 bg-gradient-to-b from-sky-100 to-sky-200 border-2 border-sky-400 rounded-b-xl shadow-md mt-0.5 flex items-center justify-center gap-1.5 z-0">
                    <span className="w-2 h-2 rounded-full bg-white/90 shadow-xs inline-block" />
                    <span className="w-2 h-2 rounded-full bg-white/90 shadow-xs inline-block" />
                    <span className="w-2 h-2 rounded-full bg-white/90 shadow-xs inline-block" />
                  </div>
                )}

                {/* Stacked Scoops */}
                {activeOrder.scoops.map((flvId, sIdx) => {
                  const flv = FLAVORS.find(f => f.id === flvId);
                  const isChocolate = flvId === 'chocolate';
                  const isStrawberry = flvId === 'strawberry';
                  const isVanilla = flvId === 'vanilla';
                  const isMint = flvId === 'mint';
                  const isMango = flvId === 'mango';
                  const isBlueberry = flvId === 'blueberry';

                  return (
                    <div
                      key={sIdx}
                      className="relative w-12 h-8 rounded-full border border-black/20 shadow-md flex items-center justify-center filter drop-shadow-xs"
                      style={{
                        backgroundColor: flv?.color || '#FEF9C3',
                        zIndex: 10 + sIdx,
                      }}
                      title={flv?.name}
                    >
                      {/* Chocolate scoop chips */}
                      {isChocolate && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1.5 left-2.5 w-2 h-1 bg-stone-950 rounded-xs rotate-12" />
                          <span className="absolute bottom-1.5 right-2.5 w-2 h-1 bg-stone-950 rounded-xs -rotate-45" />
                        </div>
                      )}

                      {/* Strawberry scoop seeds */}
                      {isStrawberry && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1.5 left-2.5 w-1 h-0.5 bg-yellow-300 rounded-full rotate-45" />
                          <span className="absolute bottom-1.5 right-2.5 w-1 h-0.5 bg-yellow-300 rounded-full -rotate-12" />
                          <span className="absolute bottom-1.5 left-3 w-2 h-1 bg-rose-800/80 rounded-xs" />
                        </div>
                      )}

                      {/* Vanilla bean specks */}
                      {isVanilla && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1.5 left-2.5 w-0.5 h-0.5 bg-stone-800 rounded-full" />
                          <span className="absolute bottom-1.5 right-2.5 w-0.5 h-0.5 bg-stone-800 rounded-full" />
                          <span className="absolute top-3 right-4 w-0.5 h-0.5 bg-stone-800 rounded-full" />
                        </div>
                      )}

                      {/* Mint choco flakes */}
                      {isMint && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1.5 left-2.5 w-2 h-0.5 bg-stone-900 rounded-xs rotate-45" />
                          <span className="absolute bottom-1.5 right-2.5 w-1.5 h-0.5 bg-stone-900 rounded-xs" />
                        </div>
                      )}

                      {/* Mango puree swirls */}
                      {isMango && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1 left-2.5 w-3 h-1 bg-amber-600/70 rounded-full rotate-12" />
                          <span className="absolute bottom-1 right-2.5 w-2.5 h-1 bg-amber-600/70 rounded-full -rotate-12" />
                        </div>
                      )}

                      {/* Blueberry fruit pieces */}
                      {isBlueberry && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                          <span className="absolute top-1.5 left-3 w-1.5 h-1.5 bg-indigo-950 rounded-full" />
                          <span className="absolute bottom-1.5 right-3 w-1.5 h-1.5 bg-indigo-950 rounded-full" />
                        </div>
                      )}

                      <span className="text-[10px] z-10 filter drop-shadow-xs">{flv?.icon}</span>
                    </div>
                  );
                })}

                {/* Whipped Cream & Cherry Toppings */}
                <div className="flex items-center -space-x-1 mb-0.5 z-30 text-sm filter drop-shadow-sm">
                  {activeOrder.toppings.includes('whipped_cream') && <span>☁️</span>}
                  {activeOrder.toppings.includes('cherry') && <span>🍒</span>}
                </div>
              </div>
            </div>
          )}

          {/* Drizzle & Sprinkle Indicators if requested */}
          {activeOrder.toppings.some(t => t !== 'whipped_cream' && t !== 'cherry') && (
            <div className="flex items-center gap-0.5 mt-1 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full filter drop-shadow-sm">
              {activeOrder.toppings
                .filter(t => t !== 'whipped_cream' && t !== 'cherry')
                .map(tId => {
                  const top = TOPPINGS.find(t => t.id === tId);
                  return (
                    <span key={tId} className="text-[10px]" title={top?.name}>
                      {top?.icon}
                    </span>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
