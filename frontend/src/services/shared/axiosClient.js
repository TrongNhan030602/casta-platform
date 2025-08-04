import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Gửi cookie refresh_token
});

// Gắn access token trước mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự refresh token nếu bị 401
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu response trả về access_token mới thì lưu lại
    if (response.data?.access_token) {
      setAccessToken(response.data.access_token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh");

    if (isUnauthorized) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, null, {
          withCredentials: true,
        });

        const newAccessToken = res.data?.access_token;

        if (!newAccessToken) {
          clearAccessToken();
          return Promise.reject(new Error("Không lấy được access_token"));
        }

        setAccessToken(newAccessToken);

        // Gắn token mới vào request cũ rồi retry
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
