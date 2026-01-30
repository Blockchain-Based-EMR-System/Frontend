import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshTokenPromise: Promise<any> | null = null;
let isLoggingOut = false; 

export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
  console.log(`🔓 [API Client] Logout flag set to: ${value}`);
};

const clearClientCookies = () => {
  if (typeof document !== "undefined") {
    document.cookie = `UserState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `UserState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  }
};

const clearAllAuthStateAndReload = () => {
  if (typeof window !== "undefined") {
    if (isLoggingOut) {
      return;
    }

    localStorage.clear();
    sessionStorage.clear();
    clearClientCookies();

    window.location.replace("/login");
  }
};

const refreshAuthToken = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post("/auth/refresh");

    refreshTokenPromise = null;
  } catch (error: any) {
    refreshTokenPromise = null;
    console.error(
      "❌ Token refresh failed:",
      error.response?.status,
      error.message,
    );

    if (typeof window !== "undefined") {
      clearAllAuthStateAndReload();
    }

    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/auth/refresh")) {
        clearAllAuthStateAndReload();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (refreshTokenPromise) {
        try {
          await refreshTokenPromise;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      refreshTokenPromise = refreshAuthToken();

      try {
        await refreshTokenPromise;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);

export class ApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = axiosInstance) {
    this.client = client;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
export default api;
