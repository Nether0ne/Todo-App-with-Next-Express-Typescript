import bcrypt from "bcryptjs";
import { RegisterInput } from "@models/auth/register-input.model";
import HttpException from "@models/misc/http-exception.model";
import prisma from "@prisma/prisma-instance";
import { generateToken, getPayload } from "@utils/token.utils";
import { User } from "@prisma/client";
import { Request } from "express";

const checkIfUserExists = async (email: string, username: string) => {
  const userWithEmail = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  const userWithUsername = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (userWithEmail || userWithUsername) {
    throw new HttpException(422, {
      errors: { [userWithEmail ? email : username]: "is already in use." },
    });
  }
};

export const createUser = async (input: RegisterInput) => {
  const email = input.email.trim();
  const username = input.username.trim();
  const password = input.password.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkIfUserExists(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  return {
    ...user,
    token: generateToken(user),
  };
};

export const login = async (userPayload: Partial<User>) => {
  const email = userPayload.email?.trim();
  const password = userPayload.password?.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      createdAt: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        token: generateToken(user),
      };
    }
  }

  throw new HttpException(403, {
    errors: {
      "email or password": ["is invalid"],
    },
  });
};

export const getCurrentUser = async (username: string) => {
  if (!username) {
    throw new HttpException(422, {
      errors: { username: ["was not provided"] },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  return user;
};

export const getUserFromRequest = (req: Request): Partial<User> => {
  return getPayload(req);
};
