import * as yup from "yup";

export const uploadMediaSchema = yup.object().shape({
  url: yup
    .string()
    .url("Must be a valid URL")
    .required("Media URL is required"),
  publicId: yup.string().required("Public ID is required"),
  taskId: yup
    .number()
    .positive("Task ID must be a positive number")
    .integer("Task ID must be an integer")
    .optional(),
  journalId: yup
    .number()
    .positive("Journal ID must be a positive number")
    .integer("Journal ID must be an integer")
    .optional(),
  workoutExerciseId: yup
    .number()
    .positive("Workout Exercise ID must be a positive number")
    .integer("Workout Exercise ID must be an integer")
    .optional(),
});
