import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Single Axios instance with cookie support
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CRITICAL: Sends cookies with every request
});

// Token refresh logic
let refreshTokenPromise: Promise<any> | null = null;

const refreshAuthToken = async (): Promise<void> => {
  try {
    // Call refresh endpoint - new cookies are set automatically
    await axiosInstance.post("/auth/refresh");
    
    // No manual token storage needed!
    // Browser automatically updates cookies via Set-Cookie header
    
    refreshTokenPromise = null;
  } catch (error) {
    refreshTokenPromise = null;
    
    if (typeof window !== "undefined") {
      console.error("❌ Token refresh failed, redirecting to login");
      
      // Clear any client-side auth state if you have it
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      window.location.href = "/login";
    }
    
    throw error;
  }
};

// Response interceptor - handles 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 unauthorized errors (expired access token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already in progress, wait for it
      if (refreshTokenPromise) {
        try {
          await refreshTokenPromise;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start a new token refresh
      refreshTokenPromise = refreshAuthToken();

      try {
        await refreshTokenPromise;
        // Retry the original request with new cookies
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
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
    const response = await this.client.put<T>(url, data, config);
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