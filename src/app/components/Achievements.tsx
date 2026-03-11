"use client";

import { Award, Shield, Cpu, Youtube, Lock } from "lucide-react";

interface Badge {
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    progress?: { current: number; max: number };
}

const BADGES: Badge[] = [
    { title: "Dean's List", description: "Maintain a high academic standing.", icon: <Shield className="w-6 h-6" />, unlocked: true, progress: { current: 3.9, max: 4.0 } },
    { title: "First Digital Circuit", description: "Successfully built a working digital logic circuit.", icon: <Cpu className="w-6 h-6" />, unlocked: true },
    { title: "100 Subscribers", description: "Reach the first major YouTube milestone.", icon: <Youtube className="w-6 h-6 text-red-500" />, unlocked: false, progress: { current: 71, max: 100 } },
    { title: "Quantum Mastery", description: "Complete the advanced mechanics module.", icon: <Lock className="w-6 h-6" />, unlocked: false },
    { title: "1K Subscribers", description: "Reach 1,000 YouTube subscribers.", icon: <Lock className="w-6 h-6" />, unlocked: false },
    { title: "Passive Income Lv.3", description: "Establish 3 automated income streams.", icon: <Lock className="w-6 h-6" />, unlocked: false },
];

export default function Achievements() {
    return (
        <div className="glass-panel p-5 flex-grow overflow-y-auto">
            <h2 className="text-[1.05rem] font-bold border-b border-white/[0.08] pb-2.5 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" /> 成就殿堂 (Achievements)
            </h2>
            <div className="space-y-3.5">
                {BADGES.map(b => (
                    <div key={b.title} className={`flex items-center gap-3.5 p-3.5 bg-black/20 border border-white/5 rounded-xl transition ${b.unlocked ? "hover:-translate-x-1 hover:bg-white/[0.03]" : "opacity-40 grayscale"}`}>
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/5 to-black/30 flex justify-center items-center text-[var(--color-neon-cyan)] border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(255,255,255,0.06)] shrink-0">
                            {b.icon}
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className="text-sm font-semibold">{b.title}</h4>
                                {b.progress && <span className="text-xs text-[var(--color-neon-cyan)] font-[family-name:var(--font-heading)]">{b.progress.current} / {b.progress.max}</span>}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{b.description}</p>
                            {b.progress && (
                                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-[var(--color-neon-cyan)] rounded-full transition-all duration-1000 shadow-[0_0_8px_var(--color-neon-cyan)]" style={{ width: `${Math.min(100, Math.max(0, (b.progress.current / b.progress.max) * 100))}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
