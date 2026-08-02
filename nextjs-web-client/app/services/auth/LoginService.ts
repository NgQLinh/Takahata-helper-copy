import { LoginRequest, LoginResponse } from "@/app/types";
import { apiClient } from "../common/apiClient";

export const loginAsync = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  console.log("[LOGIN] Starting login", {
    url: "/Authentication/login",
    hasUsername: Boolean(data),
    currentOrigin:
      typeof window !== "undefined"
        ? window.location.origin
        : "server-side",
  });

  try {
    const response = await apiClient.post<LoginResponse>(
      "/Authentication/login",
      data,
    );

    console.log("[LOGIN] Login successful", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("[LOGIN] Login failed", error);
    throw error;
  }
};