import { useState, useEffect, useRef } from "react";

export function useFocusTimer() {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const intervalRef = useRef(null);

  // Initialize timer when duration changes
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      setTimeRemaining(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning, isCompleted]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // TODO: Play completion sound
            // TODO: Show completion notification
            // TODO: Save focus session to database
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining]);

  const startTimer = () => {
    if (timeRemaining > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeRemaining(selectedDuration * 60);
  };

  const formatTime = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    timeRemaining,
    isRunning,
    isCompleted,
    selectedDuration,
    setSelectedDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  };
}
