import { toast } from "react-toastify";

// Default toast configurations
const defaultConfig = {
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Persona 5 themed styles
const toastStyles = {
  success: {
    backgroundColor: "#065f46",
    color: "#ffffff",
    border: "2px solid #10b981",
  },
  error: {
    backgroundColor: "#7f1d1d",
    color: "#ffffff",
    border: "2px solid #dc2626",
  },
  info: {
    backgroundColor: "#1e40af",
    color: "#ffffff",
    border: "2px solid #3b82f6",
  },
  warning: {
    backgroundColor: "#92400e",
    color: "#ffffff",
    border: "2px solid #f59e0b",
  },
};

// Toast utility functions
export const showToast = {
  success: (message, customConfig = {}) => {
    toast.success(message, {
      ...defaultConfig,
      autoClose: 3000,
      style: toastStyles.success,
      ...customConfig,
    });
  },

  error: (message, customConfig = {}) => {
    toast.error(message, {
      ...defaultConfig,
      autoClose: 4000,
      style: toastStyles.error,
      ...customConfig,
    });
  },

  info: (message, customConfig = {}) => {
    toast.info(message, {
      ...defaultConfig,
      autoClose: 3000,
      style: toastStyles.info,
      ...customConfig,
    });
  },

  warning: (message, customConfig = {}) => {
    toast.warning(message, {
      ...defaultConfig,
      autoClose: 3500,
      style: toastStyles.warning,
      ...customConfig,
    });
  },
};

// Specific toast messages for common actions
export const toastMessages = {
  auth: {
    registerSuccess: "Registration successful! Please login!",
    loginSuccess: "Login successful! Welcome back!",
    logoutSuccess: "Logged out successfully!",
    invalidCredentials: "Invalid email or password",
    registrationFailed: "Registration failed. Please try again.",
    loginFailed: "Login failed. Please try again.",
  },
  general: {
    serverError: "Server error - please try again later",
    networkError: "Network error - please check your connection",
    validationError: "Please check your input and try again",
  },
};

// Convenience functions for authentication
export const authToast = {
  registerSuccess: () => showToast.success(toastMessages.auth.registerSuccess),
  loginSuccess: () =>
    showToast.success(toastMessages.auth.loginSuccess, { autoClose: 2000 }),
  logoutSuccess: () => showToast.info(toastMessages.auth.logoutSuccess),
  registrationError: (message) =>
    showToast.error(message || toastMessages.auth.registrationFailed),
  loginError: (message) =>
    showToast.error(message || toastMessages.auth.loginFailed),
};
