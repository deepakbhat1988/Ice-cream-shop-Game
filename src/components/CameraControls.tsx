import React from 'react';
import { Camera, Eye, UtensilsCrossed, Move } from 'lucide-react';

interface CameraControlsProps {
  currentView: 'parlor' | 'counter' | 'customers';
  onChangeView: (view: 'parlor' | 'counter' | 'customers') => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="absolute right-3 top-16 sm:top-18 z-20 flex flex-col items-end gap-1.5 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-lg border-2 border-pink-200 flex flex-col gap-1 pointer-events-auto">
        <button
          onClick={() => onChangeView('parlor')}
          title="Zoom out: Full 3D Parlor View"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentView === 'parlor'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-pink-50'
          }`}
        >
          <Camera size={14} />
          <span className="hidden sm:inline">3D Parlor</span>
        </button>

        <button
          onClick={() => onChangeView('counter')}
          title="Zoom in: Counter Prep View"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentView === 'counter'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-pink-50'
          }`}
        >
          <UtensilsCrossed size={14} />
          <span className="hidden sm:inline">Counter Zoom</span>
        </button>

        <button
          onClick={() => onChangeView('customers')}
          title="View Customers"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentView === 'customers'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-pink-50'
          }`}
        >
          <Eye size={14} />
          <span className="hidden sm:inline">Customers</span>
        </button>
      </div>

      {/* Orbit Hint */}
      <div className="bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
        <Move size={11} className="text-pink-300" />
        <span>Drag to orbit 3D</span>
      </div>
    </div>
  );
};
