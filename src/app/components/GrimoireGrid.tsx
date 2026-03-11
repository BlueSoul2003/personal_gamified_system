"use client";

import { useState } from "react";
import { PlusCircle, Cpu, CircuitBoard, Flame, Book, Globe, FlaskConical, Microscope, Terminal, Video, Camera, Laptop, Rocket } from "lucide-react";
import { useGame, GrimoireItem } from "../context/GameContext";

// Map icon string names to components
const ICON_MAP: Record<string, React.ReactNode> = {
    Cpu: <Cpu className="w-8 h-8" />,
    CircuitBoard: <CircuitBoard className="w-8 h-8" />,
    Flame: <Flame className="w-8 h-8" />,
    Book: <Book className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    FlaskConical: <FlaskConical className="w-8 h-8" />,
    Microscope: <Microscope className="w-8 h-8" />,
    Terminal: <Terminal className="w-8 h-8" />,
    Video: <Video className="w-8 h-8" />,
    Camera: <Camera className="w-8 h-8" />,
    Laptop: <Laptop className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />,
};

const ICON_OPTIONS = ["Cpu", "CircuitBoard", "Flame", "Book", "Globe", "FlaskConical", "Microscope", "Terminal", "Video", "Camera", "Laptop", "Rocket"];
const COLOR_OPTIONS = [
    { label: "Cyan", value: "text-[var(--color-neon-cyan)]" },
    { label: "Yellow", value: "text-yellow-400" },
    { label: "Purple", value: "text-[var(--color-neon-purple)]" },
    { label: "Pink", value: "text-pink-400" },
    { label: "Green", value: "text-emerald-400" },
];

export default function GrimoireGrid() {
    const { state, addGrimoireItem, appendLog } = useGame();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [href, setHref] = useState("#");
    const [icon, setIcon] = useState("Cpu");
    const [color, setColor] = useState(COLOR_OPTIONS[0].value);

    const handleAdd = () => {
        if (!title.trim()) return;
        addGrimoireItem({ title, description: desc, href, icon, color });
        appendLog(`📖 新增知识模块「${title}」`);
        setTitle(""); setDesc(""); setHref("#"); setIcon("Cpu"); setColor(COLOR_OPTIONS[0].value);
        setShowForm(false);
    };

    return (
        <div>
            <p className="text-xs text-gray-400 mb-5">记录你开发的交互式学习模块，点击激活知识矩阵。</p>
            <div className="grid grid-cols-1 gap-4">
                {state.grimoire.map((item: GrimoireItem) => (
                    <a key={item.id} href={item.href} className="grimoire-card block p-4 rounded-xl cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`${item.color} group-hover:animate-pulse`}>
                                {ICON_MAP[item.icon] || <Cpu className="w-8 h-8" />}
                            </span>
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-[family-name:var(--font-heading)] border border-gray-600">HTML</span>
                        </div>
                        <h4 className={`font-bold mb-1 group-hover:${item.color.replace("text-", "text-")} transition`}>{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                    </a>
                ))}

                {/* Add Module */}
                {!showForm ? (
                    <div onClick={() => setShowForm(true)} className="border border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-gray-600 hover:text-[var(--color-neon-purple)] hover:border-[var(--color-neon-purple)] transition cursor-pointer h-24">
                        <PlusCircle className="w-6 h-6 mb-1" />
                        <span className="text-xs">注入新知识模块</span>
                    </div>
                ) : (
                    <div className="border border-[var(--color-panel-border)] rounded-xl p-4 bg-black/30 space-y-3">
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="模块名称 (Module Title)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon-cyan)] transition" />
                        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="描述 (Description)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon-cyan)] transition" />
                        <input value={href} onChange={e => setHref(e.target.value)} placeholder="链接 URL (Link)" className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-neon-cyan)] transition" />
                        <div className="flex gap-3">
                            <select value={icon} onChange={e => setIcon(e.target.value)} className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none flex-1">
                                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                            <select value={color} onChange={e => setColor(e.target.value)} className="bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none flex-1">
                                {COLOR_OPTIONS.map(c => <option key={c.label} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="px-4 py-2 bg-[var(--color-neon-cyan)] text-black font-bold rounded-lg text-sm hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition">确认</button>
                            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/5 border border-gray-700 rounded-lg text-sm hover:bg-white/10 transition">取消</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
