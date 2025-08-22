import api from "../configs/axios";

// Create a new focus session
export async function createFocusSession({ duration, task, notes, completedAt }) {
  const res = await api.post("/focus", {
    duration,
    task,
    notes,
    completedAt,
  });
  return res.data;
}

export default { createFocusSession };
