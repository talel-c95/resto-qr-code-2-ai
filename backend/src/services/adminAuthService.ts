import bcrypt from "bcrypt";
import { Admin } from "../models/Admin";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/errors";
import { RegisterPayload, LoginPayload, AuthResponse } from "../types/auth.types";

export async function registerAdmin(payload: RegisterPayload): Promise<AuthResponse> {
  const existing = await Admin.findOne({ email: payload.email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const admin = await Admin.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  const token = signToken({
    id: admin._id.toString(),
    email: admin.email,
    role: "admin",
  });

  return {
    user: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: "admin",
    },
    token,
  };
}

export async function loginAdmin(payload: LoginPayload): Promise<AuthResponse> {
  const admin = await Admin.findOne({ email: payload.email });
  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(payload.password, admin.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    id: admin._id.toString(),
    email: admin.email,
    role: "admin",
  });

  return {
    user: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: "admin",
    },
    token,
  };
}

export async function getAdminById(id: string) {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new AppError("Admin not found", 404);
  }
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: "admin" as const,
  };
}