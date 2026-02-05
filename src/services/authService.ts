import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { AuthResponse, ApiResponse } from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle response errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: (firstName: string, lastName: string, email: string, password: string, passwordConfirm: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    }),

  login: (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => 
    api.post("/auth/login", { email, password }),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get("/auth/me"),
};
