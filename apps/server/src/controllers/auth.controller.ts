import { NextFunction, Request, Response, Router } from "express";
import { auth } from "@utils/auth.utils";
import { createUser, getCurrentUser, login } from "../services/auth.service";

const router = Router();

/**
 * Create a new user
 * @auth none
 * @route {POST} /user
 * @bodyParam user User
 * @returns user User
 */
router.post(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await createUser(req.body.user);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Login
 * @auth none
 * @route {POST} /user/login
 * @bodyParam user User
 * @returns user User
 */
router.post(
  "/user/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login(req.body.user);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Get current user
 * @auth required
 * @route {GET} /user
 * @returns user User
 */
router.get(
  "/user",
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.body.user?.username as string);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
