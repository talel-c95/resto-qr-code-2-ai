import bcrypt from "bcrypt";
import { Customer } from "../models/Customer";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/errors";
import { RegisterPayload, LoginPayload, AuthResponse } from "../types/auth.types";

export async function registerCustomer(payload: RegisterPayload): Promise<AuthResponse> {
  const existing = await Customer.findOne({ email: payload.email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const customer = await Customer.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  const token = signToken({
    id: customer._id.toString(),
    email: customer.email,
    role: "customer",
  });

  return {
    user: {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      role: "customer",
    },
    token,
  };
}

export async function loginCustomer(payload: LoginPayload): Promise<AuthResponse> {
  const customer = await Customer.findOne({ email: payload.email });
  if (!customer) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(payload.password, customer.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    id: customer._id.toString(),
    email: customer.email,
    role: "customer",
  });

  return {
    user: {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      role: "customer",
    },
    token,
  };
}