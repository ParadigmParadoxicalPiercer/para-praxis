// API service for user profile and dashboard data using shared axios instance
import api from "../configs/axios";

// Get user profile
export async function getUserProfile() {
  const res = await api.get("/users/profile");
  return res.data; // backend wraps in { status, message, data }
}

// Update user profile
export async function updateUserProfile(profileData) {
  const res = await api.put("/users/profile", profileData);
  return res.data;
}

// Get focus session statistics
export async function getFocusStats() {
  const res = await api.get("/focus/stats");
  return res.data;
}

// Get tasks statistics
export async function getTasksStats() {
  const { data } = await api.get("/tasks");
  const payload = data?.data;
  const tasks = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.tasks)
    ? payload.tasks
    : [];

  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };
}

// Get workout plans statistics
export async function getWorkoutStats() {
  const { data } = await api.get("/workout-plans");
  const workoutPlans = data.data.workoutPlans || [];

  // Calculate consecutive days (simplified - you might want to enhance this)
  const totalExercises = workoutPlans.reduce(
    (acc, plan) => acc + plan.exercises.length,
    0
  );
  const completedExercises = workoutPlans.reduce(
    (acc, plan) => acc + plan.exercises.filter((ex) => ex.completed).length,
    0
  );

  return {
    totalPlans: workoutPlans.length,
    totalExercises,
    completedExercises,
    consecutiveDays: Math.floor(completedExercises / 3), // Simplified calculation
  };
}
