import { create } from "zustand";
import { login as loginService } from "../services/auth.service";
import { loginSchema } from "../utils/validationSchemas";
import { authToast } from "../utils/toast";
import { setAccessToken } from "../auth/token";
// Auth context user update handled by caller via onSuccess callback

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

  handleSubmit: async (e, onSuccess) => {
    e.preventDefault();
    set({ serverError: "" });

    try {
      await loginSchema.validate(get().form, { abortEarly: false });
      set({ errors: {} });
    } catch (validationError) {
      const errObj = {};
      validationError.inner.forEach((err) => {
        errObj[err.path] = err.message;
        console.error("Validation error:", err.message);
      });
      set({ errors: errObj });
      return;
    }

    set({ loading: true });
    try {
      const response = await loginService(get().form);
      console.log("Login response:", response);

      const accessToken = response?.data?.accessToken;
      console.log("Access Token:", accessToken);
      if (accessToken) {
        setAccessToken(accessToken);
      } else {
        console.error(" Login success but no access token received");
        throw new Error("Login successful but no access token received");
      }
      // Show success toast using modular utility
      authToast.loginSuccess();
      get().resetForm();

      if (onSuccess) {
        const user = response?.data?.user || null;
        setTimeout(() => onSuccess(user), 250); // quicker redirect
      }
      // Store the JWT token
      // if (response.token) {
      //   localStorage.setItem("token", response.token);
      // }

      // Store user data
      // if (response.user) {
      //   localStorage.setItem("user", JSON.stringify(response.user));
      // }

      // Redirect to user page after successful login
      // setTimeout(() => {
      //   window.location.href = "/user";
      // }, 1500);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      console.error("Login error:", errorMessage);
      // Show error toast using modular utility
      authToast.loginError(errorMessage);

      set({ serverError: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));
