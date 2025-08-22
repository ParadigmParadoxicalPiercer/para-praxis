import * as yup from "yup";

export const createWorkoutPlanSchema = yup.object().shape({
  name: yup
    .string()
    .required("Workout plan name is required")
    .min(2, "Workout plan name must be at least 2 characters")
    .max(100, "Workout plan name must not exceed 100 characters"),
  week: yup
    .number()
    .positive("Week must be a positive number")
    .integer("Week must be an integer")
    .optional(),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  equipment: yup.mixed().oneOf(["BODYWEIGHT", "DUMBBELL", "GYM"]).optional(),
  goal: yup
    .mixed()
    .oneOf(["LOSE_WEIGHT", "FITNESS", "BULK", "V_TAPER"]) 
    .optional(),
});

export const updateWorkoutPlanSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Workout plan name must be at least 2 characters")
    .max(100, "Workout plan name must not exceed 100 characters")
    .optional(),
  week: yup
    .number()
    .positive("Week must be a positive number")
    .integer("Week must be an integer")
    .optional(),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  equipment: yup.mixed().oneOf(["BODYWEIGHT", "DUMBBELL", "GYM"]).optional(),
  goal: yup
    .mixed()
    .oneOf(["LOSE_WEIGHT", "FITNESS", "BULK", "V_TAPER"]) 
    .optional(),
});

export const addExerciseToWorkoutPlanSchema = yup.object().shape({
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
});
