// Brief: Client for managing user workout templates (own presets).
import api from "../configs/axios";

export const listUserTemplates = () => api.get("/workout-templates");
export const createUserTemplate = (data) => api.post("/workout-templates", data);
export const addExerciseToUserTemplate = (id, data) => api.post(`/workout-templates/${id}/exercises`, data);
export const deleteUserTemplate = (id) => api.delete(`/workout-templates/${id}`);

export default {
  listUserTemplates,
  createUserTemplate,
  addExerciseToUserTemplate,
  deleteUserTemplate,
};
