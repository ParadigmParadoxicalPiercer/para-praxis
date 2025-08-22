import React, { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { useTasksStore } from "../../../stores/useTasksStore";

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

  // Global sound controls
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const lastVolumeRef = useRef(0.6);

  // Persist sound preferences
  useEffect(() => {
    try {
      const savedEnabled = localStorage.getItem("timerSoundEnabled");
      const savedVolume = localStorage.getItem("timerSoundVolume");
      if (savedEnabled !== null) setSoundEnabled(savedEnabled === "true");
      if (savedVolume !== null) {
        const v = parseFloat(savedVolume);
        if (!Number.isNaN(v)) setVolume(Math.max(0, Math.min(1, v)));
      }
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("timerSoundEnabled", String(soundEnabled));
      localStorage.setItem("timerSoundVolume", String(volume));
    } catch {
      // ignore
    }
  }, [soundEnabled, volume]);

  // Sounds via use-sound (public/sound/*.mp3)
  const [playStart] = useSound("/sound/timerstart.mp3", {
    volume,
    interrupt: true,
    preload: true,
    soundEnabled,
  });
  const [playPause] = useSound("/sound/timerpause.mp3", {
    volume,
    interrupt: true,
    preload: true,
    soundEnabled,
  });
  const [playResume] = useSound("/sound/timerresume.mp3", {
    volume,
    interrupt: true,
    preload: true,
    soundEnabled,
  });
  const [playReset] = useSound("/sound/timerreset.mp3", {
    volume,
    interrupt: true,
    preload: true,
    soundEnabled,
  });
  const [playChime, { stop: stopChime }] = useSound("/sound/chime.mp3", {
    volume,
    interrupt: true,
    preload: true,
    soundEnabled,
  });

  // Tasks integration
  const tasksStore = useTasksStore();
  const { tasks, load, getUrgentTasks, loading: tasksLoading } = tasksStore;
  const urgent = getUrgentTasks(3);

  // Local UI state for fade-out when completing a task from the timer view
  const [completing, setCompleting] = useState({});

  const handleComplete = (task) => {
    if (completing[task.id]) return; // already animating
    // Start strike-through + fade-out
    setCompleting((prev) => ({ ...prev, [task.id]: true }));
    // After animation, actually toggle completion in store so urgent list refreshes
    setTimeout(async () => {
      try {
        await tasksStore.toggle(task);
      } finally {
        // Clean up local state just in case (usually the item will unmount)
        setCompleting((prev) => {
          const { [task.id]: _omit, ...rest } = prev;
          return rest;
        });
      }
    }, 700); // keep in sync with CSS duration
  };

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      load();
    }
  }, [tasks, load]);

  // Ensure when navigating here from a scrolled page (e.g., profile) we start at top
  useEffect(() => {
    // Use instant jump; could change to smooth if preferred
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const formatDue = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const predefinedDurations = [
    { label: "15 min", value: 15 },
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  const handleCustomDuration = () => {
    if (customMinutes > 0 && customMinutes <= 640) {
      setSelectedDuration(customMinutes);
    }
  };
  // Wheel scroll minutes (prevent whole page scroll while hovering input)
  const minutesInputRef = useRef(null);
  useEffect(() => {
    const el = minutesInputRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!minutesInputRef.current) return;
      const hovered =
        minutesInputRef.current === e.target ||
        minutesInputRef.current.contains(e.target);
      if (!hovered) return; // only intercept when pointer over input
      e.preventDefault();
      e.stopPropagation();
      const direction = Math.sign(e.deltaY); // positive when scrolling down
      setCustomMinutes((prev) => {
        let next = prev - direction; // scrolling up (deltaY negative) increases minutes
        if (next < 1) next = 1;
        if (next > 640) next = 640;
        return next;
      });
    };
    // Add listener on window with capture so we catch before default scroll; passive:false to allow preventDefault
    window.addEventListener("wheel", onWheel, {
      capture: true,
      passive: false,
    });
    return () =>
      window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  // Adjust timer font size when hours appear (HH:MM:SS gets wider)
  const timeDisplay = formatTime(timeRemaining);
  const isHourMode = timeDisplay.length > 5; // length 8 like 01:00:00
  const isPaused =
    !isRunning &&
    !isCompleted &&
    timeRemaining > 0 &&
    timeRemaining < selectedDuration * 60;

  // Play chime when a session completes
  useEffect(() => {
    if (isCompleted) {
      try {
        playChime();
      } catch {
        // ignore
      }
    }
  }, [isCompleted, playChime]);

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

      <div className="relative z-20 flex flex-col md:flex-row w-full items-stretch">
        {/* Left half - Chronos inspiration */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12">
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
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md w-full">
            {/* Timer Display */}
            <div className="text-center mb-8">
              {/* Fixed-height container to eliminate vertical shift when switching formats */}
              <div className="h-28 sm:h-32 lg:h-36 flex items-center justify-center mb-4 select-none">
                <div
                  className={`font-extrabold text-blue-600 font-mono tracking-tight leading-none ${
                    isHourMode
                      ? "text-6xl sm:text-7xl lg:text-7xl"
                      : "text-8xl sm:text-8xl lg:text-9xl"
                  }`}
                >
                  {timeDisplay}
                </div>
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
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    if (v > 640) return setCustomMinutes(640);
                    setCustomMinutes(v);
                  }}
                  ref={minutesInputRef}
                  className="flex-1 px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 font-medium"
                  placeholder="Custom minutes"
                  min="1"
                  max="640"
                  disabled={isRunning}
                />
                <button
                  onClick={handleCustomDuration}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
                  disabled={isRunning}
                >
                  Set
                </button>
                {customMinutes > 60 && (
                  <div className="text-xs text-slate-500 font-medium self-center ml-1 whitespace-nowrap">
                    {Math.floor(customMinutes / 60)}h {customMinutes % 60}m
                  </div>
                )}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-3 mb-6">
              {!isRunning ? (
                <button
                  onClick={() => {
                    try {
                      if (isPaused) {
                        playResume();
                      } else {
                        playStart();
                      }
                    } catch {
                      // ignore
                    }
                    startTimer();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors"
                >
                  {isPaused ? "RESUME" : "START FOCUS"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    try {
                      playPause();
                    } catch {
                      // ignore
                    }
                    pauseTimer();
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded transition-colors"
                >
                  PAUSE
                </button>
              )}
              <button
                onClick={() => {
                  // Stop any playing audio and reset
                  try {
                    stopChime();
                  } catch {
                    // ignore
                  }
                  try {
                    playReset();
                  } catch {
                    // ignore
                  }
                  resetTimer();
                }}
                disabled={isRunning}
                className={`flex-1 font-semibold py-3 px-6 rounded border transition-colors ${
                  isRunning
                    ? "bg-white text-slate-400 border-slate-200 cursor-not-allowed"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300"
                }`}
              >
                RESET
              </button>
            </div>

            {/* Task Preview Area */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="text-blue-700 font-semibold mb-3 flex items-center justify-between">
                <span>Urgent Tasks</span>
                <span className="text-xs font-medium text-slate-500">
                  {tasksLoading
                    ? "Loading..."
                    : urgent.length
                    ? `${urgent.length} shown`
                    : "None"}
                </span>
              </h4>
              <div className="space-y-2">
                {tasksLoading && (
                  <div className="text-slate-500 text-sm italic">
                    Loading tasks...
                  </div>
                )}
                {!tasksLoading && urgent.length === 0 && (
                  <div className="text-slate-500 text-sm italic">
                    No high-priority upcoming tasks.
                  </div>
                )}
                {urgent.map((t) => {
                  const dueSoon =
                    t.dueDate &&
                    new Date(t.dueDate) <
                      new Date(Date.now() + 1000 * 60 * 60 * 24);
                  return (
                    <div
                      key={t.id}
                      className={`flex items-start gap-3 bg-white rounded border border-slate-200 px-3 py-2 shadow-sm transition-all duration-700 ease-out ${
                        completing[t.id] ? "opacity-0 translate-y-1" : ""
                      }`}
                    >
                      {/* Complete button */}
                      <button
                        onClick={() => handleComplete(t)}
                        title="Mark as done"
                        className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                          completing[t.id]
                            ? "bg-green-600 border-green-600 text-white"
                            : "border-slate-300 hover:border-green-600 hover:text-green-600"
                        }`}
                        aria-label={`Complete ${t.title}`}
                      >
                        {completing[t.id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm14.03-2.28a.75.75 0 10-1.06-1.06l-4.72 4.72-1.72-1.72a.75.75 0 10-1.06 1.06l2.25 2.25c.3.3.79.3 1.06 0l5.25-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-transparent" />
                        )}
                      </button>
                      <div
                        className={`mt-1 h-3 w-3 rounded-full ${
                          t.priority === 3
                            ? "bg-red-500"
                            : t.priority === 2
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        title={`Priority ${t.priority}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-slate-800 text-sm truncate ${
                            completing[t.id] ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {t.title}
                        </div>
                        {t.dueDate && (
                          <div className="text-xs text-slate-500 flex gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1">
                              <span className="uppercase tracking-wide">
                                Due
                              </span>{" "}
                              {formatDue(t.dueDate)}
                            </span>
                            {dueSoon && (
                              <span className="text-red-600 font-medium">
                                Soon
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {t.dueDate && (
                        <div className="text-[10px] font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(t.dueDate) - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}
                          d
                        </div>
                      )}
                    </div>
                  );
                })}
                {urgent.length > 0 && (
                  <div className="pt-1 text-right">
                    <a
                      href="/tasks"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View all tasks →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Sound controls (moved below tasks) */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  // Toggle mute without losing previous volume
                  setSoundEnabled((v) => {
                    const next = !v;
                    if (!next) {
                      // going to OFF: remember last non-zero volume
                      if (volume > 0) lastVolumeRef.current = volume;
                    } else {
                      // going to ON: if volume is 0, restore previous
                      if (volume === 0) setVolume(lastVolumeRef.current || 0.6);
                    }
                    return next;
                  });
                }}
                className={`h-8 px-2 rounded border text-xs font-medium leading-none transition-colors ${
                  soundEnabled
                    ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
                aria-pressed={soundEnabled}
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? "Sound toggle: On" : "Sound toggle: Off"}
              </button>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(volume * 100)}
                  onChange={(e) => setVolume((+e.target.value || 0) / 100)}
                  className="w-full h-2 accent-blue-600"
                  aria-label="Volume"
                />
                <span className="text-xs text-slate-600 w-10 text-right">
                  {Math.round(volume * 100)}%
                </span>
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
