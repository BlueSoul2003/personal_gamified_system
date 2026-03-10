"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { supabase } from "../lib/supabase";

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
    icon: string;
    color: string;
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
    syncStatus: "local" | "syncing" | "synced" | "error";
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

const PLAYER_ID = "default_player";

// ═══════ SUPABASE HELPERS ═══════
function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("your-project") && !key.includes("your-anon"));
}

async function loadFromSupabase(): Promise<PlayerState | null> {
    if (!isSupabaseConfigured()) return null;
    try {
        const { data, error } = await supabase
            .from("player_state")
            .select("*")
            .eq("id", PLAYER_ID)
            .single();
        if (error || !data) return null;
        return {
            level: data.level,
            currentXP: data.current_xp,
            maxXP: data.max_xp,
            gold: data.gold,
            totalXP: data.total_xp,
            energy: data.energy,
            maxEnergy: data.max_energy,
            quests: data.quests || DEFAULT_QUESTS,
            grimoire: data.grimoire || DEFAULT_GRIMOIRE,
            sessionLog: [],
        };
    } catch {
        return null;
    }
}

async function saveToSupabase(state: PlayerState): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
        const { error } = await supabase
            .from("player_state")
            .upsert({
                id: PLAYER_ID,
                level: state.level,
                current_xp: state.currentXP,
                max_xp: state.maxXP,
                gold: state.gold,
                total_xp: state.totalXP,
                energy: state.energy,
                max_energy: state.maxEnergy,
                quests: state.quests,
                grimoire: state.grimoire,
                updated_at: new Date().toISOString(),
            });
        return !error;
    } catch {
        return false;
    }
}

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
    const [syncStatus, setSyncStatus] = useState<"local" | "syncing" | "synced" | "error">("local");
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load state on mount: try Supabase first, fall back to localStorage
    useEffect(() => {
        async function init() {
            // Try Supabase
            const cloudState = await loadFromSupabase();
            if (cloudState) {
                setState(cloudState);
                setSyncStatus("synced");
                setHydrated(true);
                return;
            }
            // Fall back to localStorage
            try {
                const saved = localStorage.getItem("quantumNexusState");
                if (saved) {
                    const parsed = JSON.parse(saved) as Partial<PlayerState>;
                    setState(prev => ({ ...prev, ...parsed }));
                }
            } catch { /* ignore */ }
            setSyncStatus(isSupabaseConfigured() ? "error" : "local");
            setHydrated(true);
        }
        init();
    }, []);

    // Subscribe to real-time changes from Supabase (cross-device sync)
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const channel = supabase
            .channel("player_state_changes")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "player_state", filter: `id=eq.${PLAYER_ID}` },
                (payload) => {
                    const data = payload.new;
                    if (!data) return;
                    setState(prev => ({
                        ...prev,
                        level: data.level,
                        currentXP: data.current_xp,
                        maxXP: data.max_xp,
                        gold: data.gold,
                        totalXP: data.total_xp,
                        energy: data.energy,
                        maxEnergy: data.max_energy,
                        quests: data.quests || prev.quests,
                        grimoire: data.grimoire || prev.grimoire,
                    }));
                    setSyncStatus("synced");
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Save to localStorage + Supabase (debounced) on every state change
    useEffect(() => {
        if (!hydrated) return;

        // Always save to localStorage immediately
        localStorage.setItem("quantumNexusState", JSON.stringify(state));

        // Debounce Supabase saves (300ms) to avoid spamming on rapid changes
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
            if (isSupabaseConfigured()) {
                setSyncStatus("syncing");
                const ok = await saveToSupabase(state);
                setSyncStatus(ok ? "synced" : "error");
            }
        }, 300);
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
            return { ...prev, quests: prev.quests.map(q => q.id === id ? { ...q, completed: true } : q) };
        });
    }, []);

    const uncompleteQuest = useCallback((id: string) => {
        setState(prev => {
            const quest = prev.quests.find(q => q.id === id);
            if (!quest || !quest.completed) return prev;
            return {
                ...prev,
                quests: prev.quests.map(q => q.id === id ? { ...q, completed: false } : q),
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

    if (!hydrated) return null;

    return (
        <GameContext.Provider
            value={{
                state, addXP, addGold, completeQuest, uncompleteQuest,
                addQuest, addGrimoireItem, appendLog,
                levelUpPending, newLevel, dismissLevelUp, syncStatus,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
