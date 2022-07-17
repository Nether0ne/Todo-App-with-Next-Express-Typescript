import { Router } from "express";
import authController from "@controllers/auth.controller";
import todoController from "@controllers/todo.controller";

const api = Router().use(authController, todoController);

export default Router().use("/api", api);
