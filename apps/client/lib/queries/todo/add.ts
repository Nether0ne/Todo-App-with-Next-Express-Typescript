import { Todo, TodoAdd } from "@customTypes/Todo";
import { AxiosError } from "axios";
import initAxios from "@queries/client";

const addTodo = async (todoToAdd: TodoAdd): Promise<Todo> => {
  try {
    const client = initAxios();
    const todo = (await client.post("/api/todo", { todo: todoToAdd })).data
      .todo;

    return todo as Todo;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error } = e.response?.data;

      if (error) {
        if (error === "DESCRIPTION_REQUIRED") {
          throw new Error("Description is required");
        } else if (error === "COLOR_REQUIRED") {
          throw new Error("Color is required");
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        throw new Error("Unknown error has appeared");
      }
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default addTodo;
