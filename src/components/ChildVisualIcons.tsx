import React from 'react';
import { ContainerType, FlavorId, ToppingId } from '../types/game';

/**
 * Realistic and cartoon-charming visual icons for young children who cannot read.
 * These fill the entire button or badge with easily identifiable food illustrations!
 */

// 1. Actual Waffle Cone SVG with cross-hatched baked waffle texture
export const WaffleConeIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => {
  const width = size;
  const height = Math.round(size * 1.25);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      {/* Golden baked waffle cone body */}
      <polygon points="4,4 36,4 20,46" fill="#D97706" stroke="#92400E" strokeWidth="2" strokeLinejoin="round" />
      {/* Baked waffle grid crosshatch */}
      <line x1="10" y1="4" x2="24" y2="38" stroke="#B45309" strokeWidth="1.6" strokeOpacity="0.85" />
      <line x1="18" y1="4" x2="28" y2="28" stroke="#B45309" strokeWidth="1.6" strokeOpacity="0.85" />
      <line x1="30" y1="4" x2="16" y2="38" stroke="#B45309" strokeWidth="1.6" strokeOpacity="0.85" />
      <line x1="22" y1="4" x2="12" y2="28" stroke="#B45309" strokeWidth="1.6" strokeOpacity="0.85" />
      <line x1="4" y1="4" x2="20" y2="46" stroke="#78350F" strokeWidth="1.2" strokeOpacity="0.5" />
      {/* Cone rim rolled lip */}
      <ellipse cx="20" cy="5" rx="16" ry="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      {/* Delicious golden highlight */}
      <path d="M7 6 L19 42" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
};

// 2. Sundae Cup Icon
export const SundaeCupIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => {
  const width = size;
  const height = Math.round(size * 0.9);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      {/* Pastel Cup Body */}
      <path
        d="M6 8 L10 32 C10.5 35 14 36 22 36 C30 36 33.5 35 34 32 L38 8 Z"
        fill="#38BDF8"
        stroke="#0284C7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Decorative polka dots */}
      <circle cx="16" cy="20" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="28" cy="20" r="2.5" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="22" cy="27" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
      {/* Rolled rim */}
      <ellipse cx="22" cy="8" rx="17" ry="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.8" />
      {/* Spoon sticking out */}
      <path d="M28 10 L35 2" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

// 3. Milkshake Glass with Striped Straw Icon
export const MilkshakeGlassIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => {
  const width = Math.round(size * 0.85);
  const height = Math.round(size * 1.25);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md ${className}`}
    >
      {/* Red & White Striped Straw */}
      <path d="M22 14 L28 2" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M23 12 L24 9" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M26 6 L27 3" stroke="#FFFFFF" strokeWidth="3" />

      {/* Glass Body */}
      <path
        d="M8 12 L11 36 C11.5 40 14 41 16 41 L16 46 L12 47 L12 49 L24 49 L24 47 L20 46 L20 41 C22 41 24.5 40 25 36 L28 12 Z"
        fill="#FDE047"
        stroke="#CA8A04"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Banana shake inside */}
      <path
        d="M10 16 L12 35 C13 38 15 39 18 39 C21 39 23 38 24 35 L26 16 Z"
        fill="#FEF08A"
      />
      {/* Glass rim */}
      <ellipse cx="18" cy="12" rx="10" ry="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
      {/* Whipped cream dome on top */}
      <ellipse cx="18" cy="9" rx="7" ry="4" fill="#FFFFFF" />
      {/* Cherry on top */}
      <circle cx="18" cy="4" r="2.5" fill="#DC2626" />
    </svg>
  );
};

// Container Component Picker Helper
export const ContainerVisual: React.FC<{ type: ContainerType; size?: number; className?: string }> = ({
  type,
  size = 48,
  className = '',
}) => {
  if (type === 'waffle_cone') return <WaffleConeIcon size={size} className={className} />;
  if (type === 'cup') return <SundaeCupIcon size={size} className={className} />;
  return <MilkshakeGlassIcon size={size} className={className} />;
};

// 4. Pure Visual Flavor Scoops (Zero Reading Required!)
// Big, rich, filled-in appetizing scoops with the real fruit/chocolate graphics
export const FlavorVisual: React.FC<{ flavorId: FlavorId; size?: number; className?: string }> = ({
  flavorId,
  size = 48,
  className = '',
}) => {
  switch (flavorId) {
    case 'strawberry':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-rose-300 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#FB7185' }}
        >
          {/* Strawberry texture seeds */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-rose-500 to-rose-700 opacity-90" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🍓</span>
          {/* Shimmer star */}
          <span className="absolute top-1 right-1 text-[10px] text-yellow-200 animate-pulse">✨</span>
        </div>
      );
    case 'chocolate':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-amber-900 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#5B3012' }}
        >
          {/* Chocolate fudge swirl gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#78350F] via-[#54230D] to-[#2E1005]" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🍫</span>
          {/* Chocolate chips */}
          <span className="absolute top-1 left-1.5 w-1.5 h-1 bg-stone-900 rounded-xs rotate-12" />
          <span className="absolute bottom-1 right-1.5 w-1.5 h-1 bg-stone-900 rounded-xs -rotate-45" />
        </div>
      );
    case 'vanilla':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-yellow-200 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#FEF9C3' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FEF08A] via-[#FEF9C3] to-[#FDE68A]" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🍦</span>
          {/* Vanilla bean specks */}
          <span className="absolute top-1.5 left-2 w-1 h-1 bg-stone-700 rounded-full opacity-60" />
          <span className="absolute bottom-2 right-2 w-1 h-1 bg-stone-700 rounded-full opacity-60" />
        </div>
      );
    case 'mint':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-emerald-300 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#A7F3D0' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6EE7B7] via-[#A7F3D0] to-[#34D399]" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🍃</span>
          {/* Choco mint chips */}
          <span className="absolute top-1 right-1.5 w-1.5 h-1 bg-stone-900 rounded-xs" />
          <span className="absolute bottom-1 left-2 w-1.5 h-1 bg-stone-900 rounded-xs" />
        </div>
      );
    case 'mango':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-amber-400 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#FBBF24' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDE047] via-[#FBBF24] to-[#F59E0B]" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🥭</span>
        </div>
      );
    case 'blueberry':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-indigo-300 ${className}`}
          style={{ width: size, height: size, backgroundColor: '#818CF8' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#A5B4FC] via-[#818CF8] to-[#6366F1]" />
          <span className="text-2xl sm:text-3xl z-10 filter drop-shadow-sm scale-110">🫐</span>
        </div>
      );
  }
};

// 5. Pure Visual Topping Icons (Zero Reading Required!)
export const ToppingVisual: React.FC<{ toppingId: ToppingId; size?: number; className?: string }> = ({
  toppingId,
  size = 48,
  className = '',
}) => {
  switch (toppingId) {
    case 'cherry':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-100 ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm scale-110">🍒</span>
        </div>
      );
    case 'sprinkles':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-pink-200 bg-gradient-to-br from-pink-50 via-yellow-50 to-sky-50 ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm scale-110">🌈</span>
          <span className="absolute -top-0.5 right-1 text-[10px]">✨</span>
        </div>
      );
    case 'whipped_cream':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-sky-200 bg-gradient-to-br from-white via-sky-50 to-sky-100 ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm scale-110">☁️</span>
        </div>
      );
    case 'chocolate_sauce':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-amber-800 bg-gradient-to-br from-[#451A03] to-[#290E02] ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm scale-110">🍫</span>
          <span className="absolute bottom-1 right-1 text-xs">💧</span>
        </div>
      );
    case 'strawberry_syrup':
      return (
        <div
          className={`relative rounded-2xl flex items-center justify-center overflow-hidden shadow-md border-2 border-rose-400 bg-gradient-to-br from-rose-500 to-rose-700 ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm scale-110">🍓</span>
          <span className="absolute bottom-1 right-1 text-xs">💧</span>
        </div>
      );
  }
};
