export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthResponseUser;
  token: string;
}