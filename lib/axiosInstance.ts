import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tend.grandmart.az:6004/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Only add the interceptor in client-side environment
if (typeof window !== 'undefined') {
  axiosInstance.interceptors.request.use(
    (config) => {
      const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
      config.headers["Accept-Language"] = match ? match[2] : "en";
      return config;
    },
    (error) => Promise.reject(error)
  );
}
