import HttpException from "@models/misc/http-exception.model";
import { TodoEditInput } from "@models/todo/edit.model";
import { TodoInput } from "@models/todo/input.model";
import { User } from "@prisma/client";
import prisma from "@prisma/prisma-instance";

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

  const todo = await prisma.todo.create({
    data: {
      description,
      color,
      createdBy: { connect: { id: createdBy.id } },
    },
  });

  return todo;
};

export const updateTodo = async (
  editedBy: Partial<User>,
  editInput: TodoEditInput,
) => {
  const { id, description, color } = editInput;

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

  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      description,
      color,
    },
  });
};

export const deleteTodo = async (deletedBy: Partial<User>, id: number) => {
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
