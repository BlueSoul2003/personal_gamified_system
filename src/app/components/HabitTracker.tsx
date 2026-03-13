"use client";

import { useState } from "react";
import { useGame } from "../context/GameContext";
import { Clock } from "lucide-react";

export default function HabitTracker() {
    const { state, completeHabit, addHabit } = useGame();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [name, setName] = useState("");
    const [time, setTime] = useState("");

    const handleAdd = () => {
        if (!name || !time) return;
        addHabit({ name, time, streak: 0, completedToday: false });
        setName("");
        setTime("");
        setIsFormOpen(false);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="pixel-font text-sm text-[var(--neon-cyan)] mb-2">&gt; Micro-Habits</h3>
                    <p className="text-xs text-gray-500 tech-font">Atomic routines. Minimal resistance.</p>
                </div>
                <button className="btn-pixel bg-[var(--neon-purple)]" onClick={() => setIsFormOpen(!isFormOpen)}>
                    + ADD HABIT
                </button>
            </div>

            {isFormOpen && (
                <div className="mb-6 pixel-panel p-4 bg-black border-dashed border-gray-600 transition-all flex flex-col md:flex-row gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Routine Name..."
                        className="bg-gray-800 border-2 border-gray-600 text-white text-xs p-2 tech-font w-full focus:outline-none focus:border-[var(--neon-cyan)]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="time"
                        className="bg-gray-800 border-2 border-gray-600 text-[var(--neon-cyan)] text-xs p-2 tech-font w-full md:w-auto focus:outline-none focus:border-[var(--neon-cyan)]"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <button className="btn-pixel w-full md:w-auto shrink-0 bg-[var(--neon-cyan)] text-black" onClick={handleAdd}>PROGRAM</button>
                </div>
            )}

            <div className="grid gap-3">
                {!state.habits || state.habits.length === 0 ? (
                    <p className="text-gray-500 text-xs tech-font text-center p-4 border border-dashed border-gray-700">No habits tracked yet.</p>
                ) : (
                    state.habits.map((habit) => (
                        <div key={habit.id} className={`flex items-center justify-between p-3 pixel-panel bg-opacity-30 ${habit.completedToday ? "opacity-50" : "opacity-100"}`}>
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    className="habit-checkbox"
                                    checked={habit.completedToday}
                                    onChange={() => completeHabit(habit.id)}
                                />
                                <div>
                                    <div className={`tech-font text-sm ${habit.completedToday ? "line-through text-gray-500" : "text-white"}`}>{habit.name}</div>
                                    <div className="text-[10px] text-gray-400 pixel-font mt-1 flex items-center gap-2">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {habit.time}</span>
                                        <span className="text-yellow-400">🔥 {habit.streak}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
