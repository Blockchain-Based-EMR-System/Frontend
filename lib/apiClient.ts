import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from "axios";

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

const clearAllAuthStateAndReload = () => {
  if (typeof window !== "undefined") {
    
    localStorage.clear();
    
    sessionStorage.clear();
        
    window.location.replace("/login");
  }
};

const refreshAuthToken = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/refresh");
    
    refreshTokenPromise = null;
    console.log("✅ Token refreshed successfully");
  } catch (error) {
    refreshTokenPromise = null;
    
    if (typeof window !== "undefined") {
      console.error("❌ Token refresh failed");
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
      if (originalRequest.url?.includes('/auth/refresh')) {
        console.error("❌ Refresh endpoint returned 401");
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
  }
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
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
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