import { Todo, TodoEdit } from "@customTypes/Todo";
import { AxiosError } from "axios";
import initAxios from "../client";

const editTodo = async (todoToEdit: TodoEdit): Promise<Todo> => {
  try {
    const client = initAxios();
    const todo = (await client.put("/api/todo", { todo: todoToEdit })).data
      .todo;

    return todo as Todo;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error } = e.response?.data;
      console.log(error);
      if (error === "TODO_NOT_FOUND") {
        throw new Error("Todo not found");
      } else if (error === "DESCRIPTION_REQUIRED") {
        throw new Error("Description is required");
      } else if (error === "COLOR_REQUIRED") {
        throw new Error("Color is required");
      } else {
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default editTodo;
