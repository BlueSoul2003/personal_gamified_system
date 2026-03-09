"use client";

import { Zap } from "lucide-react";
import { useGame } from "../context/GameContext";

export default function LevelUpModal() {
    const { levelUpPending, newLevel, dismissLevelUp } = useGame();

    return (
        <div className={`level-up-overlay ${levelUpPending ? "show" : ""}`}>
            <div className="glass-panel p-10 text-center relative overflow-hidden border-[var(--color-neon-cyan)] shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                <Zap className="w-20 h-20 mx-auto text-[var(--color-neon-cyan)] animate-bounce mb-4" />
                <h2 className="text-4xl font-bold text-white mb-2 tracking-widest">LEVEL UP!</h2>
                <p className="text-xl text-[var(--color-neon-purple)] font-[family-name:var(--font-heading)] mb-6">
                    位阶突破：Lv.{newLevel}
                </p>
                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                    &ldquo;知识的积累打破了现有的认知维度，你的第一性原理理解更深刻了。&rdquo;
                </p>
                <button
                    onClick={dismissLevelUp}
                    className="px-6 py-2 bg-transparent border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded-lg hover:bg-[var(--color-neon-cyan)] hover:text-black transition font-bold tracking-wide cursor-pointer"
                >
                    确认 (Acknowledge)
                </button>
            </div>
        </div>
    );
}
