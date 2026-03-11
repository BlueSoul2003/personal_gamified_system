"use client";

import { useState } from "react";
import { Hexagon, Network, Brain, Boxes, Sparkles, Lock, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useGame } from "../context/GameContext";

const CORE_SKILLS = [
    { name: "Experimental Physics", level: 3, color: "text-[var(--color-neon-cyan)]" },
    { name: "Electronics", level: 2, color: "text-[var(--color-neon-cyan)]" },
    { name: "Quantum Mechanics", level: 1, color: "text-[var(--color-neon-cyan)]" },
];

const SPECIAL_ABILITIES = [
    { name: "Psychological Models", level: 2, color: "text-pink-400" },
    { name: "Philosophy", level: 3, color: "text-pink-400" },
    { name: "Video Production", level: 4, color: "text-pink-400" },
];

const ATTRIBUTES = [
    { label: "INT (物理/量子)", level: 8, pct: 80, color: "bg-[var(--color-neon-cyan)]", textColor: "text-[var(--color-neon-cyan)]" },
    { label: "TEC (3D打印/工程)", level: 6, pct: 60, color: "bg-yellow-400", textColor: "text-yellow-400" },
    { label: "CHA (自媒体/教学)", level: 4, pct: 40, color: "bg-pink-500", textColor: "text-pink-500" },
    { label: "WIS (哲学/心理)", level: 5, pct: 50, color: "bg-[var(--color-neon-purple)]", textColor: "text-[var(--color-neon-purple)]" },
];

const LOCKED_SKILLS = [
    "高级微波系统设计",
    "YouTube 千粉成就",
    "自动化被动收入流",
];

export default function SkillTree() {
    const { state, addResource, removeResource, appendLog } = useGame();
    const [openIdx, setOpenIdx] = useState<number>(0);
    const [showResourceForm, setShowResourceForm] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("Hardware");

    const categories = Array.from(new Set(state.resources.map(r => r.category)));

    const handleAddResource = () => {
        if (!newItemName.trim()) return;
        addResource({ name: newItemName, category: newItemCategory });
        appendLog(`🛠️ 新增实体资源「${newItemName}」`);
        setNewItemName("");
        setShowResourceForm(false);
    };

    return (
        <aside className="lg:col-span-3 flex flex-col gap-6">
            {/* Core Attributes */}
            <div className="glass-panel p-5">
                <h2 className="text-[1.05rem] font-bold border-b border-white/[0.08] pb-2.5 mb-4 flex items-center gap-2">
                    <Hexagon className="w-5 h-5 text-[var(--color-neon-purple)]" /> 核心属性
                </h2>
                <div className="space-y-4 font-[family-name:var(--font-heading)] text-sm">
                    {ATTRIBUTES.map(a => (
                        <div key={a.label}>
                            <div className="flex justify-between mb-1">
                                <span>{a.label}</span>
                                <span className={a.textColor}>Lv.{a.level}</span>
                            </div>
                            <div className="attr-track">
                                <div className={`attr-fill ${a.color}`} style={{ width: `${a.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skill Tree Accordion */}
            <div className="glass-panel p-5 flex-grow overflow-y-auto">
                <h2 className="text-[1.05rem] font-bold border-b border-white/[0.08] pb-2.5 mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-[var(--color-neon-cyan)]" /> 技能树 (Skill Tree)
                </h2>
                <div className="space-y-1.5">
                    {/* Core Skills */}
                    <div>
                        <button onClick={() => setOpenIdx(openIdx === 0 ? -1 : 0)} className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left font-semibold text-[0.95rem] transition-all cursor-pointer ${openIdx === 0 ? "bg-[rgba(0,243,255,0.08)] border border-[rgba(0,243,255,0.25)]" : "bg-black/25 border border-transparent hover:bg-white/[0.04]"}`}>
                            <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Core Skills</span>
                            {openIdx === 0 ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openIdx === 0 ? "max-h-60 py-2" : "max-h-0"}`}>
                            <ul>
                                {CORE_SKILLS.map(s => (
                                    <li key={s.name} className="flex justify-between items-center px-3.5 py-1.5 pl-7 text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.03] rounded cursor-default transition-colors">
                                        <span>{s.name}</span>
                                        <span className={`font-[family-name:var(--font-heading)] font-bold text-xs ${s.color}`}>Lv.{s.level}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Resources (Dynamic) */}
                    <div>
                        <button onClick={() => setOpenIdx(openIdx === 1 ? -1 : 1)} className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left font-semibold text-[0.95rem] transition-all cursor-pointer ${openIdx === 1 ? "bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.25)] text-yellow-400" : "bg-black/25 border border-transparent hover:bg-white/[0.04]"}`}>
                            <span className="flex items-center gap-2 text-white"><Boxes className="w-4 h-4 text-yellow-400" /> Resources</span>
                            {openIdx === 1 ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openIdx === 1 ? "max-h-96 py-2" : "max-h-0"}`}>
                            <div className="space-y-4 px-3.5">
                                {categories.map(cat => (
                                    <div key={cat}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-3">{cat}</h4>
                                        <ul className="space-y-1">
                                            {state.resources.filter(r => r.category === cat).map(r => (
                                                <li key={r.id} className="group flex justify-between items-center py-1 pl-4 pr-2 text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.03] rounded cursor-default transition-colors">
                                                    <span>{r.name}</span>
                                                    <button 
                                                        onClick={() => { removeResource(r.id); appendLog(`🗑️ 删除了实体资源「${r.name}」`); }} 
                                                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 p-0.5 transition"
                                                        title="Remove Resource"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {/* Add Resource UI */}
                                {!showResourceForm ? (
                                    <button onClick={() => setShowResourceForm(true)} className="w-full mt-2 border border-dashed border-gray-700 rounded-lg py-2 flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:border-yellow-400 transition cursor-pointer text-xs gap-1.5">
                                        + Add Equipment
                                    </button>
                                ) : (
                                    <div className="border border-[var(--color-panel-border)] rounded-xl p-3 bg-black/30 space-y-2 mt-2">
                                        <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item Name (e.g. Soldering Iron)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400 transition" />
                                        <input value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} placeholder="Category (e.g. Hardware)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400 transition" />
                                        <div className="flex gap-2">
                                            <button onClick={handleAddResource} className="px-3 py-1.5 bg-yellow-400 text-black font-bold rounded-lg text-xs hover:shadow-[0_0_10px_rgba(251,191,36,0.5)] transition">Add</button>
                                            <button onClick={() => setShowResourceForm(false)} className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-lg text-xs hover:bg-white/10 transition">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Special Abilities */}
                    <div>
                        <button onClick={() => setOpenIdx(openIdx === 2 ? -1 : 2)} className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left font-semibold text-[0.95rem] transition-all cursor-pointer ${openIdx === 2 ? "bg-[rgba(244,114,182,0.08)] border border-[rgba(244,114,182,0.25)] text-pink-400" : "bg-black/25 border border-transparent hover:bg-white/[0.04]"}`}>
                            <span className="flex items-center gap-2 text-white"><Sparkles className="w-4 h-4 text-pink-400" /> Special Abilities</span>
                            {openIdx === 2 ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openIdx === 2 ? "max-h-60 py-2" : "max-h-0"}`}>
                            <ul>
                                {SPECIAL_ABILITIES.map(s => (
                                    <li key={s.name} className="flex justify-between items-center px-3.5 py-1.5 pl-7 text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.03] rounded cursor-default transition-colors">
                                        <span>{s.name}</span>
                                        <span className={`font-[family-name:var(--font-heading)] font-bold text-xs ${s.color}`}>Lv.{s.level}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Locked */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Locked (未解锁)</h3>
                    <ul className="space-y-2.5 text-sm text-gray-500">
                        {LOCKED_SKILLS.map(s => (
                            <li key={s} className="flex items-center gap-2 opacity-50">
                                <Lock className="w-3.5 h-3.5" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
