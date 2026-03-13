"use client";

import { Activity } from "lucide-react";
import { useGame } from "../context/GameContext";

interface SessionLogProps {
    inline?: boolean;
}

export default function SessionLog({ inline }: SessionLogProps) {
    const { state } = useGame();

    if (inline) {
        return (
            <div className="space-y-1.5 text-xs text-[var(--neon-purple)] max-h-36 overflow-y-auto w-full tech-font">
                {state.sessionLog.length === 0 ? (
                    <p className="text-gray-600">— 系统初始化完毕 —</p>
                ) : (
                    [...state.sessionLog].map((log, i) => (
                        <p key={i} className="text-gray-300">{log}</p>
                    ))
                )}
            </div>
        );
    }

    return (
        <div className="glass-panel p-5">
            <h2 className="text-[1.05rem] font-bold border-b border-white/[0.08] pb-2.5 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> 今日日志 (Session Log)
            </h2>
            <div className="space-y-1.5 text-xs text-gray-400 max-h-36 overflow-y-auto font-[family-name:var(--font-heading)]">
                {state.sessionLog.length === 0 ? (
                    <p className="text-gray-600">— 系统初始化完毕 —</p>
                ) : (
                    state.sessionLog.map((log, i) => (
                        <p key={i} className="text-gray-300">{log}</p>
                    ))
                )}
            </div>
        </div>
    );
}
