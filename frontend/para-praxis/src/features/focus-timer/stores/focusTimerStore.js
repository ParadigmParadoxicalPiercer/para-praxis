import { create } from "zustand";

export const useFocusTimerStore = create((set, get) => ({
  // Focus sessions history
  focusSessions: [],

  // Current session stats
  todaysFocusTime: 0,
  weeklyFocusTime: 0,
  totalFocusTime: 0,

  // Session settings
  defaultDuration: 25,
  soundEnabled: true,
  notificationsEnabled: true,

  // Actions
  addFocusSession: (sessionData) => {
    set((state) => ({
      focusSessions: [
        ...state.focusSessions,
        {
          id: Date.now(),
          duration: sessionData.duration,
          completed: sessionData.completed,
          startTime: sessionData.startTime,
          endTime: sessionData.endTime,
          date: new Date().toISOString().split("T")[0],
          ...sessionData,
        },
      ],
    }));
  },

  updateTodaysFocusTime: (minutes) => {
    set((state) => ({
      todaysFocusTime: state.todaysFocusTime + minutes,
    }));
  },

  updateWeeklyFocusTime: (minutes) => {
    set((state) => ({
      weeklyFocusTime: state.weeklyFocusTime + minutes,
    }));
  },

  updateTotalFocusTime: (minutes) => {
    set((state) => ({
      totalFocusTime: state.totalFocusTime + minutes,
    }));
  },

  setDefaultDuration: (duration) => {
    set({ defaultDuration: duration });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },

  toggleNotifications: () => {
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled }));
  },

  // Get focus sessions for a specific date
  getFocusSessionsForDate: (date) => {
    const sessions = get().focusSessions;
    return sessions.filter((session) => session.date === date);
  },

  // Get total focus time for today
  getTodaysFocusTime: () => {
    const today = new Date().toISOString().split("T")[0];
    const sessions = get().getFocusSessionsForDate(today);
    return sessions.reduce((total, session) => {
      return total + (session.completed ? session.duration : 0);
    }, 0);
  },

  // Get weekly focus time
  getWeeklyFocusTime: () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sessions = get().focusSessions;

    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= oneWeekAgo && sessionDate <= today;
      })
      .reduce((total, session) => {
        return total + (session.completed ? session.duration : 0);
      }, 0);
  },

  // Get focus streak (consecutive days with at least one focus session)
  getFocusStreak: () => {
    const sessions = get().focusSessions;
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = checkDate.toISOString().split("T")[0];
      const daysSessions = sessions.filter(
        (s) => s.date === dateStr && s.completed
      );

      if (daysSessions.length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  // Clear all focus sessions (for testing/reset)
  clearAllSessions: () => {
    set({
      focusSessions: [],
      todaysFocusTime: 0,
      weeklyFocusTime: 0,
      totalFocusTime: 0,
    });
  },
}));
