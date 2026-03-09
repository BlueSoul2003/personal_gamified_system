"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ═══════ TYPES ═══════
export interface Quest {
    id: string;
    title: string;
    description: string;
    type: "main" | "daily" | "side";
    xpReward: number;
    goldReward: number;
    completed: boolean;
}

export interface GrimoireItem {
    id: string;
    title: string;
    description: string;
    icon: string; // lucide icon name
    color: string; // tailwind color class
    href: string;
}

export interface PlayerState {
    level: number;
    currentXP: number;
    maxXP: number;
    gold: number;
    totalXP: number;
    energy: number;
    maxEnergy: number;
    quests: Quest[];
    grimoire: GrimoireItem[];
    sessionLog: string[];
}

interface GameContextType {
    state: PlayerState;
    addXP: (amount: number) => void;
    addGold: (amount: number) => void;
    completeQuest: (id: string) => void;
    uncompleteQuest: (id: string) => void;
    addQuest: (quest: Omit<Quest, "id" | "completed">) => void;
    addGrimoireItem: (item: Omit<GrimoireItem, "id">) => void;
    appendLog: (msg: string) => void;
    levelUpPending: boolean;
    newLevel: number;
    dismissLevelUp: () => void;
}

// ═══════ RANK SYSTEM ═══════
const RANKS: [number, string][] = [
    [1, "Initiate"],
    [3, "第二真理位阶"],
    [5, "Apprentice Explorer"],
    [8, "第三真理位阶"],
    [12, "Quantum Adept"],
    [16, "第四真理位阶"],
    [20, "Nexus Architect"],
];

export function getRank(level: number): string {
    let rank = RANKS[0][1];
    for (const [lv, title] of RANKS) {
        if (level >= lv) rank = title;
    }
    return rank;
}

// ═══════ DEFAULT DATA ═══════
const DEFAULT_QUESTS: Quest[] = [
    { id: "q1", title: "微波源控制器调试", description: "Complete the circuitry and write the firmware for the new controller.", type: "main", xpReward: 500, goldReward: 0, completed: false },
    { id: "q2", title: "准备辅导材料", description: "Draft notes for this week's physics session.", type: "daily", xpReward: 50, goldReward: 20, completed: false },
    { id: "q3", title: "Bambu Lab 打印订单", description: "Maintain and start the Bambu Lab print queue.", type: "daily", xpReward: 30, goldReward: 50, completed: false },
    { id: "q4", title: "YouTube 视频脚本构思", description: "Outline the 10-minute video on basic quantum concepts.", type: "side", xpReward: 150, goldReward: 0, completed: false },
];

const DEFAULT_GRIMOIRE: GrimoireItem[] = [
    { id: "g1", title: "薛定谔方程可视化", description: "量子力学基础波函数交互式模拟器。", icon: "Cpu", color: "text-[var(--color-neon-cyan)]", href: "#" },
    { id: "g2", title: "数字逻辑门模拟器", description: "基础电子学 AND/OR/NOT 门电路交互连线测试。", icon: "CircuitBoard", color: "text-yellow-400", href: "#" },
    { id: "g3", title: "Feynman: Thermodynamics", description: "Interactive study notes on heat transfer principles.", icon: "Flame", color: "text-[var(--color-neon-purple)]", href: "#" },
];

const DEFAULT_STATE: PlayerState = {
    level: 1,
    currentXP: 0,
    maxXP: 100,
    gold: 0,
    totalXP: 0,
    energy: 80,
    maxEnergy: 100,
    quests: DEFAULT_QUESTS,
    grimoire: DEFAULT_GRIMOIRE,
    sessionLog: [],
};

// ═══════ CONTEXT ═══════
const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGame must be used within <GameProvider>");
    return ctx;
}

// ═══════ PROVIDER ═══════
export function GameProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PlayerState>(DEFAULT_STATE);
    const [hydrated, setHydrated] = useState(false);
    const [levelUpPending, setLevelUpPending] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("quantumNexusState");
            if (saved) {
                const parsed = JSON.parse(saved) as Partial<PlayerState>;
                setState(prev => ({ ...prev, ...parsed }));
            }
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    // Save to localStorage on every state change (after hydration)
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem("quantumNexusState", JSON.stringify(state));
        }
    }, [state, hydrated]);

    const getTimestamp = () => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };

    const appendLog = useCallback((msg: string) => {
        setState(prev => ({
            ...prev,
            sessionLog: [...prev.sessionLog.slice(-50), `[${getTimestamp()}] ${msg}`],
        }));
    }, []);

    const addXP = useCallback((amount: number) => {
        setState(prev => {
            let { currentXP, maxXP, level, totalXP } = prev;
            currentXP += amount;
            totalXP += amount;
            let leveled = false;

            while (currentXP >= maxXP) {
                currentXP -= maxXP;
                level += 1;
                maxXP = Math.floor(maxXP * 1.2);
                leveled = true;
            }

            if (leveled) {
                setNewLevel(level);
                setLevelUpPending(true);
            }

            return { ...prev, currentXP, maxXP, level, totalXP };
        });
    }, []);

    const addGold = useCallback((amount: number) => {
        setState(prev => ({ ...prev, gold: prev.gold + amount }));
    }, []);

    const completeQuest = useCallback((id: string) => {
        setState(prev => {
            const quest = prev.quests.find(q => q.id === id);
            if (!quest || quest.completed) return prev;

            const updatedQuests = prev.quests.map(q =>
                q.id === id ? { ...q, completed: true } : q
            );
            return { ...prev, quests: updatedQuests };
        });
    }, []);

    const uncompleteQuest = useCallback((id: string) => {
        setState(prev => {
            const quest = prev.quests.find(q => q.id === id);
            if (!quest || !quest.completed) return prev;

            const updatedQuests = prev.quests.map(q =>
                q.id === id ? { ...q, completed: false } : q
            );
            return {
                ...prev,
                quests: updatedQuests,
                currentXP: Math.max(0, prev.currentXP - quest.xpReward),
                gold: Math.max(0, prev.gold - quest.goldReward),
            };
        });
    }, []);

    const addQuest = useCallback((quest: Omit<Quest, "id" | "completed">) => {
        const newQuest: Quest = { ...quest, id: `q_${Date.now()}`, completed: false };
        setState(prev => ({ ...prev, quests: [...prev.quests, newQuest] }));
    }, []);

    const addGrimoireItem = useCallback((item: Omit<GrimoireItem, "id">) => {
        const newItem: GrimoireItem = { ...item, id: `g_${Date.now()}` };
        setState(prev => ({ ...prev, grimoire: [...prev.grimoire, newItem] }));
    }, []);

    const dismissLevelUp = useCallback(() => {
        setLevelUpPending(false);
    }, []);

    if (!hydrated) {
        return null; // Prevent SSR mismatch
    }

    return (
        <GameContext.Provider
            value={{
                state,
                addXP,
                addGold,
                completeQuest,
                uncompleteQuest,
                addQuest,
                addGrimoireItem,
                appendLog,
                levelUpPending,
                newLevel,
                dismissLevelUp,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
