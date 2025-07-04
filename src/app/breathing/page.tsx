"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BreathingGame() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = phase === "hold" ? 2000 : 4000;
    const start = performance.now();

    function loop(now: number) {
      const t = (now - start) / duration;
      setProgress(Math.min(t, 1));
      if (t < 1) {
        frame = requestAnimationFrame(loop);
      } else {
        setProgress(0);
        setPhase((prev) =>
          prev === "inhale" ? "hold" : prev === "hold" ? "exhale" : "inhale",
        );
      }
    }
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const size = phase === "inhale" ? 200 + progress * 100 : phase === "exhale" ? 300 - progress * 100 : 300;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center">
      <div
        className="rounded-full bg-green-400 transition-all"
        style={{ width: size, height: size, opacity: phase === "hold" ? 0.7 : 1 }}
      />
      <h1 className="mt-8 text-4xl font-bold text-green-700 capitalize">
        {phase}
      </h1>
      <p className="text-gray-600 mt-2">Follow the circle to regulate your breath</p>
      <Link href="/" className="mt-10 text-green-700 underline">
        ← Back to games
      </Link>
    </div>
  );
}
