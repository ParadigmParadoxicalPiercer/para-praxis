import api from "../configs/axios";

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { status, message, data: { user, accessToken, refreshToken } }
}

export async function register({ email, username, password, confirm }) {
  const res = await api.post("/auth/register", {
    email,
    name: username,
    password,
    confirmPassword: confirm,
  });
  return res.data;
}
