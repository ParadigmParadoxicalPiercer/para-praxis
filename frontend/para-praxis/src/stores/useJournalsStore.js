import { create } from "zustand";
import journalsApi from "../services/journals.service";
import { toast } from "react-toastify";

export const useJournalsStore = create((set, get) => ({
  journals: [],
  selectedId: null,
  loading: false,
  saving: false,
  search: "",
  page: 1,
  hasNext: false,
  total: 0,
  error: null,
  // Track ids that were just created and haven't yet shown a toast
  _newlyCreatedIds: new Set(),

  setSearch: (search) => set({ search, page: 1 }),
  select: (id) => set({ selectedId: id }),
  selected: () => get().journals.find((j) => j.id === get().selectedId) || null,

  load: async (more = false) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const page = more ? get().page + 1 : 1;
      const params = { page, q: get().search, limit: 25 };
      const res = await journalsApi.fetchJournals(params);
      const data = res.data.data || [];
      const pagination = res.data.pagination || {};
      set({
        journals: more ? [...get().journals, ...data] : data,
        page: pagination.page || page,
        hasNext: pagination.hasNext || false,
        total: pagination.total || data.length,
      });
      // Auto select first if none selected
      if (!get().selectedId && data.length) set({ selectedId: data[0].id });
    } catch (e) {
      set({ error: e.message || "Failed to load journals" });
    } finally {
      set({ loading: false });
    }
  },

  create: async (partial = {}) => {
    try {
      const payload = {
        title: partial.title || "Untitled",
        content: partial.content || "",
      };
      const res = await journalsApi.createJournal(payload);
      const created = res.data.data;
      const state = get();
      state._newlyCreatedIds.add(created.id);
      set({
        journals: [created, ...state.journals],
        selectedId: created.id,
        _newlyCreatedIds: state._newlyCreatedIds,
      });
      return created;
    } catch (e) {
      toast.error(e.response?.data?.message || "Create failed");
      throw e;
    }
  },

  update: async (id, data) => {
    set({ saving: true });
    try {
      const res = await journalsApi.updateJournal(id, data);
      const updated = res.data.data;
      const state = get();
      set({
        journals: [
          updated,
          ...state.journals
            .filter((j) => j.id !== id)
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            ),
        ],
      });
      if (state._newlyCreatedIds.has(id)) {
        toast.success("Journal created");
        state._newlyCreatedIds.delete(id);
        set({ _newlyCreatedIds: state._newlyCreatedIds });
      }
    } catch (e) {
      // Surface backend validation messages (e.g., missing title) clearly
      const backendMsg = e.response?.data?.message;
      if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error("Save failed");
      }
      throw e;
    } finally {
      set({ saving: false });
    }
  },

  remove: async (id) => {
    if (!confirm("Delete entry?")) return;
    try {
      await journalsApi.deleteJournal(id);
      const remaining = get().journals.filter((j) => j.id !== id);
      set({ journals: remaining, selectedId: remaining[0]?.id || null });
      toast.info("Journal deleted");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  },
}));

export default useJournalsStore;
