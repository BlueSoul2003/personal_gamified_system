"use client";

import { Atom, Crosshair, Star, Zap, Coins, Cloud, CloudOff, Loader2 } from "lucide-react";
import { useGame, getRank } from "../context/GameContext";

const SYNC_CONFIG = {
    local: { icon: CloudOff, label: "Local", color: "text-gray-500" },
    syncing: { icon: Loader2, label: "Syncing...", color: "text-yellow-400" },
    synced: { icon: Cloud, label: "Cloud", color: "text-emerald-400" },
    error: { icon: CloudOff, label: "Offline", color: "text-red-400" },
};

export default function TopStatus() {
    const { state, syncStatus } = useGame();
    const sync = SYNC_CONFIG[syncStatus];
    const SyncIcon = sync.icon;
    const xpPct = Math.max(0, Math.min((state.currentXP / state.maxXP) * 100, 100));
    const engPct = Math.max(0, Math.min((state.energy / state.maxEnergy) * 100, 100));

    return (
        <header className="w-full glass-panel p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-5 z-10">
            <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative w-[76px] h-[76px] rounded-full border-2 border-[var(--color-neon-cyan)] p-[3px] flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)] shrink-0">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                        <Atom className="w-10 h-10 text-[var(--color-neon-cyan)] animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1.5 -right-2 bg-black border border-[var(--color-neon-purple)] text-[var(--color-neon-purple)] font-[family-name:var(--font-heading)] text-xs font-bold px-2 py-1 rounded-md shadow-[0_0_8px_rgba(176,38,255,0.5)]">
                        Lv.{state.level}
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-wider">
                        代号: <span className="neon-text-cyan">Quantum.Explorer</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        <Crosshair className="w-4 h-4" /> 终极目标: MIT Graduate School
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
                        <span className="text-[var(--color-neon-cyan)]">CGPA 4.0 Stabilized</span>
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

                {/* Sync Status */}
                <div className={`flex items-center gap-1.5 text-xs ${sync.color}`}>
                    <SyncIcon className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    {sync.label}
                </div>
            </div>
        </header>
    );
}
