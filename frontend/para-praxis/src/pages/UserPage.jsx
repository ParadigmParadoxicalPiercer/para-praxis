import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  getUserProfile,
  updateUserProfile,
  getFocusStats,
  getTasksStats,
  getWorkoutStats,
} from "../services/user.service";

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    focus: null,
    tasks: null,
    workout: null,
  });
  const [personalGoals, setPersonalGoals] = useState("");
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await getUserProfile();
      setUser(profileResponse.data);
      setPersonalGoals(profileResponse.data.personalGoals || "");

      // Fetch statistics
      const [focusStats, tasksStats, workoutStats] = await Promise.all([
        getFocusStats().catch(() => ({
          data: { sessionCount: 0, totalFocusTime: 0 },
        })),
        getTasksStats().catch(() => ({ total: 0, completed: 0 })),
        getWorkoutStats().catch(() => ({ consecutiveDays: 0, totalPlans: 0 })),
      ]);

      setStats({
        focus: focusStats.data || focusStats,
        tasks: tasksStats,
        workout: workoutStats,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    try {
      await updateUserProfile({ personalGoals });
      setIsEditingGoals(false);
      toast.success("Personal goals updated successfully!");
    } catch (error) {
      console.error("Error updating goals:", error);
      toast.error("Failed to update goals");
    }
  };

  const calculateDaysSince = (dateString) => {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-4xl font-bold text-white animate-pulse">
            Loading Profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-black/90 rounded-2xl p-8 shadow-2xl border-4 border-white mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-black text-red-600 drop-shadow persona5-font mb-4">
              USER PROFILE
            </h1>
            <div className="text-white text-2xl font-bold mb-2">
              Welcome back, {user?.name || "User"}!
            </div>
            <div className="text-yellow-300 text-lg">
              Account created{" "}
              {user?.createdAt ? calculateDaysSince(user.createdAt) : 0} days
              ago
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Focus Timer Stats */}
          <div className="bg-black/90 rounded-xl p-6 border-4 border-red-600 shadow-2xl">
            <h3 className="text-2xl font-bold text-red-500 mb-4 text-center">
              🎯 FOCUS TIMER
            </h3>
            <div className="text-center text-white space-y-2">
              <div className="text-3xl font-bold text-yellow-300">
                {stats.focus?.sessionCount || 0}
              </div>
              <div className="text-sm">Sessions Completed</div>
              <div className="text-lg text-red-300">
                {Math.round((stats.focus?.totalFocusTime || 0) / 60)} hours
                total
              </div>
            </div>
          </div>

          {/* Task Stats */}
          <div className="bg-black/90 rounded-xl p-6 border-4 border-yellow-500 shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4 text-center">
              ✅ TASKS
            </h3>
            <div className="text-center text-white space-y-2">
              <div className="text-3xl font-bold text-green-400">
                {stats.tasks?.completed || 0}
              </div>
              <div className="text-sm">Completed</div>
              <div className="text-lg text-yellow-300">
                {stats.tasks?.total || 0} total created
              </div>
            </div>
          </div>

          {/* Workout Stats */}
          <div className="bg-black/90 rounded-xl p-6 border-4 border-green-600 shadow-2xl">
            <h3 className="text-2xl font-bold text-green-500 mb-4 text-center">
              💪 WORKOUT
            </h3>
            <div className="text-center text-white space-y-2">
              <div className="text-3xl font-bold text-orange-400">
                {stats.workout?.consecutiveDays || 0}
              </div>
              <div className="text-sm">Consecutive Days</div>
              <div className="text-lg text-green-300">
                {stats.workout?.totalPlans || 0} plans created
              </div>
            </div>
          </div>
        </div>

        {/* Personal Goals Section */}
        <div className="bg-black/90 rounded-2xl p-8 shadow-2xl border-4 border-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-red-500">
              📋 PERSONAL GOALS
            </h2>
            <button
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              {isEditingGoals ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditingGoals ? (
            <div className="space-y-4">
              <textarea
                value={personalGoals}
                onChange={(e) => setPersonalGoals(e.target.value)}
                className="w-full h-32 p-4 bg-gray-800 text-white rounded-lg border-2 border-red-600 focus:border-yellow-500 focus:outline-none resize-none"
                placeholder="Enter your personal goals here..."
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSaveGoals}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  Save Goals
                </button>
                <button
                  onClick={() => {
                    setIsEditingGoals(false);
                    setPersonalGoals(user?.personalGoals || "");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-red-600/50">
              <div className="text-white text-lg leading-relaxed">
                {personalGoals ||
                  "No personal goals set yet. Click 'Edit' to add your goals!"}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/focus-timer")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            🎯 Start Focus Session
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            ✅ Add New Task
          </button>
          <button
            onClick={() => navigate("/workouts")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            💪 Create Workout Plan
          </button>
          <button
            onClick={() => navigate("/journal")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
          >
            📝 Write Journal
          </button>
        </div>
      </div>
    </div>
  );
}
