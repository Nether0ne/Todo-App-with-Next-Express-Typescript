import { Todo } from "@customTypes/Todo";
import { AxiosError } from "axios";
import initAxios from "../client";

const deleteTodo = async (todoToDelete: Todo): Promise<void> => {
  try {
    const client = initAxios();
    await client.delete("/api/todo", { data: { todo: todoToDelete } });
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const { error } = e.response?.data;

      if (error === "TODO_NOT_FOUND") {
        throw new Error("Todo not found");
      } else {
        throw new Error("Something went wrong");
      }
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default deleteTodo;
