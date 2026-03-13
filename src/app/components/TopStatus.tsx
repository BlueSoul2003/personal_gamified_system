"use client";

import { Atom, Crosshair, Star, Zap, Coins } from "lucide-react";
import { useGame, getRank } from "../context/GameContext";

const SYNC_DOT: Record<string, { bg: string; shadow: string; title: string }> = {
    local: { bg: "bg-gray-500", shadow: "", title: "Local only" },
    syncing: { bg: "bg-yellow-400 animate-pulse", shadow: "shadow-[0_0_6px_rgba(250,204,21,0.8)]", title: "Syncing..." },
    synced: { bg: "bg-emerald-400", shadow: "shadow-[0_0_6px_rgba(52,211,153,0.6)]", title: "Cloud synced" },
    error: { bg: "bg-red-400", shadow: "", title: "Sync error" },
};

export default function TopStatus() {
    const { state, syncStatus } = useGame();
    const dot = SYNC_DOT[syncStatus];
    const xpPct = Math.max(0, Math.min((state.currentXP / state.maxXP) * 100, 100));
    const engPct = Math.max(0, Math.min((state.energy / state.maxEnergy) * 100, 100));

    return (
        <header className="w-full glass-panel p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-5 z-10">
            <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="avatar-ring pixel-panel bg-[var(--bg-dark)] w-[100px] h-[100px] border-4 border-white shadow-[4px_4px_0_rgba(0,0,0,0.8)] relative flex items-center justify-center shrink-0">
                    <div className="avatar-inner w-full h-full overflow-hidden flex items-center justify-center">
                        <img src="/avatar.png" alt="Player Avatar" className="w-full h-full object-cover" style={{imageRendering: "pixelated"}} />
                    </div>
                    <div className="absolute -bottom-2.5 -right-2.5 bg-black border-2 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] font-[family-name:var(--font-heading)] text-xs font-bold px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,0.8)] pixel-font">
                        Lv.{state.level}
                    </div>
                    {/* Tiny sync dot — green=synced, yellow pulse=syncing, gray=local, red=error */}
                    <div
                        className={`absolute top-0 left-0 w-[7px] h-[7px] rounded-full ${dot.bg} ${dot.shadow} transition-colors duration-500`}
                        title={dot.title}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl md:text-3xl font-bold tracking-wider mb-2">
                        <span className="pixel-font text-[var(--color-neon-cyan)] text-sm md:text-lg">Gregory</span>
                    </h1>
                    <p className="text-xs md:text-sm text-gray-400 flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-[#ff3366]" /> 终极目标: MIT Grad School
                    </p>
                </div>
            </div>

            {/* Status Bars */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                {/* XP */}
                <div className="w-full sm:w-64 flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm font-[family-name:var(--font-heading)]">
                        <span className="text-[var(--color-neon-purple)] flex items-center gap-1"><Star className="w-3.5 h-3.5" /> EXP</span>
                        <span>{state.currentXP} / {state.maxXP}</span>
                    </div>
                    <div className="xp-bar-container">
                        <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Rank: <span className="text-gray-400">{getRank(state.level)}</span></span>
                        <span className="text-[var(--color-neon-cyan)]">CGPA 3.9 (Year 3 Sem 1)</span>
                    </div>
                </div>

                {/* Energy */}
                <div className="w-full sm:w-48 flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm font-[family-name:var(--font-heading)]">
                        <span className="text-emerald-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> ENG</span>
                        <span>{state.energy} / {state.maxEnergy}</span>
                    </div>
                    <div className="xp-bar-container">
                        <div className="eng-bar-fill" style={{ width: `${engPct}%` }} />
                    </div>
                </div>

                {/* Gold */}
                <div className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-gold)] flex items-center gap-2 bg-[rgba(251,191,36,0.08)] px-4 py-1.5 rounded-[10px] border border-[rgba(251,191,36,0.2)] whitespace-nowrap">
                    <Coins className="w-5 h-5" />
                    {state.gold}G
                </div>
            </div>
        </header>
    );
}
