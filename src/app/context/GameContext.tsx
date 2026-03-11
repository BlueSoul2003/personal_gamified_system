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

export interface Resource {
    id: string;
    name: string;
    category: string;
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
    resources: Resource[];
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
    addResource: (res: Omit<Resource, "id">) => void;
    removeGrimoireItem: (id: string) => void;
    removeResource: (id: string) => void;
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
const DEFAULT_QUESTS: Quest[] = [];

const DEFAULT_RESOURCES: Resource[] = [
    { id: "r_1", name: "iPad Pro 2022", category: "Hardware" },
    { id: "r_2", name: "Bambu Lab A1", category: "3D Printing" },
    { id: "r_3", name: "Lenovo IdeaPad Slim3i", category: "Hardware" },
    { id: "r_4", name: "DJI Osmo Pocket 3", category: "Audio/Visual" },
    { id: "r_5", name: "DJI Mini Mic Set", category: "Audio/Visual" },
    { id: "r_6", name: "FNIRSI 4 in 1 Multimeter", category: "Electronics" },
];

const DEFAULT_GRIMOIRE: GrimoireItem[] = [
    { id: "g_qm_ch1", title: "Intro to Quantum Mechanics", description: "Interactive physical regimes, uncertainty, and photoelectric effect.", icon: "Cpu", color: "text-[var(--color-neon-cyan)]", href: "/modules/quantum-mechanics-ch1" },
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
    resources: DEFAULT_RESOURCES,
    sessionLog: [],
};

const PLAYER_ID = "default_player";

// ═══════ SUPABASE HELPERS ═══════
function mergeGrimoire(saved: GrimoireItem[], defaults: GrimoireItem[]): GrimoireItem[] {
    const merged = [...saved];
    for (const defItem of defaults) {
        if (!merged.find(item => item.id === defItem.id)) {
            merged.push(defItem);
        }
    }
    return merged;
}

function mergeResources(saved: Resource[], defaults: Resource[]): Resource[] {
    const merged = [...saved];
    for (const defItem of defaults) {
        if (!merged.find(item => item.id === defItem.id)) {
            merged.push(defItem);
        }
    }
    return merged;
}

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(url && key && !url.includes("your-project") && !key.includes("your-anon"));
}

function cleanLegacyGrimoire(saved: GrimoireItem[]): GrimoireItem[] {
    const legacyIds = ["g1", "g2", "g3"];
    return saved.filter(item => !legacyIds.includes(item.id));
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
            quests: (data.quests && data.quests.length > 0) ? data.quests : DEFAULT_QUESTS,
            grimoire: (data.grimoire && data.grimoire.length > 0) ? mergeGrimoire(cleanLegacyGrimoire(data.grimoire), DEFAULT_GRIMOIRE) : DEFAULT_GRIMOIRE,
            resources: (data.resources && data.resources.length > 0) ? mergeResources(data.resources, DEFAULT_RESOURCES) : DEFAULT_RESOURCES,
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
                resources: state.resources,
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
                    if (parsed.grimoire) {
                        parsed.grimoire = mergeGrimoire(cleanLegacyGrimoire(parsed.grimoire), DEFAULT_GRIMOIRE);
                    }
                    if (parsed.resources) {
                        parsed.resources = mergeResources(parsed.resources, DEFAULT_RESOURCES);
                    } else {
                        parsed.resources = DEFAULT_RESOURCES;
                    }
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
                        resources: data.resources || prev.resources,
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

    const addResource = useCallback((res: Omit<Resource, "id">) => {
        const newItem: Resource = { ...res, id: `r_${Date.now()}` };
        setState(prev => ({ ...prev, resources: [...prev.resources, newItem] }));
    }, []);

    const removeGrimoireItem = useCallback((id: string) => {
        setState(prev => ({ ...prev, grimoire: prev.grimoire.filter(item => item.id !== id) }));
    }, []);

    const removeResource = useCallback((id: string) => {
        setState(prev => ({ ...prev, resources: prev.resources.filter(res => res.id !== id) }));
    }, []);

    const dismissLevelUp = useCallback(() => {
        setLevelUpPending(false);
    }, []);

    if (!hydrated) return null;

    return (
        <GameContext.Provider
            value={{
                state, addXP, addGold, completeQuest, uncompleteQuest,
                addQuest, addGrimoireItem, addResource, removeGrimoireItem, removeResource, appendLog,
                levelUpPending, newLevel, dismissLevelUp, syncStatus,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
