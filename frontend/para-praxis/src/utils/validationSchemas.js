import * as Yup from "yup";

// Shared email schema (single source of truth)
export const emailSchema = Yup.string().email("Must be a valid email");

// Convenience helper for one-off checks outside of form schemas
export function isEmail(value) {
  return emailSchema.isValidSync(value);
}

export const registerSchema = Yup.object({
  email: emailSchema.required("Email is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export const loginSchema = Yup.object({
  email: emailSchema.required("Email is required"),
  password: Yup.string().required("Password is required"),
});
