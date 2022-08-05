import { faker } from "@faker-js/faker";
import { createUser, getCurrentUser, login } from "@services/auth.service";
import { RegisterInput } from "@models/auth/register-input.model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
afterAll(async () => {
  await prisma.$disconnect();
});

const data = {
  email: faker.internet.email(),
  username: faker.internet.userName().substring(0, 15),
  password: faker.internet.password(),
};

describe("AuthService", () => {
  describe("createUser", () => {
    it("should create a new user", async () => {
      const userInput: RegisterInput = { ...data };
      await createUser(userInput);

      const user = await prisma.user.findFirst({
        where: { email: userInput.email },
      });

      expect(user).toBeDefined();
    });

    it("should throw an error when creating new user with empty username ", async () => {
      const userInput: RegisterInput = { ...data };
      userInput.username = " ";

      const error = "USERNAME_REQUIRED";
      await expect(createUser(userInput)).rejects.toThrow(error);
    });

    it("should throw an error when creating new user with empty email ", async () => {
      const userInput: RegisterInput = { ...data };
      userInput.email = " ";

      const error = "EMAIL_REQUIRED";
      await expect(createUser(userInput)).rejects.toThrow(error);
    });

    it("should throw an error when creating new user with empty password ", async () => {
      const userInput: RegisterInput = { ...data };
      userInput.password = " ";

      const error = "PASSWORD_REQUIRED";
      await expect(createUser(userInput)).rejects.toThrow(error);
    });

    it("should throw an exception when creating a new user with already existing user on same username ", async () => {
      const userInput: RegisterInput = { ...data };
      const error = "USER_ALREADY_EXISTS";
      await expect(createUser(userInput)).rejects.toThrow(error);
    });
  });

  describe("login", () => {
    test("should return a token", async () => {
      const userInput = { ...data };
      await expect(login(userInput)).resolves.toHaveProperty("token");
    });

    test("should throw an error when the email is empty", async () => {
      const userInput = { ...data };
      userInput.email = "";

      const error = "EMAIL_REQUIRED";
      await expect(login(userInput)).rejects.toThrow(error);
    });

    test("should throw an error when the password is empty", async () => {
      const userInput = { ...data };
      userInput.password = "";

      const error = "PASSWORD_REQUIRED";
      await expect(login(userInput)).rejects.toThrow(error);
    });

    test("should throw an error when no user is found", async () => {
      const userInput = { ...data };
      userInput.email = faker.internet.email();

      const error = "INVALID_CREDENTIALS";
      await expect(login(userInput)).rejects.toThrow(error);
    });

    test("should throw an error if the password is wrong", async () => {
      const userInput = { ...data };
      userInput.password = faker.internet.password();

      const error = "INVALID_CREDENTIALS";
      await expect(login(userInput)).rejects.toThrow(error);
    });
  });

  describe("getCurrentUser", () => {
    test("should return current user", async () => {
      const username = data.email;
      const user = await getCurrentUser(username);

      expect(user).toBeDefined();
    });

    test("should throw an error when the email is empty", async () => {
      const email = "";

      const error = "EMAIL_REQUIRED";
      await expect(getCurrentUser(email)).rejects.toThrow(error);
    });
  });
});
