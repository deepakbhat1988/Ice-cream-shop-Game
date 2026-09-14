import React, { useEffect } from 'react';
import { GameStats } from '../types/game';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface DaySummaryModalProps {
  stats: GameStats;
  onNextDay: () => void;
  onRestartDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({ stats, onNextDay, onRestartDay }) => {
  const isVictory = stats.customersServed > 0 && stats.angryCustomers <= 2;

  // Star calculation
  let stars = 1;
  if (stats.perfectOrders >= 4 || stats.score >= 500) stars = 3;
  else if (stats.perfectOrders >= 2 || stats.score >= 250) stars = 2;

  useEffect(() => {
    if (isVictory) {
      sounds.playSuccessChime(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#FBBF24', '#34D399', '#38BDF8', '#EC4899'],
      });
    } else {
      sounds.playAngrySigh();
    }
  }, [isVictory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-pink-300 flex flex-col items-center text-center">
        {/* Top Header Icon */}
        <div className="w-16 h-16 rounded-full bg-pink-100 border-4 border-pink-300 flex items-center justify-center text-3xl shadow-inner -mt-12 mb-3">
          {isVictory ? '🍓' : '😿'}
        </div>

        <h2 className="text-2xl font-black text-gray-800">
          {isVictory ? `Day ${stats.day} Complete!` : 'Shift Ended!'}
        </h2>
        <p className="text-xs text-pink-600 font-semibold mb-4">
          {isVictory ? 'The berry customers loved your sweets!' : 'A few customers waited too long. Try again!'}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              size={36}
              className={`transition-transform duration-300 ${
                s <= (isVictory ? stars : 0)
                  ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md'
                  : 'fill-gray-100 text-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Shift Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full bg-pink-50/70 rounded-2xl p-3.5 mb-5 border border-pink-100 text-left">
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Total Score</span>
            <span className="text-base font-black text-gray-800 flex items-center gap-1">
              <Trophy size={14} className="text-amber-500" /> {stats.score}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Tips Earned</span>
            <span className="text-base font-black text-amber-600">
              +${stats.coins}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Served Happy</span>
            <span className="text-base font-black text-pink-600 flex items-center gap-1">
              🍓 {stats.customersServed}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Perfect Orders</span>
            <span className="text-base font-black text-green-600 flex items-center gap-1">
              ✨ {stats.perfectOrders}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onRestartDay}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Replay Day</span>
          </button>

          <button
            onClick={onNextDay}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <span>{isVictory ? 'Next Day' : 'Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
