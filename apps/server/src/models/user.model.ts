import { Todo } from "@models/todo.model";

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  todos: Todo[];
}
