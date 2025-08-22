// Brief: Client for workout plans/exercises/templates endpoints.
import api from "../configs/axios";

export const listPlans = (params = {}) => api.get("/workout-plans", { params });
export const getPlan = (id) => api.get(`/workout-plans/${id}`);
export const createPlan = (data) => api.post("/workout-plans", data);
export const updatePlan = (id, data) => api.put(`/workout-plans/${id}`, data);
export const deletePlan = (id) => api.delete(`/workout-plans/${id}`);

export const listTemplates = (params = {}) =>
  api.get("/workout-plans/templates", { params });
export const createFromTemplate = (payload) =>
  api.post("/workout-plans/templates", payload);

export const addExercise = (planId, data) =>
  api.post(`/workout-plans/${planId}/exercises`, data);

export const markExerciseComplete = (id) =>
  api.patch(`/workout-exercises/${id}/complete`);
export const markExerciseIncomplete = (id) =>
  api.patch(`/workout-exercises/${id}/incomplete`);

export default {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listTemplates,
  createFromTemplate,
  addExercise,
  markExerciseComplete,
  markExerciseIncomplete,
};
