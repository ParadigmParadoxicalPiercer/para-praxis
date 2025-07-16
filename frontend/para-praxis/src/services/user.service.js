// API service for user profile and dashboard data
const API_BASE = "/api";

// Get user profile
export async function getUserProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await response.json();
}

// Update user profile
export async function updateUserProfile(profileData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return await response.json();
}

// Get focus session statistics
export async function getFocusStats() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/focus/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch focus stats");
  }

  return await response.json();
}

// Get tasks statistics
export async function getTasksStats() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();
  const tasks = data.data.tasks || [];

  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };
}

// Get workout plans statistics
export async function getWorkoutStats() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/workout-plans`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workout plans");
  }

  const data = await response.json();
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
