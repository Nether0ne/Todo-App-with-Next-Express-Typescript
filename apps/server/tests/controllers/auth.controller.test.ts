import request from "supertest";
import * as http from "http";
import { faker } from "@faker-js/faker";

let server: http.Server;
beforeAll(async () => {
  const mod = await import("@/index");
  server = (mod as any).default;
});

afterAll((done) => {
  if (server) {
    server.close(done);
  }
});

const data = {
  email: faker.internet.email(),
  username: faker.internet.userName().substring(0, 15),
  password: faker.internet.password(),
};

describe("AuthController", () => {
  describe("post /todo", () => {
    it("should create a new user", async () => {
      const res = await request(server).post("/api/user").send({ user: data });
      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toHaveProperty("token");
    });

    it("should throw an error while creating user with empty email", async () => {
      const res = await request(server)
        .post("/api/user")
        .send({ user: { ...data, email: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("EMAIL_REQUIRED");
    });

    it("should throw an error while creating user with empty username", async () => {
      const res = await request(server)
        .post("/api/user")
        .send({ user: { ...data, username: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("USERNAME_REQUIRED");
    });

    it("should throw an error while creating user with empty password", async () => {
      const res = await request(server)
        .post("/api/user")
        .send({ user: { ...data, password: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("PASSWORD_REQUIRED");
    });

    it("should throw an error while creating user with duplicate email", async () => {
      const res = await request(server).post("/api/user").send({ user: data });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("USER_ALREADY_EXISTS");
    });
  });

  describe("post /user/login", () => {
    it("should return a token", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ user: data });
      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toHaveProperty("token");
    });

    it("should throw an error while login with empty email", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ user: { ...data, email: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("EMAIL_REQUIRED");
    });

    it("should throw an error while login with empty password", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ user: { ...data, password: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("PASSWORD_REQUIRED");
    });

    it("should throw an error while login with invalid email", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ user: { ...data, email: faker.internet.email() } });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error).toMatch("INVALID_CREDENTIALS");
    });

    it("should throw an error while login with invalid password", async () => {
      const res = await request(server)
        .post("/api/user/login")
        .send({ user: { ...data, password: faker.internet.password() } });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error).toMatch("INVALID_CREDENTIALS");
    });
  });

  describe("get /user", () => {
    it("should return current user", async () => {
      const authRequest = await request(server)
        .post("/api/user/login")
        .send({ user: data });
      const token = authRequest.body.user.token;

      const res = await request(server)
        .get("/api/user")
        .set("Authorization", `Bearer ${token}`)
        .send({ user: { username: data.username } });
      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toBeDefined();
    });

    it("should throw an error while getting current user without token", async () => {
      const res = await request(server).get("/api/user");
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toMatch("UNAUTHORIZED");
    });

    it("should throw an error while getting current user with invalid token", async () => {
      const res = await request(server)
        .get("/api/user")
        .set("Authorization", "Bearer invalid");
      expect(res.statusCode).toEqual(401);
      expect(res.body.error).toMatch("UNAUTHORIZED");
    });
  });
});
