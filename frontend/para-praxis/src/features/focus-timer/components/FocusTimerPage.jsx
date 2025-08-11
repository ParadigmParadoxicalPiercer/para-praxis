import React, { useState } from "react";
import { useFocusTimer } from "../hooks/useFocusTimer";

export default function FocusTimerPage() {
  const {
    timeRemaining,
    isRunning,
    isCompleted,
    selectedDuration,
    setSelectedDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  } = useFocusTimer();

  const [customMinutes, setCustomMinutes] = useState(25);

  const predefinedDurations = [
    { label: "15 min", value: 15 },
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  const handleCustomDuration = () => {
    if (customMinutes > 0 && customMinutes <= 180) {
      setSelectedDuration(customMinutes);
    }
  };

  return (
    <div className="flex-1 relative w-full flex overflow-hidden items-stretch">
      {/* Background Timer Image */}
      <img
        src="/timer.png"
        alt="Timer"
  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        draggable={false}
      />

      {/* Light blue overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-blue-50 to-white/0 z-10 pointer-events-none" />

      <div className="relative z-20 flex w-full items-stretch">
        {/* Left half - Chronos inspiration */}
        <div className="w-1/2 flex flex-col justify-center items-center px-8 py-12">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight">
              TIME IS
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 mb-8 tracking-tight">
              PRECIOUS
            </h2>
            <p className="text-xl sm:text-2xl text-blue-700 font-semibold leading-relaxed mb-8">
              "Time is the most valuable thing we have, because it is the most
              irrevocable."
            </p>
            <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
              <p className="text-slate-700 text-lg leading-relaxed">
                Channel the power of{" "}
                <span className="text-blue-700 font-semibold">Chronos</span>,
                the primordial god of time. Focus your mind, harness your
                energy, and make every moment count.
              </p>
            </div>
          </div>
        </div>

        {/* Right half - Timer interface */}
        <div className="w-1/2 flex flex-col justify-center items-center px-8 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md w-full">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-8xl font-extrabold text-blue-600 mb-4 font-mono">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xl text-slate-700 font-semibold">
                {isCompleted
                  ? "Session Complete!"
                  : isRunning
                  ? "Focus Time Active"
                  : "Ready to Focus"}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                Choose Duration:
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {predefinedDurations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`py-2 px-3 rounded font-bold transition-all text-sm ${
                      selectedDuration === duration.value
                        ? "bg-blue-600 text-white border border-blue-700"
                        : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                    }`}
                    disabled={isRunning}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>

              {/* Custom Duration Input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) =>
                    setCustomMinutes(parseInt(e.target.value) || 0)
                  }
                  className="flex-1 px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 font-medium"
                  placeholder="Custom minutes"
                  min="1"
                  max="180"
                  disabled={isRunning}
                />
                <button
                  onClick={handleCustomDuration}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
                  disabled={isRunning}
                >
                  Set
                </button>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-3 mb-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors"
                >
                  START FOCUS
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded transition-colors"
                >
                  PAUSE
                </button>
              )}
              <button
                onClick={resetTimer}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3 px-6 rounded border border-slate-300 transition-colors"
              >
                RESET
              </button>
            </div>

            {/* Task Preview Area */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="text-blue-700 font-semibold mb-2">
                Current Tasks:
              </h4>
              <div className="text-slate-700 text-sm">
                <div className="text-slate-500 italic">
                  Task integration coming soon...
                </div>
                {/* This will be populated with actual tasks later */}
              </div>
            </div>

            {/* Progress indicator */}
            {selectedDuration > 0 && (
              <div className="mt-4">
                <div className="bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-sky-400 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        ((selectedDuration * 60 - timeRemaining) /
                          (selectedDuration * 60)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
