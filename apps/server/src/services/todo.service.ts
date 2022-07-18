import HttpException from "@models/misc/http-exception.model";
import { TodoInput } from "@models/todo/input.model";
import { TodoEditInput } from "@models/todo/edit.model";
import { TodoDeleteInput } from "@/models/todo/delete.model";
import { User } from "@prisma/client";
import prisma from "@myPrisma/prisma-instance";

export const getTodos = async (createdBy: Partial<User>) => {
  return await prisma.todo.findMany({ where: { createdById: createdBy.id } });
};

export const createTodo = async (
  createdBy: Partial<User>,
  input: TodoInput,
) => {
  const { description, color } = input;
  if (!description) {
    throw new HttpException(422, "DESCRIPTION_REQUIRED");
  }

  if (!color) {
    throw new HttpException(422, "COLOR_REQUIRED");
  }

  return await prisma.todo.create({
    data: {
      description,
      color,
      createdBy: { connect: { id: createdBy.id } },
    },
  });
};

export const updateTodo = async (
  editedBy: Partial<User>,
  editInput: TodoEditInput,
) => {
  const { id, description, color, completed } = editInput;

  if (!description) {
    throw new HttpException(422, "DESCRIPTION_REQUIRED");
  }

  if (!color) {
    throw new HttpException(422, "COLOR_REQUIRED");
  }

  if (id < 0) {
    throw new HttpException(422, "ID_IS_INVALID");
  }

  const foundTodo = await prisma.todo.findFirst({
    where: {
      id,
      createdById: editedBy.id,
    },
  });

  if (!foundTodo) {
    throw new HttpException(404, "TODO_NOT_FOUND");
  }

  return await prisma.todo.update({
    where: {
      id,
    },
    data: {
      description,
      color,
      completed,
    },
  });
};

export const deleteTodo = async (
  deletedBy: Partial<User>,
  deleteInput: TodoDeleteInput,
) => {
  const { id } = deleteInput;
  if (id < 0) {
    throw new HttpException(422, "ID_IS_INVALID");
  }

  const foundTodo = await prisma.todo.findFirst({
    where: {
      id,
      createdById: deletedBy.id,
    },
  });

  if (!foundTodo) {
    throw new HttpException(404, "TODO_NOT_FOUND");
  }

  await prisma.todo.delete({ where: { id } });
};
