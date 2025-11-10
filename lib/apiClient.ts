import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getAuthToken, removeAuthToken } from "./tokenManager";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// single Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeAuthToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export class ApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = axiosInstance) {
    this.client = client;
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): Promise<T> {
    const response = await this.client.get<T>(url, this.prepareConfig(config));
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): Promise<T> {
    const response = await this.client.post<T>(
      url,
      data,
      this.prepareConfig(config)
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): Promise<T> {
    const response = await this.client.put<T>(
      url,
      data,
      this.prepareConfig(config)
    );
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): Promise<T> {
    const response = await this.client.patch<T>(
      url,
      data,
      this.prepareConfig(config)
    );
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): Promise<T> {
    const response = await this.client.delete<T>(
      url,
      this.prepareConfig(config)
    );
    return response.data;
  }

  // handle skipAuth option
  private prepareConfig(
    config?: AxiosRequestConfig & { skipAuth?: boolean }
  ): AxiosRequestConfig {
    if (!config) return {};

    const { skipAuth, ...axiosConfig } = config;

    if (skipAuth) {
      return {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          Authorization: undefined,
        },
      };
    }

    return axiosConfig;
  }
}

export const api = new ApiClient();
export default api;
