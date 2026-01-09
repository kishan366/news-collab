import { apiRequest } from "../utils/apiClient";

export const registerUser = (data) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyOtp = (data) =>
  apiRequest("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
