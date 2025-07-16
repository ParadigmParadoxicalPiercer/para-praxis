import * as yup from "yup";

export const createWorkoutExerciseSchema = yup.object().shape({
  name: yup
    .string()
    .required("Exercise name is required")
    .min(2, "Exercise name must be at least 2 characters")
    .max(100, "Exercise name must not exceed 100 characters"),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  reps: yup
    .number()
    .positive("Reps must be a positive number")
    .integer("Reps must be an integer")
    .optional(),
  sets: yup
    .number()
    .positive("Sets must be a positive number")
    .integer("Sets must be an integer")
    .optional(),
  workoutPlanId: yup
    .number()
    .positive("Workout plan ID must be a positive number")
    .integer("Workout plan ID must be an integer")
    .required("Workout plan ID is required"),
});

export const updateWorkoutExerciseSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Exercise name must be at least 2 characters")
    .max(100, "Exercise name must not exceed 100 characters")
    .optional(),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  reps: yup
    .number()
    .positive("Reps must be a positive number")
    .integer("Reps must be an integer")
    .optional(),
  sets: yup
    .number()
    .positive("Sets must be a positive number")
    .integer("Sets must be an integer")
    .optional(),
  completed: yup.boolean().optional(),
});
