/**
 * Shared authentication types.
 */

export type UserRole = "admin" | "customer" | "guest";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
