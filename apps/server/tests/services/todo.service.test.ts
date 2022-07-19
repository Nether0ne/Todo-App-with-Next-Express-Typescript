import { faker } from "@faker-js/faker";
import { createTodo, updateTodo, deleteTodo } from "@services/todo.service";
import { TodoInput } from "@models/todo/input.model";
import { TodoEditInput } from "@models/todo/edit.model";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
afterAll(async () => {
  await prisma.$disconnect();
});

const user = {
  email: faker.internet.email(),
  username: faker.internet.userName().substring(0, 15),
  password: faker.internet.password(),
};

let mockedUser: User;
beforeAll(async () => {
  mockedUser = await prisma.user.create({ data: user });
});

describe("TodoService", () => {
  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const todo: TodoInput = {
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
      };

      await createTodo(mockedUser, todo);

      const addedTodo = await prisma.todo.findFirst({
        where: todo,
      });

      expect(addedTodo).toBeDefined();
    });

    it("should throw an error when creating new todo with empty description", async () => {
      const todo: TodoInput = {
        description: "",
        color: faker.internet.color(),
      };

      const error = "DESCRIPTION_REQUIRED";
      await expect(createTodo(mockedUser, todo)).rejects.toThrow(error);
    });

    it("should throw an error when creating new todo with empty color", async () => {
      const todo: TodoInput = {
        description: faker.lorem.sentence(),
        color: "",
      };

      const error = "COLOR_REQUIRED";
      await expect(createTodo(mockedUser, todo)).rejects.toThrow(error);
    });
  });

  describe("updateTodo", () => {
    it("should update a todo with new description, color and completed status", async () => {
      const todo = {
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
      };

      const { id } = await createTodo(mockedUser, todo);

      const editTodo: TodoEditInput = {
        id,
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
        completed: true,
      };

      const editedTodo = await updateTodo(mockedUser, editTodo);
      expect(editedTodo).toMatchObject(editTodo);
    });

    it("should throw an error while updating todo with negative id", async () => {
      const todo = {
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
      };

      const { id } = await createTodo(mockedUser, todo);

      const editTodo: TodoEditInput = {
        id: -id,
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
        completed: true,
      };

      const error = "ID_IS_INVALID";
      await expect(updateTodo(mockedUser, editTodo)).rejects.toThrow(error);
    });

    it("should throw an error while updating non-existing todo", async () => {
      const editTodo: TodoEditInput = {
        id: 99999,
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
        completed: true,
      };

      const error = "TODO_NOT_FOUND";
      await expect(updateTodo(mockedUser, editTodo)).rejects.toThrow(error);
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", async () => {
      const todo = {
        description: faker.lorem.sentence(),
        color: faker.internet.color(),
      };
      const { id } = await createTodo(mockedUser, todo);

      await deleteTodo(mockedUser, { id });

      const missingTodo = await prisma.todo.findFirst({
        where: { id },
      });

      expect(missingTodo).toBeNull();
    });
  });

  it("should throw an error while updating todo with negative id", async () => {
    const error = "ID_IS_INVALID";
    await expect(deleteTodo(mockedUser, { id: -1 })).rejects.toThrow(error);
  });

  it("should throw an error while updating non-existing todo", async () => {
    const error = "TODO_NOT_FOUND";
    await expect(deleteTodo(mockedUser, { id: 99999 })).rejects.toThrow(error);
  });
});
