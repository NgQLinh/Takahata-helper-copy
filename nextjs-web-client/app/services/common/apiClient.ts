import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "@/app/config/config";
import { ApiProblemDetails } from "@/app/types/common/ApiProblemDetails ";
import { ApiError } from "@/app/types/common/ApiError";
import { v4 as uuidv4 } from "uuid";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
};

apiClient.interceptors.request.use(
  (request) => {
    request.headers["X-Correlation-ID"] = uuidv4();

    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiProblemDetails>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 403) {
      logout();
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken || !refreshToken) {
        logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${config.apiUrl}/authentication/refresh`,
          {
            accessToken,
            refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Correlation-ID": uuidv4(),
            },
          },
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data));
    }

    return Promise.reject(
      new ApiError({
        status: 500,
        title: "Network Error",
        detail: "Không thể kết nối tới server",
      }),
    );
  },
);
