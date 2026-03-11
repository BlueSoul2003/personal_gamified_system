"use client";

import React, { useState, useEffect } from 'react';
import { Maximize, Zap, Waves, Target, Info, ChevronRight, ChevronLeft, Presentation, Home } from 'lucide-react';
import Link from 'next/link';

export default function QuantumMechanicsCh1() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

    const slide = slides[currentSlide];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8 flex flex-col">
            {/* Header & Progress */}
            <header className="max-w-6xl mx-auto w-full mb-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                        <Link href="/" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                            <Home className="w-5 h-5" />
                        </Link>
                        <h1
                            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
                            <Presentation className="text-blue-400 w-8 h-8" />
                            Intro to Quantum Mechanics
                        </h1>
                        </div>
                        <p className="text-slate-400 mt-1 ml-12">SSCP 3613 • First Principles Exploration</p>
                    </div>
                    <div className="text-slate-500 font-mono text-sm">
                        Slide {currentSlide + 1} of {slides.length}
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
                </div>
            </header>

            {/* Main Slide Content */}
            <main className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">

                    {/* Left Pane: Lecture Notes */}
                    <div
                        className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 flex flex-col shadow-xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                            <div className="p-2 bg-slate-900 rounded-lg shadow-inner">
                                {slide.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-100">{slide.title}</h2>
                        </div>
                        <div className="prose prose-invert prose-slate text-slate-300 leading-relaxed space-y-4 overflow-y-auto w-full max-w-none">
                            {slide.notes}
                        </div>
                    </div>

                    {/* Right Pane: Interactive Simulation */}
                    <div
                        className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 flex flex-col shadow-xl justify-center items-center relative overflow-hidden">
                        <div
                            className="absolute top-4 left-4 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Interactive Module
                        </div>
                        <div className="w-full max-w-lg mt-6">
                            {slide.interactive}
                        </div>
                    </div>

                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mt-6">
                    <button onClick={prevSlide} disabled={currentSlide === 0} className={`flex items-center gap-2 px-6 py-3
                rounded-lg font-bold transition-all ${currentSlide === 0
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95 shadow-lg'}`}>
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>

                    <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className={`flex items-center gap-2
                px-6 py-3 rounded-lg font-bold transition-all ${currentSlide === slides.length - 1
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/50'}`}>
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </main>
        </div>
    );
}

// =========================================================
// INTERACTIVE COMPONENTS
// =========================================================

function RegimesInteractive() {
    const [sizeLog, setSizeLog] = useState(-5);
    const [speedLog, setSpeedLog] = useState(4);

    let regime = "Classical Mechanics";
    let color = "bg-blue-500 text-blue-400 border-blue-500";
    const isSmall = sizeLog <= -9;
    const isFast = speedLog >= 7;

    if (isSmall && isFast) {
        regime = "Quantum Field Theory";
        color = "bg-purple-500 text-purple-400 border-purple-500";
    } else if (isSmall && !isFast) {
        regime = "Quantum Mechanics";
        color = "bg-emerald-500 text-emerald-400 border-emerald-500";
    } else if (!isSmall && isFast) {
        regime = "Relativistic Mechanics";
        color = "bg-orange-500 text-orange-400 border-orange-500";
    }

    return (
        <div className="space-y-8 w-full">
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">Size: 10<sup>{sizeLog}</sup> m</span>
                    <span className="text-slate-400">{sizeLog <= -9 ? 'Microscopic (Atoms)' : 'Macroscopic (Apples)'
                        }</span>
                </div>
                <input type="range" min="-15" max="3" value={sizeLog} onChange={(e) => setSizeLog(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">Speed: 10<sup>{speedLog}</sup> m/s</span>
                    <span className="text-slate-400">{speedLog >= 7 ? 'Near Light Speed (c)' : 'Everyday Speeds'}</span>
                </div>
                <input type="range" min="0" max="8" value={speedLog} onChange={(e) => setSpeedLog(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <div className={`p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all
            duration-500 ${color.split(' ')[0]} bg-opacity-20 border-2 ${color.split(' ')[2]} shadow-lg`}>
                <h3 className={`text-2xl font-black uppercase tracking-wider ${color.split(' ')[1]}`}>{regime}</h3>
            </div>
        </div>
    );
}

function HeisenbergInteractive() {
    const [precision, setPrecision] = useState(50);
    const positionSpread = 105 - precision;
    const momentumSpread = precision * 1.5 + 10;

    return (
        <div className="space-y-8 w-full">
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-300">
                    <span>Squeeze Position (Decrease Δx)</span>
                </div>
                <input
                    type="range" min="1" max="100" value={precision}
                    onChange={(e) => setPrecision(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
            </div>

            <div className="relative h-64 bg-slate-900 rounded-xl flex flex-col items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
                {/* Position visual */}
                <div className="absolute top-1/4 flex flex-col items-center w-full">
                    <span className="text-sm font-bold text-slate-400 mb-3 tracking-widest">POSITION SPREAD (Δx)</span>
                    <div
                        className="h-8 bg-blue-500 rounded-full blur-[2px] transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ width: `${positionSpread}px`, opacity: precision / 100 + 0.2 }}
                    ></div>
                </div>

                {/* Momentum visual */}
                <div className="absolute bottom-1/4 flex flex-col items-center w-full">
                    <span className="text-sm font-bold text-slate-400 mb-3 tracking-widest">MOMENTUM UNCERTAINTY (Δp)</span>
                    <div className="flex items-center justify-center space-x-1 transition-all duration-200" style={{ width: `${momentumSpread}px` }}>
                        <div className="h-2 bg-red-500 flex-grow relative opacity-70 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            <div className="absolute left-0 -top-1.5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-red-500"></div>
                            <div className="absolute right-0 -top-1.5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-red-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PhotoelectricInteractive() {
    const [wavelength, setWavelength] = useState(700);
    const [animating, setAnimating] = useState(false);

    const energy = 1240 / wavelength;
    const workFunction = 2.0;
    const isEjected = energy >= workFunction;
    const kineticEnergy = isEjected ? energy - workFunction : 0;

    let strokeColor = "#ef4444";
    if (wavelength < 450) strokeColor = "#a855f7";
    else if (wavelength < 500) strokeColor = "#3b82f6";
    else if (wavelength < 580) strokeColor = "#22c55e";
    else if (wavelength < 620) strokeColor = "#eab308";

    useEffect(() => {
        if (isEjected) {
            setAnimating(false);
            setTimeout(() => setAnimating(true), 50);
        } else {
            setAnimating(false);
        }
    }, [wavelength, isEjected]);

    const animDuration = isEjected ? Math.max(0.4, 2 - kineticEnergy) : 0;

    return (
        <div className="space-y-6 w-full">
            <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">Light Wavelength: {wavelength} nm</span>
                    <span className={isEjected ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                        Photon Energy: {energy.toFixed(2)} eV
                    </span>
                </div>
                <input
                    type="range" min="300" max="800" value={wavelength} step="10"
                    onChange={(e) => setWavelength(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-2"
                    style={{ accentColor: strokeColor }}
                />
            </div>

            <div className="relative h-56 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-end shadow-inner">
                <div className="w-full h-16 bg-slate-600 relative flex items-center justify-center border-t-4 border-slate-500">
                    <span className="text-slate-900 font-black tracking-widest">POTASSIUM METAL (Φ = 2.0 eV)</span>
                </div>

                <svg className="absolute left-12 top-4 w-32 h-32" viewBox="0 0 100 100">
                    <path
                        d="M 10 0 Q 25 10 10 20 T 10 40 T 10 60 T 10 80"
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="5"
                        className="animate-pulse drop-shadow-md"
                    />
                </svg>

                {isEjected && animating && (
                    <div
                        className="absolute w-5 h-5 bg-blue-300 rounded-full shadow-[0_0_15px_rgba(147,197,253,1)]"
                        style={{
                            left: '50px', bottom: '60px', animation: `shootOut ${animDuration}s linear infinite`
                        }} />
                )}

                {!isEjected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-10">
                        <span className="text-red-400 font-bold bg-slate-900/90 px-4 py-2 rounded border border-red-900 shadow-lg">
                            Energy too low! No electron ejected.
                        </span>
                    </div>
                )}

                <style dangerouslySetInnerHTML={{
                    __html: ` @keyframes shootOut { 0% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(250px, -200px); opacity: 0; } } `}} />
            </div>

            <div className="text-center font-mono text-sm bg-slate-900 p-3 rounded-lg border border-slate-700 text-slate-400">
                Resulting Electron Kinetic Energy: <strong className="text-white text-base">{kineticEnergy.toFixed(2)}
                    eV</strong>
            </div>
        </div>
    );
}

function DeBroglieInteractive() {
    const [selectedPreset, setSelectedPreset] = useState("bullet");

    const presets: Record<string, { name: string, mass: number, velocity: number }> = {
        bullet: { name: "100g Bullet", mass: 0.1, velocity: 900 },
        electron: { name: "Electron", mass: 9.11e-31, velocity: 1e6 },
        proton: { name: "Proton (70MeV)", mass: 1.67e-27, velocity: 1.15e8 },
    };

    const h = 6.626e-34;
    const active = presets[selectedPreset];
    const p = active.mass * active.velocity;
    const lambda = h / p;

    return (
        <div className="space-y-6 w-full">
            <div className="grid grid-cols-3 gap-3">
                {Object.keys(presets).map(key => (
                    <button key={key} onClick={() => setSelectedPreset(key)}
                        className={`py-3 px-2 rounded-lg text-sm font-bold transition-all shadow-md ${selectedPreset === key
                                ? 'bg-cyan-600 text-white scale-105 border-b-4 border-cyan-800'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border-b-4 border-slate-950 hover:text-white'
                            }`}
                    >
                        {presets[key].name}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <span className="text-slate-400 font-bold">Mass (m)</span>
                    <span className="font-mono text-lg">{active.mass.toExponential(2)} kg</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <span className="text-slate-400 font-bold">Velocity (v)</span>
                    <span className="font-mono text-lg">{active.velocity.toExponential(2)} m/s</span>
                </div>
                <div className="flex justify-between items-center text-cyan-400 pt-2">
                    <span className="font-bold text-lg">Wavelength (λ)</span>
                    <span className="font-mono text-2xl font-black">{lambda.toExponential(3)} m</span>
                </div>
            </div>

            <div className="flex items-start space-x-4 bg-slate-900/50 p-4 rounded-xl text-sm border-l-4 border-cyan-500">
                <Info className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">
                    {lambda < 1e-20
                        ? "Notice the exponent (-36). This wavelength is a billion-trillion times smaller than an atomic nucleus. Because there are no physical gaps this small in the universe, wave behavior (like diffraction) is impossible to observe."
                        : "Notice the exponent. This wavelength is on the scale of atomic spacing (picometers to nanometers). If we fire this particle through a crystal lattice, we will observe measurable wave interference patterns!"
                    } </p>
            </div>
        </div>
    );
}

// =========================================================
// SLIDE DATA
// =========================================================

const slides = [
    {
        title: "1. The Physics Map",
        icon:
            <Maximize className="w-6 h-6 text-blue-400" />,
        interactive:
            <RegimesInteractive />,
        notes: (
            <>
                <p>
                    For centuries, Newton's Classical Mechanics ruled physics. It perfectly predicts the arc of a thrown apple
                    and the orbits of planets. But <strong>Classical Mechanics is an illusion</strong> that only works for
                    large, slow things.
                </p>
                <p>
                    When we push the limits of reality, the rules shatter:
                </p>
                <ul className="space-y-2 mt-4 ml-4 list-disc">
                    <li><strong>Go too fast</strong> (approaching <span className="font-serif text-blue-300 text-lg">c = 3 ×
                        10<sup>8</sup> m/s</span>): Time dilates and space contracts. We need <em>Einstein's
                            Relativity</em>.</li>
                    <li><strong>Shrink too small</strong> (atomic scale, <span className="font-serif text-emerald-300 text-lg">≤
                        10<sup>-9</sup> m</span>): Particles stop behaving like solid objects and start acting like waves of
                        probability. We enter <em>Quantum Mechanics</em>.</li>
                    <li><strong>Do both simultaneously:</strong> We need the ultimate framework, <em>Quantum Field Theory</em>.
                    </li>
                </ul>
                <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg mt-6">
                    <strong>Interactive:</strong> Drag the sliders to see how extreme size and speed dictate which "rulebook" of
                    physics we must use.
                </div>
            </>
        )
    },
    {
        title: "2. The Measurement Problem",
        icon:
            <Target className="w-6 h-6 text-emerald-400" />,
        interactive:
            <HeisenbergInteractive />,
        notes: (
            <>
                <p>
                    The <strong>Heisenberg Uncertainty Principle</strong> destroys the idea of a predictable, clockwork
                    universe. It proves you can <em>never</em> know both the exact position and momentum of a particle
                    simultaneously:
                </p>
                <div className="my-5 text-center">
                    <span
                        className="font-serif text-emerald-300 text-2xl tracking-widest bg-slate-900/80 px-6 py-3 rounded-lg border border-emerald-500/30 shadow-inner inline-block">
                        Δx · Δp ≥ ℏ/2
                    </span>
                </div>
                <p className="text-lg text-emerald-300 font-bold mt-6">
                    Why? Because observation is physical.
                </p>
                <p>
                    To "see" a macroscopic object like a car, light bounces off it. The car is so massive, it doesn't even
                    flinch.
                </p>
                <p>
                    But to "see" a microscopic electron, we must shoot a high-energy photon at it. This collision
                    <strong>violently kicks the electron</strong>. By the time the photon bounces back to tell us exactly
                    <em>where</em> the electron was (Precise Position, <span className="font-serif italic">Δx ↓</span>), the
                    collision has wildly and unpredictably altered the electron's speed (Uncertain Momentum, <span
                        className="font-serif italic">Δp ↑</span>).
                </p>
                <p className="font-bold text-slate-200">
                    You cannot observe the quantum world without breaking it.
                </p>
            </>
        )
    },
    {
        title: "3. The Photoelectric Effect",
        icon:
            <Zap className="w-6 h-6 text-yellow-400" />,
        interactive:
            <PhotoelectricInteractive />,
        notes: (
            <>
                <p>
                    Before 1905, physics assumed light was a smooth, continuous wave. Einstein flipped the script: <strong>Light
                        is a hail of discrete energy packets called Photons.</strong>
                </p>
                <p>
                    Think of a metal surface as a strict vending machine. To eject an electron from Potassium, you must pay a
                    strict fee of <strong>2.0 eV</strong> (the Work Function).
                </p>
                <ul className="space-y-4 mt-4">
                    <li className="bg-slate-900/50 p-3 rounded border-l-4 border-red-500">
                        <strong>High Intensity, Low Energy (Red Light):</strong> A 700nm photon carries only ~1.77 eV. It
                        doesn't matter if you shine a blindingly bright laser (firing trillions of 'coins' at once)—if no single
                        coin is worth 2.0 eV, the machine yields nothing.
                    </li>
                    <li className="bg-slate-900/50 p-3 rounded border-l-4 border-blue-500">
                        <strong>Low Intensity, High Energy (Blue Light):</strong> A single 500nm photon packs ~2.48 eV. It pays
                        the 2.0 eV fee, and the leftover 0.48 eV acts as explosive kinetic energy, blasting the electron out of
                        the metal!
                    </li>
                </ul>
            </>
        )
    },
    {
        title: "4. Wave-Particle Duality",
        icon:
            <Waves className="w-6 h-6 text-cyan-400" />,
        interactive:
            <DeBroglieInteractive />,
        notes: (
            <>
                <p>
                    If light waves can act like physical bullets (photons), <strong>can a physical bullet act like a
                        wave?</strong>
                </p>
                <p>
                    In 1924, Louis de Broglie proved that <em>all</em> matter has a wavelength:
                </p>
                <div className="my-5 text-center">
                    <span
                        className="font-serif text-cyan-300 text-2xl tracking-widest bg-slate-900/80 px-6 py-3 rounded-lg border border-cyan-500/30 shadow-inner inline-block">
                        λ = h / p
                    </span>
                </div>
                <p className="text-lg text-cyan-300 font-bold mt-6">
                    So why doesn't a speeding bullet ripple and bend around corners? Scale.
                </p>
                <p>
                    To observe wave behavior (like diffraction), a wave must pass through a gap roughly the size of its
                    wavelength. A 100g bullet moving at 900 m/s has a wavelength of <strong><span
                            className="font-serif text-cyan-300 text-lg">10<sup>-36</sup> meters</span></strong>—billions of
                    times smaller than a single atomic nucleus.
                </p>
                <p className="font-bold text-slate-200">
                    There is literally no gap in the physical universe small enough to make a bullet diffract. So, macroscopic
                    objects travel in boring, straight lines, while microscopic electrons smear and ripple through space.
                </p>
            </>
        )
    }
];
