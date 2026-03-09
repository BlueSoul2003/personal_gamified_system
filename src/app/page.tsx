"use client";

import { useState } from "react";
import { Scroll, BookOpen } from "lucide-react";
import TopStatus from "./components/TopStatus";
import SkillTree from "./components/SkillTree";
import QuestBoard from "./components/QuestBoard";
import GrimoireGrid from "./components/GrimoireGrid";
import Achievements from "./components/Achievements";
import SessionLog from "./components/SessionLog";
import LevelUpModal from "./components/LevelUpModal";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"quests" | "grimoire">("quests");

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col items-center">
      <TopStatus />

      <main className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 flex-1">
        {/* Left Sidebar: Skill Tree */}
        <SkillTree />

        {/* Main Console: Quest Board & Grimoire */}
        <section className="lg:col-span-5 glass-panel flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] bg-black/25 rounded-t-2xl">
            <button
              onClick={() => setActiveTab("quests")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-5 font-semibold text-[0.95rem] uppercase tracking-wide relative transition cursor-pointer ${activeTab === "quests" ? "text-white" : "text-[var(--color-text-muted)] hover:text-white/80"}`}
            >
              <Scroll className="w-4 h-4" /> Quest Board
              {activeTab === "quests" && <span className="absolute bottom-[-1px] left-[20%] w-[60%] h-[3px] bg-[var(--color-neon-cyan)] shadow-[0_0_12px_rgba(0,243,255,0.6)] rounded-t" />}
            </button>
            <button
              onClick={() => setActiveTab("grimoire")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-5 font-semibold text-[0.95rem] uppercase tracking-wide relative transition cursor-pointer ${activeTab === "grimoire" ? "text-white" : "text-[var(--color-text-muted)] hover:text-white/80"}`}
            >
              <BookOpen className="w-4 h-4" /> Grimoire
              {activeTab === "grimoire" && <span className="absolute bottom-[-1px] left-[20%] w-[60%] h-[3px] bg-[var(--color-neon-cyan)] shadow-[0_0_12px_rgba(0,243,255,0.6)] rounded-t" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === "quests" ? <QuestBoard /> : <GrimoireGrid />}
          </div>
        </section>

        {/* Right Sidebar: Achievements & Session Log */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <Achievements />
          <SessionLog />
        </aside>
      </main>

      <LevelUpModal />
    </div>
  );
}
