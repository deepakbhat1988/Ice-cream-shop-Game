import React, { useEffect } from 'react';
import { ScoreBreakdown } from '../types/game';
import { Sparkles, Trophy, Flame } from 'lucide-react';

interface ServingFeedbackProps {
  score: ScoreBreakdown | null;
  onClear: () => void;
}

export const ServingFeedback: React.FC<ServingFeedbackProps> = ({ score, onClear }) => {
  useEffect(() => {
    if (!score) return;
    const timer = setTimeout(() => {
      onClear();
    }, 2800);
    return () => clearTimeout(timer);
  }, [score, onClear]);

  if (!score) return null;

  return (
    <div className="fixed top-13 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-pop">
      <div className={`rounded-full px-4 py-1.5 shadow-lg border text-center backdrop-blur-md flex items-center gap-2.5 ${
        score.isPerfect
          ? 'bg-amber-50/95 border-amber-400 ring-2 ring-yellow-200'
          : score.accuracyScore >= 75
          ? 'bg-white/95 border-pink-300'
          : 'bg-white/95 border-rose-300'
      }`}>
        <div className="flex items-center gap-1">
          {score.isPerfect && <Sparkles size={13} className="text-amber-500 fill-amber-400 animate-spin" />}
          <span className="font-black text-xs text-gray-800 tracking-tight whitespace-nowrap">
            {score.feedbackText}
          </span>
        </div>

        {/* Score & Tip breakdown */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700">
          <span className="flex items-center gap-0.5 text-pink-600 whitespace-nowrap">
            <Trophy size={11} /> +{score.totalScore}
          </span>
          {score.tipEarned > 0 && (
            <span className="text-amber-600 bg-amber-100/60 px-1.5 py-0.2 rounded-full border border-amber-200 whitespace-nowrap">
              +${score.tipEarned} Tip
            </span>
          )}
          {score.comboBonus > 0 && (
            <span className="text-rose-600 bg-rose-100/60 px-1.5 py-0.2 rounded-full border border-rose-200 flex items-center gap-0.5 whitespace-nowrap">
              <Flame size={10} className="fill-rose-500 text-rose-500" /> Combo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
