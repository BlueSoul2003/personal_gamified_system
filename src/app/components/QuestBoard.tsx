"use client";

import { useState } from "react";
import { Crown, Calendar, MapPin } from "lucide-react";
import { useGame } from "../context/GameContext";

const TYPE_CONFIG = {
    main: { label: "主线任务 (Main Quests)", icon: <Crown className="w-4 h-4 text-yellow-400" />, titleColor: "text-[var(--color-neon-cyan)]" },
    daily: { label: "日常任务 (Daily Quests)", icon: <Calendar className="w-4 h-4 text-blue-400" />, titleColor: "text-blue-400" },
    side: { label: "支线任务 (Side Quests)", icon: <MapPin className="w-4 h-4 text-emerald-400" />, titleColor: "text-emerald-400" },
};

export default function QuestBoard() {
    const { state, addXP, addGold, completeQuest, uncompleteQuest, appendLog, addQuest } = useGame();
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newType, setNewType] = useState<"main" | "daily" | "side">("daily");
    const [newXP, setNewXP] = useState(50);
    const [newGold, setNewGold] = useState(0);

    const handleToggle = (id: string, checked: boolean) => {
        const quest = state.quests.find(q => q.id === id);
        if (!quest) return;
        if (checked) {
            completeQuest(id);
            addXP(quest.xpReward);
            if (quest.goldReward > 0) addGold(quest.goldReward);
            appendLog(`✅ 完成任务「${quest.title}」 → +${quest.xpReward} EXP` + (quest.goldReward ? ` +${quest.goldReward}G` : ""));
        } else {
            uncompleteQuest(id);
            appendLog(`↩️ 撤销任务「${quest.title}」`);
        }
    };

    const handleAddQuest = () => {
        if (!newTitle.trim()) return;
        addQuest({ title: newTitle, description: newDesc, type: newType, xpReward: newXP, goldReward: newGold });
        appendLog(`📝 新增任务「${newTitle}」`);
        setNewTitle(""); setNewDesc(""); setNewXP(50); setNewGold(0);
        setShowForm(false);
    };

    const questsByType = (type: "main" | "daily" | "side") =>
        state.quests.filter(q => q.type === type);

    return (
        <div className="space-y-6">
            {(["main", "daily", "side"] as const).map(type => {
                const config = TYPE_CONFIG[type];
                const quests = questsByType(type);
                if (quests.length === 0) return null;
                return (
                    <div key={type}>
                        <h3 className="text-[0.95rem] font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
                            {config.icon} {config.label}
                        </h3>
                        {quests.map(q => (
                            <label key={q.id} className={`flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-transparent hover:bg-white/[0.06] hover:border-white/10 cursor-pointer transition-all mb-2.5 ${q.completed ? "opacity-50" : ""}`}>
                                <input
                                    type="checkbox"
                                    className="quest-checkbox mt-0.5"
                                    checked={q.completed}
                                    onChange={e => handleToggle(q.id, e.target.checked)}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-medium ${config.titleColor} ${q.completed ? "line-through" : ""}`}>{q.title}</h4>
                                    <p className={`text-xs text-gray-400 mt-1 ${q.completed ? "line-through" : ""}`}>{q.description}</p>
                                    <div className="flex gap-3 mt-1.5">
                                        <span className="font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-neon-purple)]">+{q.xpReward} EXP</span>
                                        {q.goldReward > 0 && <span className="font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-gold)]">+{q.goldReward} G</span>}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                );
            })}

            {/* Add Quest Button & Form */}
            {!showForm ? (
                <button onClick={() => setShowForm(true)} className="w-full border border-dashed border-gray-700 rounded-xl p-3 flex items-center justify-center text-gray-500 hover:text-[var(--color-neon-purple)] hover:border-[var(--color-neon-purple)] transition cursor-pointer text-sm gap-2">
                    + 新增任务
                </button>
            ) : (
                <div className="border border-[var(--color-panel-border)] rounded-xl p-4 bg-black/30 space-y-3">
                    <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="任务标题 (Quest Title)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon-cyan)] transition" />
                    <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="描述 (Description)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon-cyan)] transition" />
                    <div className="flex gap-3">
                        <select value={newType} onChange={e => setNewType(e.target.value as "main" | "daily" | "side")} className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none flex-1">
                            <option value="main">Main</option>
                            <option value="daily">Daily</option>
                            <option value="side">Side</option>
                        </select>
                        <input type="number" value={newXP} onChange={e => setNewXP(+e.target.value)} placeholder="XP" className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none w-20" />
                        <input type="number" value={newGold} onChange={e => setNewGold(+e.target.value)} placeholder="Gold" className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none w-20" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddQuest} className="px-4 py-2 bg-[var(--color-neon-cyan)] text-black font-bold rounded-lg text-sm hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition">确认</button>
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm hover:bg-white/10 transition">取消</button>
                    </div>
                </div>
            )}
        </div>
    );
}
