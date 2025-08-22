// Brief: Simple 60s rest timer with start/pause and reset (disabled while running).
import React, { useEffect, useRef, useState } from "react";

export default function RestTimer({ seconds = 60, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(ref.current);
          ref.current = null;
          setRunning(false);
          onDone && onDone();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, onDone]);

  const reset = () => {
    // Do not allow reset while running
    if (running) return;
    setRemaining(seconds);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
      <span className="font-mono font-bold text-blue-700">{mm}:{ss}</span>
      {!running ? (
        <button
          onClick={() => setRunning(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full"
        >
          Start
        </button>
      ) : (
        <button
          onClick={() => setRunning(false)}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-2 py-1 rounded-full"
        >
          Pause
        </button>
      )}
      <button
        onClick={reset}
        disabled={running}
        className={`bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full ${running ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Reset
      </button>
    </div>
  );
}
