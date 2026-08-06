import adminApi from "./adminApi";
import { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types/auth.types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await adminApi.post<AuthResponse>("/admin/auth/login", payload);
  return res.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await adminApi.post<AuthResponse>("/admin/auth/register", payload);
  return res.data;
}

export async function me(): Promise<User> {
  const res = await adminApi.get<User>("/admin/auth/me");
  return res.data;
}