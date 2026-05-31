import axios from "axios";
import { config } from "../../config/config";

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["X-Correlation-ID"] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error),
);
