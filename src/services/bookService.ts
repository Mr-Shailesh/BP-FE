import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { Book, CreateBookDto, UpdateBookDto, BooksResponse, SingleBookResponse } from "../types/book";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors (copied from authService for consistency or we should ideally export a shared instance)
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

export const bookService = {
  getAllBooks: (): Promise<AxiosResponse<BooksResponse>> => 
    api.get("/books"),

  getBookById: (id: string): Promise<AxiosResponse<SingleBookResponse>> => 
    api.get(`/books/${id}`),

  createBook: (data: CreateBookDto): Promise<AxiosResponse<SingleBookResponse>> => 
    api.post("/books", data),

  updateBook: (id: string, data: UpdateBookDto): Promise<AxiosResponse<SingleBookResponse>> => 
    api.put(`/books/${id}`, data),

  deleteBook: (id: string): Promise<AxiosResponse<any>> => 
    api.delete(`/books/${id}`),
};
