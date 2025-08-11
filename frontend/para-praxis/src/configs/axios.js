import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3333/api",
  withCredentials: true, // Enable sending cookies with requests
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    // ถ้าคืน 401
    if (error.response.status === 401) {
      // Handle token refresh logic here
      try {
        const response = await instance.get("auth/refresh-token");
        // ถ้ารีเฟรชสำเร็จ ให้เก็บ access token ใหม่

        const newAccessToken = response.data.accessToken;
        // ตั้งค่า access token ใหม่ใน localStorage
        localStorage.setItem("accessToken", newAccessToken);
        // อัพเดต header ของ request เดิม
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // Retry the original request with the new token
        return instance(originalRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }
  }
);
