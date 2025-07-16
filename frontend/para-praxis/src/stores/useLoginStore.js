import { create } from "zustand";
import { login as loginService } from "../services/auth.service";
import { loginSchema } from "../utils/validationSchemas";
import { authToast } from "../utils/toast";

export const useLoginStore = create((set, get) => ({
  form: {
    email: "",
    password: "",
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
        password: "",
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
      await loginSchema.validate(get().form, { abortEarly: false });
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
      const response = await loginService(
        get().form.email,
        get().form.password
      );
      // Show success toast using modular utility
      authToast.loginSuccess();

      // Store the JWT token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // Store user data
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      get().resetForm();

      // Redirect to user page after successful login
      setTimeout(() => {
        window.location.href = "/user";
      }, 1500);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";

      // Show error toast using modular utility
      authToast.loginError(errorMessage);

      set({ serverError: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));
