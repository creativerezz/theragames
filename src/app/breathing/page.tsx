"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2" | "done";
type BreathingTechnique = "478" | "box" | "coherent" | "belly";

interface TechniqueConfig {
  name: string;
  description: string;
  phases: {
    phase: BreathingPhase;
    duration: number;
    label: string;
  }[];
  cycles: number;
}

const techniques: Record<BreathingTechnique, TechniqueConfig> = {
  "478": {
    name: "4-7-8 Breathing",
    description: "Calming technique: 4s inhale, 7s hold, 8s exhale",
    phases: [
      { phase: "inhale", duration: 4000, label: "Inhale" },
      { phase: "hold1", duration: 7000, label: "Hold" },
      { phase: "exhale", duration: 8000, label: "Exhale" },
    ],
    cycles: 4,
  },
  box: {
    name: "Box Breathing",
    description: "Square breathing: 4s for each phase",
    phases: [
      { phase: "inhale", duration: 4000, label: "Inhale" },
      { phase: "hold1", duration: 4000, label: "Hold" },
      { phase: "exhale", duration: 4000, label: "Exhale" },
      { phase: "hold2", duration: 4000, label: "Hold Empty" },
    ],
    cycles: 4,
  },
  coherent: {
    name: "Coherent Breathing",
    description: "5-5 breathing for heart coherence",
    phases: [
      { phase: "inhale", duration: 5000, label: "Inhale" },
      { phase: "exhale", duration: 5000, label: "Exhale" },
    ],
    cycles: 10,
  },
  belly: {
    name: "Belly Breathing",
    description: "Deep diaphragmatic breathing",
    phases: [
      { phase: "inhale", duration: 4000, label: "Breathe In (Belly Expands)" },
      { phase: "hold1", duration: 2000, label: "Pause" },
      { phase: "exhale", duration: 6000, label: "Breathe Out (Belly Contracts)" },
    ],
    cycles: 6,
  },
};

export default function BreathingGame() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const technique = selectedTechnique ? techniques[selectedTechnique] : null;
  const currentPhase = technique ? technique.phases[currentPhaseIndex] : null;

  useEffect(() => {
    if (!isActive || !currentPhase) return;

    let frame: number;
    const duration = currentPhase.duration;
    const start = performance.now();

    function loop(now: number) {
      const t = (now - start) / duration;
      setProgress(Math.min(t, 1));
      if (t < 1) {
        frame = requestAnimationFrame(loop);
      } else {
        setProgress(0);
        const nextIndex = (currentPhaseIndex + 1) % technique!.phases.length;
        if (nextIndex === 0) {
          const newCycle = cycleCount + 1;
          setCycleCount(newCycle);
          if (newCycle >= technique!.cycles) {
            setIsActive(false);
            return;
          }
        }
        setCurrentPhaseIndex(nextIndex);
      }
    }
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isActive, currentPhaseIndex, currentPhase, cycleCount, technique]);

  const handleStart = () => {
    setIsActive(true);
    setCycleCount(0);
    setCurrentPhaseIndex(0);
    setProgress(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCycleCount(0);
    setCurrentPhaseIndex(0);
    setProgress(0);
  };

  const getCircleProps = () => {
    if (!currentPhase) return { scale: 1, opacity: 0.8, glow: 30 };
    
    const baseSize = 150;
    const maxSize = 250;
    const minSize = 100;
    
    let scale, opacity, glow;
    
    if (currentPhase.phase === "inhale") {
      // Smooth expansion during inhale
      scale = minSize + (maxSize - minSize) * progress;
      opacity = 0.7 + 0.3 * progress;
      glow = 20 + 40 * progress;
    } else if (currentPhase.phase === "exhale") {
      // Smooth contraction during exhale
      scale = maxSize - (maxSize - minSize) * progress;
      opacity = 1 - 0.3 * progress;
      glow = 60 - 40 * progress;
    } else {
      // Hold phases - gentle pulsing
      const pulse = Math.sin(Date.now() * 0.003) * 0.1;
      scale = maxSize + pulse * 20;
      opacity = 0.85 + pulse * 0.15;
      glow = 50 + pulse * 10;
    }
    
    return { scale, opacity, glow };
  };

  const circleProps = getCircleProps();

  if (!selectedTechnique) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Choose a Breathing Technique</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
          {(Object.entries(techniques) as [BreathingTechnique, TechniqueConfig][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedTechnique(key)}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{config.name}</h2>
              <p className="text-gray-600">{config.description}</p>
              <p className="text-sm text-gray-500 mt-2">{config.cycles} cycles</p>
            </button>
          ))}
        </div>
        <Link href="/" className="mt-10 text-gray-700 underline">
          ← Back to games
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{technique.name}</h1>
        <p className="text-gray-600 mt-2">{technique.description}</p>
      </div>

      {!isActive && cycleCount === 0 ? (
        <div className="flex flex-col items-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-green-500 text-white rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Start Session
          </button>
          <button
            onClick={() => setSelectedTechnique(null)}
            className="mt-4 text-gray-600 underline"
          >
            Choose different technique
          </button>
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
            <div
              className="rounded-full transition-all duration-100 ease-out"
              style={{
                width: circleProps.scale,
                height: circleProps.scale,
                background: `radial-gradient(circle, ${
                  currentPhase?.phase.includes('hold') 
                    ? 'rgba(96, 165, 250, 0.9)' 
                    : currentPhase?.phase === 'inhale' 
                      ? 'rgba(52, 211, 153, 0.9)' 
                      : 'rgba(248, 113, 113, 0.9)'
                }, ${
                  currentPhase?.phase.includes('hold') 
                    ? 'rgba(59, 130, 246, 0.6)' 
                    : currentPhase?.phase === 'inhale' 
                      ? 'rgba(16, 185, 129, 0.6)' 
                      : 'rgba(239, 68, 68, 0.6)'
                })`,
                opacity: circleProps.opacity,
                boxShadow: `0 0 ${circleProps.glow}px ${
                  currentPhase?.phase.includes('hold') 
                    ? 'rgba(59, 130, 246, 0.5)' 
                    : currentPhase?.phase === 'inhale' 
                      ? 'rgba(16, 185, 129, 0.5)' 
                      : 'rgba(239, 68, 68, 0.5)'
                }`,
                filter: 'blur(0.5px)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-2xl drop-shadow-lg">
                {Math.ceil((currentPhase?.duration || 0) * (1 - progress) / 1000)}s
              </span>
            </div>
          </div>
          
          <h2 className="mt-8 text-4xl font-bold text-gray-700">
            {currentPhase?.label}
          </h2>
          
          <div className="mt-4 flex items-center gap-4">
            <p className="text-gray-600">Cycle {cycleCount + 1} of {technique.cycles}</p>
            <div className="flex gap-1">
              {Array.from({ length: technique.cycles }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < cycleCount ? 'bg-green-500' : i === cycleCount ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {isActive && cycleCount >= technique.cycles ? (
            <div className="mt-8 flex flex-col items-center">
              <p className="text-2xl font-semibold text-green-600 mb-4">Session Complete! 🎉</p>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Repeat Session
              </button>
            </div>
          ) : (
            <button
              onClick={handleStop}
              className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Stop Session
            </button>
          )}
        </>
      )}

      <Link href="/" className="mt-10 text-gray-700 underline">
        ← Back to games
      </Link>
    </div>
  );
}