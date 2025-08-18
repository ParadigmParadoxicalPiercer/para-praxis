import { create } from "zustand";
import tasksApi from "../services/tasks.service";
import { toast } from "react-toastify";

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  filter: { status: "all" },
  error: null,
  // Derived helpers (computed on demand)
  getUrgentTasks: (limit = 3) => {
    return [...get().tasks]
      .filter((t) => !t.completed && t.dueDate)
      .sort((a, b) => {
        // Sort by priority desc (3 high -> 1 low) then earliest due date
        if (b.priority !== a.priority) return b.priority - a.priority;
        const aDue = new Date(a.dueDate).getTime();
        const bDue = new Date(b.dueDate).getTime();
        return aDue - bDue;
      })
      .slice(0, limit);
  },

  setFilter: (partial) => set({ filter: { ...get().filter, ...partial } }),

  load: async () => {
    set({ loading: true, error: null });
    try {
      const { filter } = get();
      const params = {};
      if (filter.status === "completed") params.status = "completed";
      if (filter.status === "active") params.status = "active";
      const res = await tasksApi.fetchTasks(params);
      set({ tasks: res.data.data || [] });
    } catch (e) {
      set({ error: e.message || "Failed to load tasks" });
    } finally {
      set({ loading: false });
    }
  },

  add: async (data) => {
    try {
      const res = await tasksApi.createTask(data);
      set({ tasks: [res.data.data, ...get().tasks] });
      toast.success("Task created");
    } catch (e) {
      toast.error(e.response?.data?.message || "Create failed");
      throw e;
    }
  },

  toggle: async (task) => {
    try {
      const res = await tasksApi.updateTask(task.id, {
        completed: !task.completed,
      });
      set({
        tasks: get().tasks.map((t) => (t.id === task.id ? res.data.data : t)),
      });
    } catch {
      toast.error("Update failed");
    }
  },

  update: async (id, data) => {
    const res = await tasksApi.updateTask(id, data);
    set({ tasks: get().tasks.map((t) => (t.id === id ? res.data.data : t)) });
  },

  remove: async (id) => {
    if (!confirm("Delete task?")) return;
    try {
      await tasksApi.deleteTask(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
      toast.info("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  },
}));

export default useTasksStore;
