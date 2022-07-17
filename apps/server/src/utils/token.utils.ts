import { User } from "@prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { getTokenFromHeaders } from "./auth.utils";

export const generateToken = (user: Partial<User>): string =>
  jwt.sign(user, process.env.JWT_SECRET || "superSecret", { expiresIn: "30m" });

export const getPayload = (headers: Request): Partial<User> => {
  const token = getTokenFromHeaders(headers) as string;
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "superSecret",
  ) as Partial<User>;
};
