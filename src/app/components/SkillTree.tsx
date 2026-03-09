"use client";

import { useState } from "react";
import { Hexagon, Network, Brain, Boxes, Sparkles, Lock, ChevronDown, ChevronRight } from "lucide-react";

interface AccordionSection {
    label: string;
    icon: React.ReactNode;
    skills: { name: string; level: number; color: string }[];
}

const SECTIONS: AccordionSection[] = [
    {
        label: "Core Skills",
        icon: <Brain className="w-4 h-4" />,
        skills: [
            { name: "Experimental Physics", level: 3, color: "text-[var(--color-neon-cyan)]" },
            { name: "Electronics", level: 2, color: "text-[var(--color-neon-cyan)]" },
            { name: "Quantum Mechanics", level: 4, color: "text-[var(--color-neon-cyan)]" },
        ],
    },
    {
        label: "Resource Skills",
        icon: <Boxes className="w-4 h-4" />,
        skills: [
            { name: "3D Printing", level: 5, color: "text-yellow-400" },
            { name: "Passive Income", level: 1, color: "text-yellow-400" },
        ],
    },
    {
        label: "Special Abilities",
        icon: <Sparkles className="w-4 h-4" />,
        skills: [
            { name: "Psychological Models", level: 2, color: "text-pink-400" },
            { name: "Philosophy", level: 3, color: "text-pink-400" },
            { name: "Video Production", level: 4, color: "text-pink-400" },
        ],
    },
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
    const [openIdx, setOpenIdx] = useState<number>(0);

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
                    {SECTIONS.map((sec, idx) => (
                        <div key={sec.label}>
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                                className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-lg text-left font-semibold text-[0.95rem] transition-all cursor-pointer ${openIdx === idx
                                        ? "bg-[rgba(0,243,255,0.08)] border border-[rgba(0,243,255,0.25)]"
                                        : "bg-black/25 border border-transparent hover:bg-white/[0.04]"
                                    }`}
                            >
                                <span className="flex items-center gap-2">{sec.icon} {sec.label}</span>
                                {openIdx === idx ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIdx === idx ? "max-h-60 py-2" : "max-h-0"
                                    }`}
                            >
                                <ul>
                                    {sec.skills.map(s => (
                                        <li key={s.name} className="flex justify-between items-center px-3.5 py-1.5 pl-7 text-sm text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.03] rounded cursor-default transition-colors">
                                            <span>{s.name}</span>
                                            <span className={`font-[family-name:var(--font-heading)] font-bold text-xs ${s.color}`}>Lv.{s.level}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
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
