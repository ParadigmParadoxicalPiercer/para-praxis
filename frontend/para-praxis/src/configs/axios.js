// Brief: Axios instance with auth header + refresh-once on 401.
import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../auth/token";

const instance = axios.create({
  baseURL: "http://localhost:3333/api",
  withCredentials: true, // Enable sending cookies with requests
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: retry once on 401 by attempting a refresh
// Skips retry for refresh/logout endpoints to avoid loops on sign-out
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // Only retry 401s once, and don't retry refresh requests
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
  !originalRequest.url?.includes("/auth/refresh") &&
  !originalRequest.url?.includes("/auth/logout")
    ) {
      originalRequest._retry = true;
      try {
        const response = await instance.post("/auth/refresh");
        const newAccessToken = response?.data?.data?.accessToken;
        if (!newAccessToken)
          throw new Error("No access token in refresh response");
        setAccessToken(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
