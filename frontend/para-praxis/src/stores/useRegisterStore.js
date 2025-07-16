import { create } from "zustand";
import { register as registerService } from "../services/auth.service";
import { registerSchema } from "../utils/validationSchemas";
import { authToast } from "../utils/toast";

export const useRegisterStore = create((set, get) => ({
  form: {
    email: "",
    username: "",
    password: "",
    confirm: "",
  },
  errors: {},
  serverError: "",
  loading: false,

  setFormField: (name, value) => {
    set((state) => ({
      form: { ...state.form, [name]: value },
      errors: { ...state.errors, [name]: "" },
    }));
  },

  resetForm: () => {
    set({
      form: {
        email: "",
        username: "",
        password: "",
        confirm: "",
      },
      errors: {},
      serverError: "",
    });
  },

  setServerError: (msg) => set({ serverError: msg }),

  handleSubmit: async (e) => {
    e.preventDefault();
    set({ serverError: "" });

    try {
      await registerSchema.validate(get().form, { abortEarly: false });
      set({ errors: {} });
    } catch (validationError) {
      const errObj = {};
      validationError.inner.forEach((err) => {
        errObj[err.path] = err.message;
      });
      set({ errors: errObj });
      return;
    }

    set({ loading: true });
    try {
      await registerService(get().form);

      // Show success toast using modular utility
      authToast.registerSuccess();

      get().resetForm();

      // Redirect to login page after successful registration
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";

      // Show error toast using modular utility
      authToast.registrationError(errorMessage);

      set({ serverError: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));
