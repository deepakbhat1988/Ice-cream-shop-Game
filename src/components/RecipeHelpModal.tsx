import React from 'react';
import { X, Sparkles, Heart, Bell, Flame } from 'lucide-react';
import { FLAVORS, TOPPINGS } from '../game/orderManager';

interface RecipeHelpModalProps {
  onClose: () => void;
}

export const RecipeHelpModal: React.FC<RecipeHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border-4 border-pink-300 max-h-[85vh] overflow-y-auto flex flex-col gap-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-lg font-black text-gray-800 leading-tight">Kawaii Recipe Handbook</h2>
              <p className="text-xs text-pink-500 font-semibold">How to run your dream ice cream shop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Core Steps */}
        <div className="flex flex-col gap-3 text-xs">
          {/* Step 1: Read Order */}
          <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-200">
            <h4 className="font-bold text-pink-900 text-sm flex items-center gap-1.5 mb-1">
              <span>🍓 1. Watch the Customer Speech Bubble</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Customers queue up with an order above their head. Check whether they want a waffle cone, pastel cup, or banana milkshake!
            </p>
          </div>

          {/* Step 2: Stacking Scoops */}
          <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-200">
            <h4 className="font-bold text-sky-900 text-sm flex items-center gap-1.5 mb-1">
              <span>🍨 2. Scoop in Order (Bottom to Top)</span>
            </h4>
            <p className="text-gray-600 leading-relaxed mb-2">
              Stack up to 3 scoops exactly matching the flavors in their order bubble.
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {FLAVORS.map(f => (
                <span
                  key={f.id}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-800 shadow-sm border border-black/10"
                  style={{ backgroundColor: f.color }}
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* Step 3: Banana Milkshake Machine */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5 mb-1">
              <span>🍌 3. Banana Blender Machine</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Select <strong>Milkshake Glass</strong>, pick their requested flavor, and hit <strong>BLEND NOW! 🍌</strong> to spin the smoothie. Don't forget their whipped cream or cherry!
            </p>
          </div>

          {/* Step 4: Combos & Ring Bell */}
          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200">
            <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1.5 mb-1">
              <Bell size={16} className="text-purple-600" />
              <span>4. Ring the Bell & Build Combos!</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Press <strong>SERVE ORDER!</strong> to ring the counter bell. Consecutive accurate orders build your <strong>Combo Multiplier (x1.5, x2.0...)</strong> for high tips!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md transition-colors text-sm"
        >
          Got It, Let's Scoop! 🍦
        </button>
      </div>
    </div>
  );
};
