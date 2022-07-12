import { Router } from "express";
import authController from "@controllers/auth.controller";

const api = Router().use(authController);

export default Router().use("/api", api);
