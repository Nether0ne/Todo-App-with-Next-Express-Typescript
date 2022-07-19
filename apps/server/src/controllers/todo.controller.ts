import { getUserFromRequest } from "@services/auth.service";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@services/todo.service";
import { auth } from "@utils/auth.utils";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

/**
 * Get todos list
 * @auth required
 * @route {GET} /todos
 * @returns todos Todo[]
 */
router.get(
  "/todos",
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromRequest(req);
      const todos = await getTodos(user);
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create a new todo
 * @auth required
 * @route {POST} /todo
 * @bodyParam todo TodoInput
 * @returns todo Todo
 */
router.post(
  "/todo",
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromRequest(req);
      const todoInput = req.body.todo;
      const newTodo = await createTodo(user, todoInput);
      res.status(200).json({ todo: newTodo });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update an existing todo
 * @auth required
 * @route {PUT} /todo
 * @bodyParam todo TodoEditInput
 * @returns todo Todo
 */
router.put(
  "/todo",
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromRequest(req);
      const editInput = req.body.todo;
      const updatedTodo = await updateTodo(user, editInput);
      res.status(200).json({ todo: updatedTodo });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Deletes an existing todo
 * @auth required
 * @route {DELETE} /todo
 * @bodyParam number id
 */
router.delete(
  "/todo",
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUserFromRequest(req);
      const toDeleteTodoId = req.body.todo;
      await deleteTodo(user, toDeleteTodoId);
      res.status(200).send("OK");
    } catch (error) {
      next(error);
    }
  },
);

export default router;
