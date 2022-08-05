import request from "supertest";
import * as http from "http";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

let server: http.Server;
const data = {
  email: faker.internet.email(),
  username: faker.internet.userName().substring(0, 15),
  password: faker.internet.password(),
};
let mockedUser: User & { token: string };

beforeAll(async () => {
  const mod = await import("@/index");
  server = (mod as any).default;

  const addUser = await request(server).post("/api/user").send({ user: data });
  mockedUser = addUser.body.user;
});

afterAll((done) => {
  if (server) {
    server.close(done);
  }
});

describe("TodoController", () => {
  const todo = {
    description: faker.lorem.sentence(),
    color: faker.internet.color(),
  };

  describe("post /todo", () => {
    it("should create a new todo", async () => {
      const res = await request(server)
        .post("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo });
      expect(res.statusCode).toEqual(200);
    });

    it("should throw an error while creating todo with empty description", async () => {
      const res = await request(server)
        .post("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...todo, description: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("DESCRIPTION_REQUIRED");
    });

    it("should throw an error while creating todo with empty color", async () => {
      const res = await request(server)
        .post("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...todo, color: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("COLOR_REQUIRED");
    });
  });

  describe("get /todos", () => {
    it("should get all todos", async () => {
      const res = await request(server)
        .get("/api/todos")
        .set("Authorization", `Bearer ${mockedUser.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.todos.length).toBeGreaterThan(0);
    });
  });

  describe("put /todo", () => {
    const editedTodo = {
      id: 0,
      description: faker.lorem.sentence(),
      color: faker.internet.color(),
    };

    it("should edit a todo", async () => {
      const addTodoRes = await request(server)
        .post("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo });
      editedTodo.id = addTodoRes.body.todo.id;

      const res = await request(server)
        .put("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: editedTodo });
      expect(res.statusCode).toEqual(200);
      expect(res.body.todo.description).toMatch(editedTodo.description);
      expect(res.body.todo.color).toMatch(editedTodo.color);
    });

    it("should throw an error while editing todo with empty description", async () => {
      const res = await request(server)
        .put("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...editedTodo, description: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("DESCRIPTION_REQUIRED");
    });

    it("should throw an error while editing todo with empty color", async () => {
      const res = await request(server)
        .put("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...editedTodo, color: "" } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("COLOR_REQUIRED");
    });

    it("should throw an error while editing todo with invalid id", async () => {
      const res = await request(server)
        .put("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...editedTodo, id: -1 } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("ID_IS_INVALID");
    });

    it("should throw an error while todo to edit does not exist", async () => {
      const res = await request(server)
        .put("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { ...editedTodo, id: 99999 } });
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toMatch("TODO_NOT_FOUND");
    });
  });

  describe("delete /todo", () => {
    it("should delete a todo", async () => {
      const addTodoRes = await request(server)
        .post("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo });
      const res = await request(server)
        .delete("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { id: addTodoRes.body.todo.id } });
      expect(res.statusCode).toEqual(200);
    });

    it("should throw an error while deleting todo with invalid id", async () => {
      const res = await request(server)
        .delete("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { id: -1 } });
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toMatch("ID_IS_INVALID");
    });

    it("should throw an error while todo to delete does not exist", async () => {
      const res = await request(server)
        .delete("/api/todo")
        .set("Authorization", `Bearer ${mockedUser.token}`)
        .send({ todo: { id: 99999 } });
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toMatch("TODO_NOT_FOUND");
    });
  });
});
