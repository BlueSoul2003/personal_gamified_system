"use client";

import { useGame } from "../context/GameContext";

export default function Challenges() {
    const { state } = useGame();

    if (!state.monsters || state.monsters.length === 0) {
        return (
            <p className="text-gray-500 text-xs tech-font text-center p-4 border border-dashed border-gray-700">
                No active threats detected.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {state.monsters.map((m) => {
                const pct = Math.max(0, (m.hp / m.maxHp) * 100);
                const isDead = m.hp <= 0;
                return (
                    <div key={m.id} className="monster-card">
                        <div className="text-xs text-gray-400 mb-2 tech-font">[{m.type}]</div>
                        <div className={`monster-sprite ${isDead ? "opacity-20 grayscale" : ""}`}>{isDead ? "💀" : m.sprite}</div>
                        <div className="pixel-font text-[10px] text-center mb-3 h-8 flex items-center justify-center">{m.name}</div>
                        <div className="w-full xp-bar-container">
                            <div className="hp-bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="text-[10px] tech-font mt-1 text-gray-400">{m.hp} / {m.maxHp} HP</div>
                    </div>
                );
            })}
        </div>
    );
}
