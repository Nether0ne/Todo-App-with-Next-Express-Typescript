import { Todo } from "@customTypes/Todo";
import { Axios, AxiosError } from "axios";

const todoList = async (client: Axios): Promise<Todo[]> => {
  try {
    const todos = (await client.get("/api/todos")).data.todos;
    return todos as Todo[];
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const response = e.response?.statusText;
      if (response) {
        throw new Error(response);
      } else {
        throw new Error("Unknown error has appeared");
      }
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export default todoList;
