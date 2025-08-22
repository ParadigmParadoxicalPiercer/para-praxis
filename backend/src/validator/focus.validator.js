import * as yup from "yup";

export const createFocusSchema = yup.object({
  duration: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  task: yup.string().optional().min(1, "Task cannot be empty"),
  notes: yup.string().optional(),
  completedAt: yup.date().optional(),
});

export const updateFocusSchema = yup.object({
  duration: yup
    .number()
    .optional()
    .min(1, "Duration must be at least 1 minute"),
  task: yup.string().optional().min(1, "Task cannot be empty"),
  notes: yup.string().optional(),
  completedAt: yup.date().optional(),
});
