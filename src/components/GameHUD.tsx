import React from 'react';
import { GameStats } from '../types/game';
import { Volume2, VolumeX, Flame, Coins, Trophy, Clock, HelpCircle, Star, Pause } from 'lucide-react';

interface GameHUDProps {
  stats: GameStats;
  onToggleSound: () => void;
  isMuted: boolean;
  onOpenHelp: () => void;
  onPause?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  onToggleSound,
  isMuted,
  onOpenHelp,
  onPause,
}) => {
  const minutes = Math.floor(stats.timeLeft / 60);
  const seconds = stats.timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const isTimeUrgent = stats.timeLeft <= 15;

  // Star progression based on score (e.g. 300 pts = 1 star, 700 pts = 2 stars, 1200 pts = 3 stars)
  const targetScore3Stars = 1200;
  const starProgress = Math.min(100, (stats.score / targetScore3Stars) * 100);
  const starsEarned = stats.score >= 1200 ? 3 : (stats.score >= 700 ? 2 : (stats.score >= 300 ? 1 : 0));

  return (
    <header className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
      {/* Left: Pink Pause Button (exact match to game.jpeg!) & Shift Info */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onOpenHelp}
          title="Pause & Recipe Book"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg border-2 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Pause size={20} className="fill-white" />
        </button>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1 shadow-md border-2 border-pink-200 flex items-center gap-2">
          <span className="text-base">🍨</span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-500 block leading-none">
              Day {stats.day}
            </span>
            <span className="text-xs font-bold text-gray-800">Summer Cafe</span>
          </div>
        </div>

        {/* Timer Chip */}
        <div
          className={`backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md border-2 flex items-center gap-1.5 transition-colors ${
            isTimeUrgent
              ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
              : 'bg-white/95 text-gray-800 border-pink-200'
          }`}
        >
          <Clock size={15} className={isTimeUrgent ? 'animate-spin' : 'text-pink-500'} />
          <span className="font-bold text-xs sm:text-sm font-mono tracking-wider">{timeFormatted}</span>
        </div>
      </div>

      {/* Center: Combo Multiplier if active */}
      {stats.combo > 1 && (
        <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce pointer-events-auto">
          <Flame size={16} className="fill-yellow-200 text-yellow-200 animate-pulse" />
          <span>{stats.combo}x COMBO! (+{Math.round((stats.combo - 1) * 25)}% pts)</span>
        </div>
      )}

      {/* Right: Star Progression Bar (exact match to game.jpeg!) + Stats */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Star Progress Bar (matching pink progress meter in game.jpeg!) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md border-2 border-pink-200 flex items-center gap-2">
          <div className="relative w-24 sm:w-32 h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${starProgress}%` }}
            />
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map(starNum => (
              <Star
                key={starNum}
                size={14}
                className={
                  starsEarned >= starNum
                    ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                    : 'fill-gray-200 text-gray-400'
                }
              />
            ))}
          </div>
        </div>

        {/* Score & Coins */}
        <div className="hidden sm:flex bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md border-2 border-pink-200 items-center gap-3">
          <div className="flex items-center gap-1">
            <Trophy size={15} className="text-amber-500" />
            <span className="font-bold text-xs sm:text-sm text-gray-800">{stats.score}</span>
          </div>
          <div className="w-px h-4 bg-pink-100" />
          <div className="flex items-center gap-1">
            <Coins size={15} className="text-amber-500 fill-amber-400" />
            <span className="font-bold text-xs sm:text-sm text-amber-700">${stats.coins}</span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
          className="p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border-2 border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Help Book */}
        <button
          onClick={onOpenHelp}
          title="Recipe Book & Instructions"
          className="p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border-2 border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
};
