import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/errors.js";

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function registerUser(payload) {
  const existing = await User.findOne({ email: payload.email });

  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || "operator"
  });

  const token = signToken(user);

  return {
    token,
    user: user.toSafeObject()
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);

  return {
    token,
    user: user.toSafeObject()
  };
}

export async function getUserById(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "Authentication session is no longer valid");
  }

  return user.toSafeObject();
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
