import api from "../configs/axios";

export const fetchJournals = (params = {}) => api.get("/journals", { params });
export const getJournal = (id) => api.get(`/journals/${id}`);
export const createJournal = (data) => api.post("/journals", data);
export const updateJournal = (id, data) => api.patch(`/journals/${id}`, data);
export const deleteJournal = (id) => api.delete(`/journals/${id}`);

export default {
  fetchJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
};
