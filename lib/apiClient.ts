import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

// Token cookie name
const TOKEN_COOKIE_NAME = "auth_token";

// Determine if we're in production
const isProduction = process.env.NODE_ENV === "production";

// Base URL for API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

export const setAuthToken = (
  token: string,
  expiresInDays: number = 7
): void => {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: expiresInDays,
    secure: isProduction, // HTTPS only in production
    sameSite: "strict",
    path: "/",
  });
};


export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
};


const createAxiosInstance = (includeAuth: boolean = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if required
      if (includeAuth) {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && includeAuth) {
        removeAuthToken();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error("Network error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};


// Authenticated API client
export const apiClientAuth = createAxiosInstance(true);

// Public API client
export const apiClient = createAxiosInstance(false);

export class ApiClient {
  private authClient: AxiosInstance;
  private publicClient: AxiosInstance;

  constructor() {
    this.authClient = apiClientAuth;
    this.publicClient = apiClient;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.authClient.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.authClient.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.authClient.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.authClient.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.authClient.delete<T>(url, config);
    return response.data;
  }

  async getPublic<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.publicClient.get<T>(url, config);
    return response.data;
  }

  async postPublic<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.publicClient.post<T>(url, data, config);
    return response.data;
  }

  async putPublic<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.publicClient.put<T>(url, data, config);
    return response.data;
  }

  async deletePublic<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.publicClient.delete<T>(url, config);
    return response.data;
  }
}

// Export a singleton instance
export const api = new ApiClient();

// Export default
export default api;
