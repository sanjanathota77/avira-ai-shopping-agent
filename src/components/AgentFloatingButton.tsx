'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AgentFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function AgentFloatingButton({ onClick, isOpen }: AgentFloatingButtonProps) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 animate-fade-in">
      {/* Floating Prompt Teaser Bubble */}
      <div
        onClick={onClick}
        className="hidden md:flex items-center space-x-2 bg-stone-900/95 backdrop-blur-md text-stone-200 border border-amber-500/30 px-3.5 py-2 rounded-2xl shadow-xl cursor-pointer hover:border-amber-400 transition-all group"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium group-hover:text-amber-300">
          Shopping Assistant Online • <strong>Ask me anything</strong>
        </span>
      </div>

      {/* Main Circular Button */}
      <button
        onClick={onClick}
        className="relative group p-4 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-stone-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border border-amber-300/40"
        aria-label="Open AI Shopping Agent"
      >
        {/* Glow halo */}
        <span className="absolute -inset-1 rounded-2xl bg-amber-500/30 blur-sm group-hover:blur-md transition-all pointer-events-none" />

        <div className="relative flex items-center space-x-2">
          <Sparkles className="w-6 h-6 fill-stone-950 text-stone-950" />
        </div>

        {/* Unread badge dot */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-stone-950 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-stone-950 rounded-full" />
      </button>
    </div>
  );
}
