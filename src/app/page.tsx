"use client";

import { useState } from "react";
import { Crown, CheckSquare, Swords, BrainCircuit, Book, Trophy } from "lucide-react";
import TopStatus from "./components/TopStatus";
import ModalOverlay from "./components/ModalOverlay";
import QuestBoard from "./components/QuestBoard";
import GrimoireGrid from "./components/GrimoireGrid";
import SkillTree from "./components/SkillTree";
import Achievements from "./components/Achievements";
import SessionLog from "./components/SessionLog";
import LevelUpModal from "./components/LevelUpModal";
// We haven't created these React components yet, I will mock them for now.
import HabitTracker from "./components/HabitTracker";
import Challenges from "./components/Challenges";

export default function DashboardPage() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const closeMenu = () => setActiveMenu(null);

    return (
        <div className="min-h-screen p-4 md:p-6 flex flex-col items-center">
            {/* Top Bar Layer */}
            <TopStatus />

            {/* Main Hub Grid */}
            <main className="w-full max-w-[1200px] z-10 flex-1 flex flex-col items-center justify-center p-6 mx-auto mt-10">
                <div className="hub-grid">
                    <div className="hub-portal" onClick={() => setActiveMenu("quests")}>
                        <Crown />
                        <span className="portal-name">Quest Board</span>
                    </div>
                    <div className="hub-portal" onClick={() => setActiveMenu("habits")}>
                        <CheckSquare />
                        <span className="portal-name">Habit Tracker</span>
                    </div>
                    <div className="hub-portal" onClick={() => setActiveMenu("challenges")}>
                        <Swords />
                        <span className="portal-name">Challenges</span>
                    </div>
                    <div className="hub-portal" onClick={() => setActiveMenu("skills")}>
                        <BrainCircuit />
                        <span className="portal-name">Skill Tree</span>
                    </div>
                    <div className="hub-portal" onClick={() => setActiveMenu("grimoire")}>
                        <Book />
                        <span className="portal-name">Grimoire</span>
                    </div>
                    <div className="hub-portal" onClick={() => setActiveMenu("achievements")}>
                        <Trophy />
                        <span className="portal-name">Hall of Fame</span>
                    </div>
                </div>

                <div className="w-full max-w-[800px] mt-16 glass-panel p-6 border-dashed border-gray-600 border max-h-[300px] flex flex-col hidden sm:flex">
                    <h3 className="pixel-font text-xs text-[var(--neon-purple)] mb-4">&gt;_ SYSTEM LOG</h3>
                    <div className="flex-1 overflow-y-auto">
                        <SessionLog inline />
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ModalOverlay id="quests" isOpen={activeMenu === "quests"} onClose={closeMenu} title="Quest Board">
                <QuestBoard />
            </ModalOverlay>

            <ModalOverlay id="habits" isOpen={activeMenu === "habits"} onClose={closeMenu} title="Micro-Habits">
                <HabitTracker />
            </ModalOverlay>

            <ModalOverlay id="challenges" isOpen={activeMenu === "challenges"} onClose={closeMenu} title="Active Challenges">
                <Challenges />
            </ModalOverlay>

            <ModalOverlay id="skills" isOpen={activeMenu === "skills"} onClose={closeMenu} title="Attributes & Skills">
                <SkillTree />
            </ModalOverlay>

            <ModalOverlay id="grimoire" isOpen={activeMenu === "grimoire"} onClose={closeMenu} title="Grimoire">
                <p className="text-xs text-gray-400 mb-5 tech-font">记录你开发的交互式学习模块，点击激活知识矩阵。</p>
                <GrimoireGrid />
            </ModalOverlay>

            <ModalOverlay id="achievements" isOpen={activeMenu === "achievements"} onClose={closeMenu} title="Hall of Fame">
                <Achievements />
            </ModalOverlay>

            <LevelUpModal />
        </div>
    );
}
