import React, { useState } from 'react';
import { BuiltItem, ContainerType, FlavorId, ToppingId } from '../types/game';
import { FLAVORS, TOPPINGS } from '../game/orderManager';
import { sounds } from '../audio/soundManager';
import { Trash2, Bell, Sparkles, Wand2 } from 'lucide-react';
import {
  WaffleConeIcon,
  SundaeCupIcon,
  MilkshakeGlassIcon,
  ContainerVisual,
  FlavorVisual,
  ToppingVisual,
} from './ChildVisualIcons';

interface PreparationStationProps {
  builtItem: BuiltItem;
  onUpdateBuiltItem: (item: BuiltItem) => void;
  onServe: () => void;
  onClear: () => void;
  onBlendMilkshake: () => void;
}

export const PreparationStation: React.FC<PreparationStationProps> = ({
  builtItem,
  onUpdateBuiltItem,
  onServe,
  onClear,
  onBlendMilkshake,
}) => {
  const [activeCategory, setActiveCategory] = useState<'flavors' | 'toppings' | 'containers'>(
    builtItem.isMilkshake ? 'toppings' : 'flavors'
  );

  const handleSelectContainer = (container: ContainerType) => {
    sounds.playPop(480);
    const isMilkshake = container === 'milkshake_glass';
    onUpdateBuiltItem({
      ...builtItem,
      container,
      isMilkshake,
      scoops: isMilkshake ? [] : builtItem.scoops,
      isBlended: false,
    });
    if (isMilkshake) {
      setActiveCategory('flavors');
    }
  };

  const handleAddScoop = (flavorId: FlavorId) => {
    if (builtItem.isMilkshake) {
      sounds.playPop(520);
      onUpdateBuiltItem({
        ...builtItem,
        milkshakeFlavor: flavorId,
        isBlended: false,
      });
      return;
    }
    if (builtItem.scoops.length >= 3) {
      sounds.playPop(300);
      return; // max 3 scoops
    }
    sounds.playScoop();
    onUpdateBuiltItem({
      ...builtItem,
      scoops: [...builtItem.scoops, flavorId],
    });
  };

  const handleToggleTopping = (toppingId: ToppingId) => {
    sounds.playTopping();
    const exists = builtItem.toppings.includes(toppingId);
    let updated: ToppingId[];
    if (exists) {
      updated = builtItem.toppings.filter(t => t !== toppingId);
    } else {
      updated = [...builtItem.toppings, toppingId];
    }
    onUpdateBuiltItem({
      ...builtItem,
      toppings: updated,
    });
  };

  const handleBlend = () => {
    if (!builtItem.milkshakeFlavor) return;
    onBlendMilkshake();
  };

  const canServe = builtItem.isMilkshake
    ? (builtItem.milkshakeFlavor !== undefined && builtItem.isBlended)
    : (builtItem.scoops.length > 0);

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 pointer-events-auto">
      {/* Sleek Low-Profile Cartoon Kitchen Dock (Leaves entire view of customers & store open!) */}
      <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t-4 border-x-4 border-pink-300 px-3 py-2 flex flex-col gap-1.5">
        
        {/* Top Mini Ribbon: Category Selectors + Current Item Tray Summary */}
        <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-1.5">
          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { sounds.playPop(420); setActiveCategory('containers'); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all flex items-center gap-1 ${
                activeCategory === 'containers'
                  ? 'bg-pink-500 text-white shadow-xs scale-105'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <span>🧇</span>
              <span className="hidden sm:inline">Vessel</span>
            </button>

            <button
              onClick={() => { sounds.playPop(420); setActiveCategory('flavors'); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all flex items-center gap-1 ${
                activeCategory === 'flavors'
                  ? 'bg-pink-500 text-white shadow-xs scale-105'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <span>🍨</span>
              <span>{builtItem.isMilkshake ? 'Shake Base' : `Flavors (${builtItem.scoops.length}/3)`}</span>
            </button>

            <button
              onClick={() => { sounds.playPop(420); setActiveCategory('toppings'); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all flex items-center gap-1 ${
                activeCategory === 'toppings'
                  ? 'bg-pink-500 text-white shadow-xs scale-105'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <span>✨</span>
              <span>Toppings ({builtItem.toppings.length})</span>
            </button>
          </div>

          {/* Tray Summary Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 truncate max-w-[200px] sm:max-w-[320px]">
            {builtItem.isMilkshake ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                <MilkshakeGlassIcon size={24} />
                {builtItem.milkshakeFlavor ? (
                  <FlavorVisual flavorId={builtItem.milkshakeFlavor} size={24} />
                ) : (
                  <span className="text-xs text-amber-700 font-bold">...</span>
                )}
                {builtItem.isBlended ? <span className="text-xs">✨</span> : <span className="text-xs">🌀</span>}
              </div>
            ) : builtItem.scoops.length === 0 ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200">
                <ContainerVisual type={builtItem.container} size={24} />
                <span className="text-[10px] text-pink-400 font-bold">✨</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ContainerVisual type={builtItem.container} size={26} />
                {builtItem.scoops.map((s, idx) => (
                  <FlavorVisual key={idx} flavorId={s} size={24} />
                ))}
                {builtItem.toppings.map(t => (
                  <ToppingVisual key={t} toppingId={t} size={24} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Trash / Clear Button */}
          <button
            onClick={onClear}
            title="Clear tray / Trash mistake"
            className="p-1.5 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Bottom Interactive Dock Controls */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-0.5">
          {/* Main Category Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 overflow-x-auto py-1">
            {activeCategory === 'containers' && (
              <div className="flex items-center gap-3">
                {/* Waffle Cone - Actual Cone Graphic Filling the Button Area */}
                <button
                  onClick={() => handleSelectContainer('waffle_cone')}
                  title="Waffle Cone"
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex items-center justify-center transition-all active:scale-90 ${
                    builtItem.container === 'waffle_cone' && !builtItem.isMilkshake
                      ? 'border-pink-500 bg-pink-100 shadow-md ring-4 ring-pink-300 scale-105'
                      : 'border-pink-200 bg-white hover:border-pink-400 hover:scale-105 shadow-sm'
                  }`}
                >
                  <WaffleConeIcon size={46} />
                </button>

                {/* Pastel Sundae Cup - Actual Cup Graphic Filling the Button Area */}
                <button
                  onClick={() => handleSelectContainer('cup')}
                  title="Pastel Cup"
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex items-center justify-center transition-all active:scale-90 ${
                    builtItem.container === 'cup' && !builtItem.isMilkshake
                      ? 'border-pink-500 bg-pink-100 shadow-md ring-4 ring-pink-300 scale-105'
                      : 'border-pink-200 bg-white hover:border-pink-400 hover:scale-105 shadow-sm'
                  }`}
                >
                  <SundaeCupIcon size={46} />
                </button>

                {/* Milkshake Glass - Actual Glass Graphic Filling the Button Area */}
                <button
                  onClick={() => handleSelectContainer('milkshake_glass')}
                  title="Milkshake Glass"
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 flex items-center justify-center transition-all active:scale-90 ${
                    builtItem.isMilkshake
                      ? 'border-amber-500 bg-amber-100 shadow-md ring-4 ring-amber-300 scale-105'
                      : 'border-pink-200 bg-white hover:border-amber-400 hover:scale-105 shadow-sm'
                  }`}
                >
                  <MilkshakeGlassIcon size={46} />
                </button>
              </div>
            )}

            {activeCategory === 'flavors' && (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {FLAVORS.map(flavor => {
                  const isSelectedShake = builtItem.isMilkshake && builtItem.milkshakeFlavor === flavor.id;
                  const isMaxScoops = !builtItem.isMilkshake && builtItem.scoops.length >= 3;

                  return (
                    <button
                      key={flavor.id}
                      onClick={() => handleAddScoop(flavor.id)}
                      disabled={isMaxScoops}
                      title={flavor.name}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex items-center justify-center transition-all active:scale-90 ${
                        isSelectedShake
                          ? 'border-amber-500 ring-4 ring-amber-300 bg-amber-100 scale-105 shadow-md'
                          : isMaxScoops
                          ? 'opacity-35 cursor-not-allowed border-gray-200 bg-gray-50'
                          : 'border-pink-200 bg-white hover:border-pink-400 hover:scale-105 shadow-sm'
                      }`}
                    >
                      <FlavorVisual flavorId={flavor.id} size={50} />
                    </button>
                  );
                })}
              </div>
            )}

            {activeCategory === 'toppings' && (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {TOPPINGS.map(topping => {
                  const isSelected = builtItem.toppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => handleToggleTopping(topping.id)}
                      title={topping.name}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex items-center justify-center transition-all active:scale-90 ${
                        isSelected
                          ? 'border-pink-500 bg-pink-100 shadow-md ring-4 ring-pink-300 scale-105'
                          : 'border-pink-200 bg-white hover:border-pink-400 hover:scale-105 shadow-sm'
                      }`}
                    >
                      <ToppingVisual toppingId={topping.id} size={50} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions: Blend Button (for Milkshakes) & Big Golden Bell SERVE */}
          <div className="flex items-center gap-1.5 shrink-0">
            {builtItem.isMilkshake && (
              <button
                onClick={handleBlend}
                disabled={!builtItem.milkshakeFlavor || builtItem.isBlended}
                className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all ${
                  builtItem.milkshakeFlavor && !builtItem.isBlended
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 animate-bounce'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Wand2 size={14} />
                <span>{builtItem.isBlended ? 'Blended!' : 'BLEND 🍌'}</span>
              </button>
            )}

            {/* Serve Button */}
            <button
              onClick={onServe}
              disabled={!canServe}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-all ${
                canServe
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 hover:brightness-105 active:scale-95 ring-2 ring-yellow-200 animate-pulse'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Bell size={16} className={canServe ? 'animate-bounce' : ''} />
              <span>SERVE!</span>
              <Sparkles size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
